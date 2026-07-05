# design-system

A standalone React + TypeScript component library built on CSS-variable design tokens,
with Storybook, Vitest, and `tsup` for bundling. Intended as a reusable UI foundation for
future web UIs.

> **Status: PARKED (2026-07-04).** The foundation is complete and all quality gates pass,
> but the package has one outstanding blocker before it is usable by a consumer — see
> [Known gaps](#known-gaps--resume-here). Pick up from that section.

## Stack

- React 18 + TypeScript
- Design tokens as CSS variables (`src/styles/tokens.css`) with typed mirrors in `src/tokens/`
- CSS Modules per component
- Storybook (Vite builder) for docs/dev
- Vitest + Testing Library for unit tests
- `tsup` for ESM + `.d.ts` bundling

## Commands

```bash
npm install
npm run typecheck        # tsc --noEmit
npm test                 # vitest run --project=unit
npm run test:storybook   # vitest run --project=storybook
npm run lint             # eslint .
npm run build            # tsup -> dist/
npm run storybook        # dev server on :6006
```

## What's built

Design tokens (primitive + semantic), a `cx()` classname helper, and **12 components**, each
with component + CSS module + tests + stories + a local barrel `index.ts`:

`Alert` · `Badge` · `Button` · `Card` · `Checkbox` · `Dialog` · `Grid` · `Input` ·
`Radio` · `Select` · `Stack` · `Tabs`

(Dialog/Tabs/Select/Radio/Checkbox are built on Radix primitives.)

## Verified state at parking (2026-07-04)

- `typecheck` — passes (exit 0)
- `npm test` — **36 tests pass** across 14 files
- `lint` — clean
- `build` — succeeds (`dist/index.{js,d.ts}`)
- Git history — clean, linear, one component per commit

## Known gaps — resume here

1. **🔴 Blocker: the package entry doesn't export the components.** `src/index.ts` only
   re-exports `cx` and the tokens, so the built package ships hollow — `import { Button }
   from 'design-system'` resolves to `undefined`. Each component has a correct local
   `index.ts`; they were just never wired into the top-level barrel. **Fix:** add
   `export * from './components/<Name>'` for all 12 components in `src/index.ts`.
2. **🟡 Add a regression guard.** No test asserts the public API, which is why the missing
   barrel stayed invisible (all checks green throughout). Add a test that imports the
   package entry and asserts each component is defined, so this can't recur.
3. **🟡 Leftover Storybook boilerplate.** `src/stories/` still holds the default template
   (`Button.tsx`, `Header.tsx`, `Page.tsx` + assets) — unrelated to the real components.
   Safe to delete.
4. **No git remote yet.** This repo is local-only; publish to a remote when ready.

Design docs live in `docs/superpowers/specs/` and `docs/superpowers/plans/`.

## Storybook demo

Build the demo locally:

```bash
npm run storybook:build
```

The static output is `storybook-static/`.

When this repo has a GitHub remote and Pages is configured to use GitHub Actions, `.github/workflows/storybook-pages.yml` publishes Storybook from `main`. The workflow runs unit tests, builds the package, builds Storybook, and deploys the generated static site.
