# Homepage Learning Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage category directory with a learning-decision workbench that prioritizes the next recommended step, learning mode selection, and the four-layer capability map.

**Architecture:** Extend `src/lib/home-page.ts` into the single build-time data source for homepage entry links, beginner path steps, and layer-grouped modules. Render the page semantically in `src/pages/index.astro`, then use a small progressive-enhancement script to read local progress and update the learning path summary without blocking the static fallback. Keep visual styling co-located in the custom homepage because the current GitHub Pages build relies on inline homepage CSS.

**Tech Stack:** Astro 6, TypeScript, CSS, Vitest, Playwright, localStorage

---

### Task 1: Expand the Homepage Data Model

**Files:**
- Modify: `src/lib/home-page.ts`
- Modify: `tests/unit/home-page.test.ts`

- [ ] **Step 1: Write the failing tests**

Add tests that assert:

```ts
it('should expose the beginner learning path in teaching order', () => {
  const { beginnerPath } = getHomePageData('/testdev-interview-site/')
  expect(beginnerPath).toHaveLength(8)
  expect(beginnerPath[0].slug).toBe('testdev-role-map')
  expect(beginnerPath[2].slug).toBe('pytest-first-test')
  expect(beginnerPath[7].slug).toBe('interview-expression-for-first-project')
})

it('should group all ten modules into four capability layers', () => {
  const { capabilityLayers } = getHomePageData('/testdev-interview-site/')
  expect(capabilityLayers).toHaveLength(4)
  expect(capabilityLayers.flatMap((layer) => layer.modules)).toHaveLength(10)
  expect(capabilityLayers[0].name).toBe('入门教学层')
})
```

- [ ] **Step 2: Run the focused unit test and verify it fails**

Run: `npm run test:unit -- tests/unit/home-page.test.ts`

Expected: FAIL because `beginnerPath` and `capabilityLayers` do not exist.

- [ ] **Step 3: Implement the minimal data model**

Add typed `HomePagePathStep` and `HomePageCapabilityLayer` interfaces. Build an eight-step beginner path with slug, href, title, outcome, and estimated minutes. Build capability layers from the existing `layers` and `categories` exports so the ten category descriptions remain single-source.

- [ ] **Step 4: Run the focused unit test and verify it passes**

Run: `npm run test:unit -- tests/unit/home-page.test.ts`

Expected: PASS.

### Task 2: Render the Learning Workbench Homepage

**Files:**
- Modify: `src/pages/index.astro`
- Test: `tests/unit/home-page.test.ts`

- [ ] **Step 1: Add a failing link-path regression test**

Add:

```ts
it('should generate GitHub Pages-safe links for paths and modules', () => {
  const { beginnerPath, capabilityLayers } = getHomePageData('/testdev-interview-site')
  expect(beginnerPath[0].href).toBe('/testdev-interview-site/beginner-course/testdev-role-map/')
  expect(capabilityLayers[0].modules[0].href).toBe('/testdev-interview-site/beginner-course/')
})
```

- [ ] **Step 2: Run the focused unit test and verify it fails if base handling is wrong**

Run: `npm run test:unit -- tests/unit/home-page.test.ts`

Expected: PASS only after the data model uses normalized base paths for every link.

- [ ] **Step 3: Replace the homepage markup**

Use `getHomePageData(import.meta.env.BASE_URL)` in `src/pages/index.astro`. Render:

- A semantic top navigation with brand, selected homepage link, primary content links, and a continue-learning link.
- A two-column hero with the approved heading, supporting copy, primary action, module-map action, and a `LearningPathSummary`-style aside.
- A learning mode section where the beginner route is visually primary and interview sprint is secondary.
- A four-layer capability map using the generated `capabilityLayers`.
- A concise progress summary that describes completed learning rather than gamified points.

Ensure the static fallback says “从第 1 步开始” and links to the first beginner path step.

- [ ] **Step 4: Add progressive enhancement for local progress**

Read `testdev:progress` inside a guarded `try/catch`. Use `completedSlugs` to mark completed path steps, select the first incomplete step as current, update the continue-learning URLs, and update the completed count. On malformed storage, leave the static fallback untouched and do not show an error dialog.

- [ ] **Step 5: Run the unit test suite**

Run: `npm run test:unit`

Expected: PASS.

### Task 3: Implement the Approved Visual System and Responsive Behavior

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Implement the co-located homepage styles**

Use the confirmed “工程师的学习工作台” visual direction:

- Retain action blue, prompt amber, reading white, structure gray, and Chinese system fonts.
- Use a fluid hero heading with a maximum below `4.25rem`, balanced wrapping, and no overflow.
- Use asymmetric desktop composition, structured lists, dividers, and varied section spacing.
- Keep cards limited to the two learning mode choices and path summary.
- Give every interactive element a visible `:focus-visible` state.
- Keep touch targets at least `44px` high.
- Use hover motion only under `@media (hover: hover)`.
- Add `prefers-reduced-motion` overrides.

- [ ] **Step 2: Add responsive adaptations**

At content-driven breakpoints:

- Stack the hero before it becomes cramped.
- Preserve the path summary before the learning mode section.
- Convert top navigation into a compact wrapping row without hiding core links.
- Convert capability layers to vertical groups on narrow screens.
- Keep all content readable at 320px width and 200% zoom.

- [ ] **Step 3: Build the site**

Run: `npm run build`

Expected: Astro build exits with code 0 and emits the homepage under `dist/`.

### Task 4: Browser Verification and Final Quality Pass

**Files:**
- Modify if defects are found: `src/pages/index.astro`
- Modify if behavior defects are found: `src/lib/home-page.ts`
- Modify if regression coverage is needed: `tests/unit/home-page.test.ts`

- [ ] **Step 1: Start the Astro dev server and open the real homepage**

Run: `npm run dev`

Open the served homepage in the in-app browser, not the brainstorm Demo.

- [ ] **Step 2: Verify key states**

Check:

- No local progress: “从第 1 步开始” fallback and first-step link.
- Valid progress: completed steps, current step, continue-learning link, and completed count update.
- Malformed local storage: page remains usable and console has no uncaught error.

- [ ] **Step 3: Verify viewports and accessibility basics**

Inspect desktop, tablet, and mobile widths. Confirm no text overflow, no clipped focus rings, 44px touch targets, sufficient contrast, useful keyboard focus order, and reduced-motion behavior.

- [ ] **Step 4: Run full verification**

Run:

```bash
npm run test:unit
npm run typecheck
npm run build
```

Expected: all commands exit with code 0.

- [ ] **Step 5: Review the implementation against the approved Demo**

Confirm the live result preserves the major ingredients: learning-first hero, path summary, unequal learning-mode choices, structured capability map, restrained color roles, and low-card layout. Fix any material mismatch before completion.
