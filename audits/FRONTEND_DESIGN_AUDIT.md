# Frontend Design Audit

**File**: `sections/ingredient-science-hub.liquid`
**Date**: 2026-01-29
**Auditor**: Claude Code
**Focus**: CSS Architecture, Performance, JavaScript Patterns, Modern CSS Opportunities

---

## Executive Summary

The codebase is well-structured with BEM naming conventions and scoped CSS custom properties. However, there are opportunities to modernize the CSS architecture, improve performance, and leverage newer CSS features.

---

## 1. CSS Architecture Analysis

### 1.1 Strengths

| Aspect | Lines | Assessment |
|--------|-------|------------|
| BEM Naming | Throughout | Consistent `.block__element--modifier` pattern |
| CSS Custom Properties | 319-341 | Well-scoped to section ID |
| Fallbacks | 434-438 | `@supports` for backdrop-filter |
| Logical Organization | 314-1037 | Clear section comments |

### 1.2 Issues Found

```
ingredient-science-hub.liquid:337 - Generic font stack uses Inter, a common "AI slop" choice. Consider distinctive typography like DM Sans, Outfit, or Plus Jakarta Sans.
```

```
ingredient-science-hub.liquid:319-341 - CSS variables defined at ID level but many are duplicated with hardcoded values throughout (e.g., #F8F8F8 appears at lines 643, 926 instead of using --hub-gray-light).
```

```
ingredient-science-hub.liquid:458 - Hardcoded gradient colors: linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%). Should use CSS variables.
```

```
ingredient-science-hub.liquid:643 - background: #F8F8F8 hardcoded instead of using CSS variable.
```

```
ingredient-science-hub.liquid:665 - background: #F0F0F0 hardcoded for hover state.
```

```
ingredient-science-hub.liquid:926 - background: #F8F8F8 hardcoded again.
```

### 1.3 CSS Specificity Analysis

| Selector Type | Count | Risk Level |
|---------------|-------|------------|
| ID selectors | 1 (root) | Low |
| Class selectors | 87 | Low |
| Element selectors | 0 | Good |
| !important | 6 | Acceptable (reduced-motion only) |

**Assessment**: Specificity is well-controlled. All `!important` usages are justified for accessibility overrides.

---

## 2. Modern CSS Opportunities

### 2.1 Missing Modern Features

```
ingredient-science-hub.liquid:374 - grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) could benefit from container queries for more precise control.
```

**Recommendation**: Add container queries for card-level responsive behavior:
```css
@container (min-width: 400px) {
  .test-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

```
ingredient-science-hub.liquid:350-357 - Heading lacks text-wrap: balance for better line breaks.
```

```
ingredient-science-hub.liquid:881-887 - .test-card__percent should use font-variant-numeric: tabular-nums for aligned numbers.
```

```
ingredient-science-hub.liquid:314-1037 - No CSS @layer usage. Consider layering for better cascade control:
```

**Recommendation**:
```css
@layer reset, tokens, components, utilities;
```

### 2.2 Modern Selectors Not Used

| Feature | Opportunity | Lines |
|---------|------------|-------|
| `:has()` | Parent selection for empty states | 191-193 |
| `:is()` / `:where()` | Reduce repetition | 540-548 |
| `@container` | Component-level breakpoints | 378-417 |
| `color-mix()` | Dynamic color variations | 321-334 |

---

## 3. Performance Analysis

### 3.1 Expensive Properties

```
ingredient-science-hub.liquid:425 - backdrop-filter: blur(12px) triggers compositing on every frame during scroll. Consider reducing blur radius to 8px or using will-change: transform.
```

```
ingredient-science-hub.liquid:431 - box-shadow transition causes paint on hover. Consider using filter: drop-shadow() or removing shadow transition.
```

```
ingredient-science-hub.liquid:647 - background-color transition triggers paint. Replace with opacity or pseudo-element.
```

```
ingredient-science-hub.liquid:968 - width transition on dots causes layout. Use transform: scaleX() instead:
```

**Current**:
```css
transition: background-color 0.3s ease, width 0.3s ease, border-radius 0.3s ease;
```

**Recommended**:
```css
transition: background-color 0.3s ease, transform 0.3s ease;
/* Use transform: scaleX(3) for active state */
```

### 3.2 Animation Performance

| Animation | Property | Risk | Line |
|-----------|----------|------|------|
| fadeIn | opacity, transform | Safe | 584-587 |
| slideInBenefit | opacity, transform | Safe | 611-614 |
| slideUpArticle | opacity, transform | Safe | 659-662 |
| popInCard | opacity, transform | Safe | 768-771 |
| pulse | opacity | Safe | 797-800 |
| checkPop | transform, opacity | Safe | 826-830 |
| fillProgress | width | **Risky** | 877-879 |

```
ingredient-science-hub.liquid:877-879 - fillProgress animates width which causes layout. Consider animating transform: scaleX() instead with transform-origin: left.
```

### 3.3 Render Blocking

- Inline `<style>` block: 723 lines of CSS parsed synchronously
- Inline `<script>` block: 243 lines of JS parsed synchronously

**Assessment**: Acceptable for Shopify section. Critical CSS is naturally inlined.

---

## 4. JavaScript Patterns Analysis

### 4.1 Code Structure

| Metric | Value | Assessment |
|--------|-------|------------|
| Total lines | 243 | Moderate |
| IIFE encapsulation | Yes | Good |
| Event delegation | Partial | Room for improvement |
| Memory leaks | None detected | Good |

### 4.2 Issues Found

```
ingredient-science-hub.liquid:1052-1062 - Repeated querySelectorAll calls with same selector. Cache the results.
```

**Current**:
```javascript
section.querySelectorAll(`.ingredient-card__tab[data-card="${cardId}"]`).forEach(...)
section.querySelectorAll(`.ingredient-card__tab[data-tab="${tabName}"][data-card="${cardId}"]`).forEach(...)
```

**Recommended**: Cache card elements on init.

```
ingredient-science-hub.liquid:1071-1078 - Forced reflow with offsetHeight for animation restart. This is intentional but document the reason.
```

```
ingredient-science-hub.liquid:1137 - window.innerWidth check without considering orientation changes or dynamic viewport changes on mobile.
```

**Recommendation**: Use `matchMedia` instead:
```javascript
const isMobile = window.matchMedia('(max-width: 767px)').matches;
```

```
ingredient-science-hub.liquid:1166-1203 - Scroll debounce at 100ms may feel laggy. Consider 50ms or requestAnimationFrame.
```

```
ingredient-science-hub.liquid:1224-1231 - Resize handler debounce at 250ms is good, but should use ResizeObserver for more reliable detection.
```

### 4.3 Event Listener Patterns

| Pattern | Used | Best Practice |
|---------|------|---------------|
| Passive scroll listeners | Yes (line 1206) | Good |
| Event delegation | Partial | Could improve |
| Cleanup on section removal | No | **Missing** |

```
ingredient-science-hub.liquid:1040-1281 - No cleanup when section is removed (Shopify section API). Consider using Shopify section events.
```

**Recommendation**: Add Shopify section cleanup:
```javascript
document.addEventListener('shopify:section:unload', (event) => {
  if (event.detail.sectionId === '{{ section.id }}') {
    // Remove event listeners
    observer.disconnect();
  }
});
```

---

## 5. Liquid Template Efficiency

### 5.1 Issues Found

```
ingredient-science-hub.liquid:126 - newline_to_br | split: '<br />' is fragile. Consider using split: newline filter if available.
```

```
ingredient-science-hub.liquid:130 - Inline style for animation-delay creates unique CSS per item. Consider using CSS nth-child instead:
```

**Current**:
```liquid
<div class="benefit-item" style="animation-delay: {{ forloop.index | times: 0.1 }}s">
```

**Alternative CSS approach**:
```css
.benefit-item:nth-child(1) { animation-delay: 0.1s; }
.benefit-item:nth-child(2) { animation-delay: 0.2s; }
/* etc. */
```

This is already done for test cards (lines 761-766), apply consistently.

```
ingredient-science-hub.liquid:154-161 - Multiple assign operations inside loop. Consider parsing once outside loop if possible.
```

### 5.2 HTML Output Size

| Component | Estimated Bytes |
|-----------|-----------------|
| HTML structure | ~3KB per card |
| Inline CSS | ~18KB |
| Inline JS | ~6KB |
| **Total per section** | ~30KB + (3KB × cards) |

**Assessment**: Acceptable for a feature-rich section, but monitor if many cards are used.

---

## 6. Image Optimization

### 6.1 Strengths

```
ingredient-science-hub.liquid:39-52 - Excellent image optimization:
- srcset with 3 sizes (200w, 300w, 400w)
- Proper sizes attribute
- lazy loading
- Explicit width/height (prevents CLS)
```

### 6.2 Potential Improvements

```
ingredient-science-hub.liquid:40 - Consider adding WebP/AVIF with picture element for modern browsers.
```

```
ingredient-science-hub.liquid:49 - loading="lazy" on all images. Consider loading="eager" for first visible card if above fold.
```

---

## 7. Recommendations Summary

### High Priority (Performance)

1. **Replace width animation with transform** (line 968, 877-879)
   - Impact: Eliminates layout thrashing
   - Effort: Low

2. **Cache DOM queries** (lines 1052-1068)
   - Impact: Reduces reflow triggers
   - Effort: Low

3. **Add section cleanup** (new code)
   - Impact: Prevents memory leaks on section removal
   - Effort: Medium

### Medium Priority (Maintainability)

4. **Extract hardcoded colors to variables** (lines 458, 643, 665, 926)
   - Impact: Easier theming, consistency
   - Effort: Low

5. **Use matchMedia instead of innerWidth** (line 1137)
   - Impact: More reliable viewport detection
   - Effort: Low

6. **Add tabular-nums to percentage displays** (line 881-887)
   - Impact: Better number alignment
   - Effort: Trivial

### Low Priority (Modern CSS)

7. **Add CSS layers** (@layer)
   - Impact: Better cascade control for future maintenance
   - Effort: Medium

8. **Add container queries** for card-level responsiveness
   - Impact: More precise breakpoints
   - Effort: Medium

9. **Replace Inter with distinctive font**
   - Impact: Brand differentiation
   - Effort: Low (but requires design decision)

---

## 8. Code Quality Metrics

| Metric | Score | Notes |
|--------|-------|-------|
| CSS Organization | 9/10 | Well-structured BEM |
| CSS Specificity | 9/10 | Flat, maintainable |
| CSS Performance | 7/10 | backdrop-filter, layout animations |
| JS Architecture | 7/10 | Good IIFE, missing cleanup |
| JS Performance | 8/10 | Passive listeners, debouncing |
| Liquid Efficiency | 8/10 | Good, minor optimizations possible |
| Image Optimization | 9/10 | Excellent srcset implementation |
| Modern CSS Usage | 6/10 | Missing container queries, layers |

**Overall Score: 7.9/10**

---

## Appendix: File Structure Reference

| Section | Lines | Purpose |
|---------|-------|---------|
| Liquid/HTML | 1-312 | Template markup |
| CSS Variables | 319-341 | Design tokens |
| CSS Layout | 344-417 | Container and carousel |
| CSS Cards | 419-502 | Card components |
| CSS Tabs | 504-587 | Tab system |
| CSS Benefits | 589-626 | Benefits list |
| CSS Articles | 628-724 | Articles list |
| CSS Tests | 726-942 | Test results |
| CSS Carousel | 944-1009 | Dot navigation |
| CSS Motion | 1011-1036 | Reduced motion |
| JavaScript | 1039-1281 | Interactivity |
| Schema | 1284-1447 | Shopify settings |

---

*Audit complete. 17 actionable recommendations identified.*
