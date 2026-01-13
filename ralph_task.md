# Current Task: Iteration 2 - useLongPress Hook

## Objective
Create a custom React hook for detecting press-and-hold gestures on both mobile (touch) and desktop (mouse).

## Tasks
- [ ] Create `src/hooks/useLongPress.js` custom hook
- [ ] Handle touch start/end/move events
- [ ] Handle mouse down/up events (desktop)
- [ ] Implement 300ms threshold for "long press" detection
- [ ] Cancel interaction on scroll intent (touchmove with significant displacement)
- [ ] Write comprehensive unit tests
- [ ] Achieve >80% coverage for this module

## Acceptance Criteria
- Hook returns { isPressed, handlers } object
- Works on mobile (touch events) and desktop (mouse events)
- Does NOT block page scrolling
- Triggers after 300ms hold
- Cancels if user moves finger/mouse significantly
- All tests pass with >80% coverage

## Technical Notes
- Use passive event listeners: `{ passive: true }`
- Movement threshold: ~10px before canceling
- Must clean up timers on unmount

## Previous Iteration
Iteration 1 (Project Setup) - COMPLETED
- 8 tests passing
- Git repo connected: https://github.com/canokcuer/ingredients.git
