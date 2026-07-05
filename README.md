# design-system

A standalone React + TypeScript component library built on CSS-variable design tokens,
with Storybook, Vitest, and `tsup` for bundling. Intended as a reusable UI foundation for
future web UIs.

> **Status: RAILS HARDENED (2026-07-05).** Phase 1 of Producer Release OS is complete: the
> public barrel exports all components, a regression guard locks the public API, and the
> Release OS rails showcase composes the package surface. All quality gates pass. The one
> remaining Phase 1 item is generating the Figma design library (see
> [Known gaps](#known-gaps--resume-here)); the package itself is consumer-ready.

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

Phase 1 rails hardening is done. The blockers that used to live here are all resolved:

- ✅ **Public barrel exports every component.** `src/index.ts` now re-exports all 15
  components; `import { Button } from 'design-system'` resolves correctly.
- ✅ **Public API regression guard.** `src/public-api.test.ts` imports the package entry
  and asserts each component is defined, so a hollow barrel can't recur.
- ✅ **Storybook boilerplate removed.** The default template under `src/stories/` is gone.
- ✅ **Git remote exists.** Published to `you1anna/design-system`.

Remaining before Phase 1 is fully closed:

1. **Generate the Figma design library.** Scope is locked in
   [`docs/figma-library-scope.md`](docs/figma-library-scope.md) from the code tokens; run
   the `figma-generate-library` workflow to produce the actual Figma file, then record its
   URL here. (Held as a Robin checkpoint — it's an outward-facing action.)
2. ✅ **Live Storybook demo deployed.** Pages is enabled and the workflow publishes from
   `main` — see [Storybook demo](#storybook-demo).

Next up is **Phase 2**: the thin local-first Producer Release OS SPA consuming these rails.

Design docs live in `docs/superpowers/specs/` and `docs/superpowers/plans/`.

## Storybook demo

**Live:** https://you1anna.github.io/design-system/ — the deployed Storybook, phone-friendly.

Build the demo locally instead:

```bash
npm run storybook:build   # static output in storybook-static/
```

### How the deploy works

`.github/workflows/storybook-pages.yml` publishes Storybook on every push to `main`:
run unit tests → build the package → build Storybook → upload `storybook-static/` →
deploy to GitHub Pages. `configure-pages` runs with `enablement: true`, so the first run
provisions the Pages site itself (this repo previously failed here because Pages had never
been turned on). A `storybook-pages` concurrency group cancels superseded runs.

> ⚠️ **Visibility:** this repository is private, but the deployed Pages site is **public** —
> anyone with the URL above can view the component library. GitHub Pages cannot be kept
> private except on Enterprise. Do not put anything confidential in stories. Private-repo
> Pages also requires a paid GitHub plan; if the plan doesn't support it the deploy step
> will fail rather than expose anything. To take the demo down, disable Pages in
> **Settings → Pages** (source: None).
