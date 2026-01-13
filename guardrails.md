# Guardrails

Rules learned from mistakes. Always follow these to prevent repeating errors.

## Testing
- Always run tests after changes (`npm test`)
- All tests must pass before marking work complete
- Target 80% coverage (branches, functions, lines, statements)

## Localization
- Keep Turkish content intact (ş, ğ, ü, ö, ç, ı, İ)
- Test with actual Turkish text, not placeholders
- Use UTF-8 encoding everywhere

## Mobile-First
- Test at 375px viewport first, then expand
- Touch interactions must not block page scroll
- Carousel scroll must work naturally on mobile
- Use passive touch listeners: `{ passive: true }`

## Performance
- No layout shifts on state changes (CLS < 0.1)
- Images must be lazy-loaded with `loading="lazy"`
- Keep bundle size under 50KB gzipped
- Use `will-change: transform` sparingly

## Shopify Integration
- Section must work in Theme Editor
- Blocks must be addable/removable by merchant
- Test with 1, 3, and 5+ ingredients
- Liquid schema must validate

## Animation
- X-Ray transition must feel smooth (60fps)
- Scanner line animation: 1.5s duration
- Data reveal stagger: 0.1s between items
- Always provide visual feedback for interactions

## Git
- Commit after each iteration completes
- Write meaningful commit messages
- Never commit sensitive data (tokens, keys)
