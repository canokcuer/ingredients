# Implementation Roadmap

**Generated**: 2026-01-29
**Source**: Combined findings from 3 audits
**Scope**: Compliance fixes + consistency polish (no redesign)

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Gold contrast | Surgical: gold decorative only, text → black | Minimal brand impact |
| Glass-morphism | Remove if bg is solid white | Performance, no visible effect |
| Typography | Keep Inter | Focus on compliance, not polish |
| Spacing tokens | Skip | Over-engineering for single component |
| Container queries | Skip | Current breakpoints work |
| Section cleanup | Skip | Sections rarely dynamically removed |

---

## Task Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 1: CRITICAL (A11y)                 │
├─────────────────────────────────────────────────────────────┤
│  T1: Fix gold text contrast                                 │
│  T2: Fix carousel dots ARIA ──────────┐                     │
│  T3: Add tabindex to tab panels       │                     │
│  T4: Add external link indicators     │                     │
└───────────────────────────────────────┼─────────────────────┘
                                        │
┌───────────────────────────────────────▼─────────────────────┐
│                    PHASE 2: PERFORMANCE                     │
├─────────────────────────────────────────────────────────────┤
│  T5: Remove glass-morphism (depends: none)                  │
│  T6: Fix dot width animation → transform                    │
│  T7: Fix progress bar width → scaleX                        │
└─────────────────────────────────────────────────────────────┘
                                        │
┌───────────────────────────────────────▼─────────────────────┐
│                    PHASE 3: CONSISTENCY                     │
├─────────────────────────────────────────────────────────────┤
│  T8: Consolidate animation timings                          │
│  T9: Increase tab font size                                 │
│  T10: Fix/remove infinite pulse                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Critical Accessibility Fixes

### T1: Fix Gold Text Contrast

**Problem**: Gold (#D4AF37) on white = 2.9:1 (fails WCAG AA 4.5:1)
**Solution**: Change gold TEXT to black, keep gold for decorative elements

| Location | Line | Current | Change To |
|----------|------|---------|-----------|
| Tagline | 499 | `color: var(--hub-gold)` | `color: var(--hub-text)` |
| "GEÇTİ" result | 840 | `color: var(--hub-gold)` | `color: var(--hub-text)` |

**Keep as gold** (decorative, not text):
- Tab underline (line 557) ✓
- Focus outlines (lines 562, 655, 992) ✓
- Test indicator dot (line 793) ✓
- Check icon (line 822) ✓
- Progress bar gradient (line 871) ✓

**Verification**:
- [ ] Tagline text is now black
- [ ] "GEÇTİ" text is now black
- [ ] Gold check icon still appears next to "GEÇTİ"
- [ ] No other visual regressions

---

### T2: Fix Carousel Dots ARIA Semantics

**Problem**: `role="tablist/tab"` is incorrect for scroll position control
**Solution**: Remove ARIA roles, use simple buttons with descriptive labels

**Changes**:

| Line | Current | Change To |
|------|---------|-----------|
| 294 | `role="tablist" aria-label="İçerik seçici"` | `aria-label="Carousel navigation"` (remove role) |
| 298 | `role="tab"` | Remove attribute |
| 301 | `aria-selected="..."` | Remove attribute |

**Verification**:
- [ ] Carousel dots still function (click scrolls to card)
- [ ] No ARIA role on dot container
- [ ] aria-label remains on container for screen readers
- [ ] Each dot still has descriptive aria-label

---

### T3: Add tabindex to Tab Panels

**Problem**: Tab panels lack `tabindex="0"` for keyboard focus (APG compliance)
**Solution**: Add `tabindex="0"` to each tab panel

**Changes**:

| Line | Element | Add |
|------|---------|-----|
| 117-124 | Benefits panel | `tabindex="0"` |
| 145-151 | Articles panel | `tabindex="0"` |
| 198-204 | Tests panel | `tabindex="0"` |

**Verification**:
- [ ] Tab key moves focus into panel content after activating tab
- [ ] Screen reader announces panel content

---

### T4: Add External Link Indicators

**Problem**: Links with `target="_blank"` should indicate new window
**Solution**: Add visually hidden text + visible icon indicator

**Changes** (line 162-188):

Add to article card link text:
```liquid
<span class="visually-hidden">(yeni sekmede açılır)</span>
```

Add CSS for visually-hidden class (if not exists):
```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**Note**: The external link icon (arrow) already exists at line 181-187, providing visual indication. This adds screen reader support.

**Verification**:
- [ ] Screen reader announces "yeni sekmede açılır" for article links
- [ ] Visual appearance unchanged

---

## Phase 2: Performance Fixes

### T5: Remove Glass-morphism

**Problem**: `backdrop-filter: blur(12px)` costs performance; if background is solid white, blur is invisible
**Solution**: Remove backdrop-filter, use solid white background

**Changes**:

| Line | Current | Change To |
|------|---------|-----------|
| 424 | `background: rgba(255, 255, 255, 0.92)` | `background: var(--hub-card-bg)` |
| 425-426 | `backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);` | Remove |
| 434-438 | `@supports not` fallback block | Remove entire block (no longer needed) |

**Verification**:
- [ ] Cards have solid white background
- [ ] No backdrop-filter in computed styles
- [ ] Visual appearance similar (was nearly opaque anyway)
- [ ] Scroll performance improved on mobile

---

### T6: Fix Carousel Dot Width Animation

**Problem**: `width` transition causes layout thrashing
**Solution**: Use `transform: scaleX()` instead

**Changes** (lines 961-1000):

```css
/* Before */
.carousel-dot {
  width: 8px;
  transition: background-color 0.3s ease, width 0.3s ease, border-radius 0.3s ease;
}
.carousel-dot.is-active {
  width: 24px;
  border-radius: 4px;
}

/* After */
.carousel-dot {
  width: 8px;
  transition: background-color 0.25s ease-out, transform 0.25s ease-out;
}
.carousel-dot.is-active {
  transform: scaleX(3);
  border-radius: 4px;
}
```

**Verification**:
- [ ] Active dot still appears wider
- [ ] No layout shift during transition
- [ ] Animation feels smooth

---

### T7: Fix Progress Bar Width Animation

**Problem**: `width` animation causes layout; should use `transform`
**Solution**: Use `scaleX` with `transform-origin: left`

**Changes** (lines 868-879):

```css
/* Before */
.test-card__progress-bar {
  width: 0;
  animation: fillProgress 1s ease forwards;
}
@keyframes fillProgress {
  to { width: var(--progress, 100%); }
}

/* After */
.test-card__progress-bar {
  width: var(--progress, 100%);
  transform: scaleX(0);
  transform-origin: left;
  animation: fillProgress 0.5s ease-out forwards;
}
@keyframes fillProgress {
  to { transform: scaleX(1); }
}
```

Also update reduced-motion (line 1033-1034):
```css
.test-card__progress-bar {
  transform: scaleX(1) !important;
}
```

**Verification**:
- [ ] Progress bars animate from left to right
- [ ] Final width matches percentage
- [ ] No layout shift during animation
- [ ] Reduced motion shows full bar immediately

---

## Phase 3: Consistency Fixes

### T8: Consolidate Animation Timings

**Problem**: Inconsistent durations (0.2s, 0.3s, 0.35s, 0.6s, 1s)
**Solution**: Standardize to 3 values: 0.15s (fast), 0.25s (normal), 0.4s (emphasis)

**Changes**:

| Line | Current | Change To | Reason |
|------|---------|-----------|--------|
| 431 | `0.3s` | `0.25s` | Card hover |
| 477 | `0.3s` | `0.25s` | Image scale |
| 529 | `0.2s` | `0.15s` | Tab hover |
| 577 | `0.3s` | `0.25s` | fadeIn |
| 608 | `0.3s` | `0.25s` | slideInBenefit |
| 647 | `0.2s` | `0.15s` | Article hover |
| 649 | `0.3s` | `0.25s` | slideUpArticle |
| 709 | `0.2s` | `0.15s` | Arrow hover |
| 756 | `0.35s` | `0.25s` | popInCard |
| 757 | `0.3s` | `0.25s` | Test card hover |
| 823 | `0.6s` | `0.4s` | checkPop |
| 873 | (now 0.5s from T7) | Keep | fillProgress |
| 968 | `0.3s` | `0.25s` | Dot transition |

**Verification**:
- [ ] All animations feel responsive (not sluggish)
- [ ] No animation exceeds 0.5s (except deliberate emphasis)
- [ ] Stagger delays still work

---

### T9: Increase Tab Font Size

**Problem**: 0.75rem (12px) below recommended 14px minimum
**Solution**: Increase to 0.8125rem (13px)

**Change** (line 523):
```css
font-size: 0.8125rem;
```

**Verification**:
- [ ] Tab text readable on mobile
- [ ] Tabs still fit in available width
- [ ] No text overflow

---

### T10: Fix Infinite Pulse Animation

**Problem**: Infinite animations reserved for loading states only (per UX guidelines)
**Solution**: Remove pulse animation from test card indicator

**Changes** (lines 789-800):

```css
/* Before */
.test-card__indicator {
  animation: pulse 2s ease-in-out infinite;
}

/* After */
.test-card__indicator {
  /* Remove animation line */
}
```

Also remove the `@keyframes pulse` block (lines 797-800) since no longer used.

**Verification**:
- [ ] Gold indicator dots are static
- [ ] No infinite animations on page (except intentional loading states)

---

## Task Summary

| ID | Task | Phase | Est. Lines Changed |
|----|------|-------|-------------------|
| T1 | Fix gold text contrast | 1 | 2 |
| T2 | Fix carousel dots ARIA | 1 | 4 |
| T3 | Add tabindex to panels | 1 | 3 |
| T4 | Add external link indicators | 1 | 8 |
| T5 | Remove glass-morphism | 2 | 5 |
| T6 | Fix dot width animation | 2 | 6 |
| T7 | Fix progress bar animation | 2 | 8 |
| T8 | Consolidate animation timings | 3 | 13 |
| T9 | Increase tab font size | 3 | 1 |
| T10 | Remove pulse animation | 3 | 5 |

**Total estimated changes**: ~55 lines

---

## Execution Order

Tasks can be executed in any order within a phase. Recommended:

1. **T1, T2, T3, T4** (Phase 1) - Independent, can be parallel
2. **T5** (Phase 2) - Independent
3. **T6, T7** (Phase 2) - Related animations, do together
4. **T8, T9, T10** (Phase 3) - T8 last since it touches many lines

---

## Post-Implementation Verification

After all tasks:

- [ ] No WCAG AA contrast failures (test with axe-core or similar)
- [ ] All animations < 500ms
- [ ] No layout shift during animations
- [ ] Keyboard navigation works (Tab, Arrow keys, Enter)
- [ ] Screen reader announces tab panels and external links
- [ ] Mobile scroll performance smooth
- [ ] Visual appearance maintains gold/black/white aesthetic
