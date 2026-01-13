# Current Task: Iteration 3 - IngredientCard Component

## Objective
Create the main IngredientCard component with press-and-hold X-Ray interaction.

## Tasks
- [ ] Refactor `IngredientCard.jsx` as a separate component
- [ ] Integrate `useLongPress` hook for interaction
- [ ] Implement Default State (image + hero title + fingerprint hint)
- [ ] Implement X-Ray State (blurred bg + data overlay)
- [ ] Add image lazy loading
- [ ] Write comprehensive unit tests
- [ ] Test with Turkish characters

## Acceptance Criteria
- Card displays correctly in both states
- Press-and-hold triggers X-Ray mode
- Release returns to default state
- Images lazy load properly
- Turkish characters (şğüöçıİ) render correctly
- All tests pass with >80% coverage

## Props
- image: string (URL)
- name: string
- heroTitle: string
- subtitle: string
- origin: string
- activeCompound: string
- labResult: string

## Previous Iterations
- Iteration 1 (Setup): 8 tests
- Iteration 2 (useLongPress): 22 tests
- Total: 30 tests passing
