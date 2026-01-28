# Web Design Guidelines Audit

**File**: `sections/ingredient-science-hub.liquid`
**Date**: 2026-01-29
**Auditor**: Claude Code
**Guidelines Source**: [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines)

---

## Findings

### Accessibility

```
ingredient-science-hub.liquid:294 - role="tablist" on carousel dots is semantically incorrect; dots control carousel position, not tab panels. Consider role="group" with aria-label or a custom pattern.
```

```
ingredient-science-hub.liquid:296-302 - Carousel dots use role="tab" but don't control tabpanels; they control scroll position. Remove tab semantics or use aria-controls pointing to carousel region.
```

```
ingredient-science-hub.liquid:117-124 - Tab panels lack tabindex="0" for keyboard focus when content is not focusable. Add tabindex="0" to allow panel content to receive focus.
```

```
ingredient-science-hub.liquid:145-151 - Tab panel (articles) lacks tabindex="0".
```

```
ingredient-science-hub.liquid:198-204 - Tab panel (tests) lacks tabindex="0".
```

```
ingredient-science-hub.liquid:162-188 - External links missing aria-label describing destination. Consider adding context: "Read article: {title} on {source} (opens in new tab)".
```

```
ingredient-science-hub.liquid:164 - External links with target="_blank" should indicate new window. Add visually hidden text or aria-label: "(opens in new tab)".
```

### Focus States

```
ingredient-science-hub.liquid:561-565 - Tab focus uses outline but gold (#D4AF37) on white may not meet 3:1 contrast for focus indicators. Verify or use darker outline.
```

```
ingredient-science-hub.liquid:961-973 - Carousel dots are 8px visible size but rely on ::before for 44px touch target. Focus indicator on 8px dot may be hard to see.
```

### Forms

**PASS** - No form elements present.

### Animation

```
ingredient-science-hub.liquid:431 - Uses transition: transform 0.3s ease, box-shadow 0.3s ease. While not "transition: all", box-shadow transitions can cause paint. Consider transitioning only transform.
```

```
ingredient-science-hub.liquid:647 - article-card uses transform and background-color transition. Background-color triggers paint; consider opacity or transform only.
```

```
ingredient-science-hub.liquid:1014-1036 - prefers-reduced-motion support is present and comprehensive. PASS.
```

```
ingredient-science-hub.liquid:968 - Carousel dot transition includes width change which triggers layout. Consider transform: scaleX() instead.
```

### Typography

```
ingredient-science-hub.liquid:192 - Turkish text "Henüz makale eklenmedi." uses ASCII period. Consider proper Turkish quotation marks if quoting.
```

```
ingredient-science-hub.liquid:282 - Contact note uses asterisk (*) for footnote. Consider using proper typographic symbols.
```

```
ingredient-science-hub.liquid:350-366 - Headings use clamp() for fluid typography. Consider adding text-wrap: balance for better line breaks.
```

### Content

```
ingredient-science-hub.liquid:686-697 - Article titles use -webkit-line-clamp for truncation. PASS.
```

```
ingredient-science-hub.liquid:306-309 - Empty state handled gracefully. PASS.
```

### Images

```
ingredient-science-hub.liquid:39-52 - Images have explicit width/height, srcset, sizes, and lazy loading. PASS.
```

### Performance

```
ingredient-science-hub.liquid:424-426 - backdrop-filter: blur(12px) is expensive. Fallback exists (line 434-438) but blur still runs on capable browsers. Consider reducing blur radius or removing on low-power devices.
```

```
ingredient-science-hub.liquid:1267-1278 - IntersectionObserver used correctly for animation triggering. PASS.
```

### Navigation

```
ingredient-science-hub.liquid:1044-1079 - Tab state not reflected in URL. Deep-linking to specific tab not supported. Consider using URL hash (#benefits, #articles, #tests).
```

### Touch

```
ingredient-science-hub.liquid:400 - touch-action: pan-x pinch-zoom on carousel. PASS.
```

```
ingredient-science-hub.liquid:512 - touch-action: manipulation on tabs. PASS.
```

```
ingredient-science-hub.liquid:531 - -webkit-tap-highlight-color: transparent set. PASS.
```

```
ingredient-science-hub.liquid:651 - -webkit-tap-highlight-color: transparent on article cards. PASS.
```

```
ingredient-science-hub.liquid:971-972 - touch-action: manipulation and tap-highlight on dots. PASS.
```

```
ingredient-science-hub.liquid:975-985 - Touch target expanded to 44px via ::before pseudo-element. PASS.
```

### Dark Mode

**N/A** - Component uses explicit light theme colors. No dark mode variant provided.

### i18n

```
ingredient-science-hub.liquid:275-276 - Date displayed as plain text (e.g., "Ocak 2024"). Consider Intl.DateTimeFormat for localized dates if dynamic.
```

### Hydration

**N/A** - Server-rendered Liquid template, no hydration concerns.

### Anti-patterns

**PASS** - No `user-scalable=no`, `onPaste` blocking, `outline-none` without replacement, or `<div onClick>` detected.

---

## Summary

| Category | Status | Issues |
|----------|--------|--------|
| Accessibility | NEEDS WORK | 7 issues |
| Focus States | NEEDS WORK | 2 issues |
| Forms | PASS | 0 issues |
| Animation | NEEDS WORK | 3 issues |
| Typography | MINOR | 2 issues |
| Content | PASS | 0 issues |
| Images | PASS | 0 issues |
| Performance | MINOR | 1 issue |
| Navigation | NEEDS WORK | 1 issue |
| Touch | PASS | 0 issues |
| Dark Mode | N/A | - |
| i18n | MINOR | 1 issue |
| Hydration | N/A | - |
| Anti-patterns | PASS | 0 issues |

**Total Issues**: 17 findings (7 accessibility, 2 focus, 3 animation, 2 typography, 1 performance, 1 navigation, 1 i18n)

---

## Priority Recommendations

### High Priority (Accessibility/WCAG)

1. **Fix carousel dot semantics** (lines 294-304): Replace `role="tablist/tab"` with `role="group"` and `role="button"` or remove roles entirely since dots control scroll position, not tab panels.

2. **Add tabindex="0" to tab panels** (lines 117, 145, 198): Required by APG tabs pattern for keyboard users to move focus into panel content.

3. **External link accessibility** (lines 162-188): Add "(yeni sekmede açılır)" / "(opens in new tab)" indicator for screen reader users.

### Medium Priority (UX)

4. **URL state for tabs** (line 1044): Implement hash-based navigation (`#benefits`, `#articles`, `#tests`) for deep-linking and back-button support.

5. **Focus indicator contrast** (line 561): Verify gold outline meets 3:1 contrast or increase outline width/use darker color.

### Low Priority (Performance/Polish)

6. **Reduce animation scope**: Replace `box-shadow` and `background-color` transitions with `opacity` where possible.

7. **Typography polish**: Add `text-wrap: balance` to headings, use proper typographic characters.

---

## Compliant Areas

The following areas already meet Web Interface Guidelines:

- Semantic HTML structure (section, article, nav, h2, h3, h4, h5)
- ARIA tabs pattern on card tabs (lines 65-112)
- Keyboard navigation with arrow keys, Home, End (lines 1086-1121)
- prefers-reduced-motion comprehensive support (lines 1014-1036)
- Image optimization with srcset, sizes, lazy loading (lines 39-52)
- Touch targets expanded to 44px minimum (lines 975-985)
- touch-action and tap-highlight properly configured
- Fallback for backdrop-filter (lines 434-438)
- Empty state handling (lines 306-309)
- Text truncation with line-clamp (lines 693-697)

---

*Audit complete. 17 issues identified, 10 passing categories.*
