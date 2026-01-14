# Guardrails

Rules learned from mistakes. Always follow these to prevent repeating errors.

---

## Testing
- Always run tests after changes (`npm test`)
- All tests must pass before marking work complete
- Target 80% coverage (branches, functions, lines, statements)
- Mock browser APIs (vibration, intersection observer) in tests

## Localization
- Keep Turkish content intact (ş, ğ, ü, ö, ç, ı, İ)
- Test with actual Turkish text, not placeholders
- Use UTF-8 encoding everywhere
- Ensure fonts support Turkish characters

## Mobile-First
- Test at 375px viewport first, then expand
- Touch interactions must not block page scroll
- Carousel scroll must work naturally on mobile
- Use passive touch listeners: `{ passive: true }`
- Test on actual devices when possible

## Performance
- No layout shifts on state changes (CLS < 0.1)
- Images must be lazy-loaded with `loading="lazy"`
- Keep bundle size under 50KB gzipped
- Use `will-change: transform` sparingly
- Prefer CSS animations over JS for simple effects

## Shopify Integration
- Section must work in Theme Editor
- Blocks must be addable/removable by merchant
- Test with 1, 3, and 5+ ingredients
- Liquid schema must validate
- Use `{{ block.shopify_attributes }}` for editor compatibility
- Self-contained sections (HTML + CSS + JS in one file)

## Animation
- Transitions should feel smooth (60fps)
- Use staggered delays for list items (0.1-0.15s)
- Provide visual feedback for all interactions
- Re-trigger animations when content becomes visible

## Git
- Commit after each iteration completes
- Write meaningful commit messages
- Never commit sensitive data (tokens, keys, passwords)
- Use `.gitignore` for node_modules, coverage, dist

## CSS Best Practices
- Use CSS custom properties for theming
- Glass-morphism: `backdrop-filter: blur()` + semi-transparent bg
- Animated progress bars: CSS `@keyframes` with `--progress` variable
- Test hover states don't interfere with touch devices

## Accessibility
- Use semantic HTML elements
- Include ARIA attributes for interactive elements
- Ensure sufficient color contrast
- Tab navigation should work for all interactions

---

## Project-Specific Lessons

### Vite Build Issues
- Use `.jsx` extension for React files
- Use `esbuild` instead of `terser` for minification
- Entry point must match actual file extension

### npm Cache Permissions
- If EACCES error: use `npm install --cache .npm-cache`
- Or fix global permissions with `sudo chown -R $(whoami) ~/.npm`

### GitHub Authentication
- Use Personal Access Token (PAT) for HTTPS
- Or configure SSH keys for passwordless push
- Never commit tokens to repository
