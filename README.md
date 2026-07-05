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
2. **Deploy the live Storybook demo.** The workflow is fixed and green through the
   Storybook build; the only remaining step is a one-time **manual** enable of Pages
   (Actions token can't self-provision). See [Storybook demo](#storybook-demo).

Next up is **Phase 2**: the thin local-first Producer Release OS SPA consuming these rails.

Design docs live in `docs/superpowers/specs/` and `docs/superpowers/plans/`.

## Storybook demo

**Live (once Pages is enabled):** https://you1anna.github.io/design-system/

Build the demo locally instead:

```bash
npm run storybook:build   # static output in storybook-static/
```

### One-time setup required before the demo goes live

`.github/workflows/storybook-pages.yml` publishes Storybook on every push to `main`:
run unit tests → build the package → build Storybook → upload `storybook-static/` →
deploy to GitHub Pages. A `storybook-pages` concurrency group cancels superseded runs.

The workflow is correct, but it **cannot turn Pages on by itself**. The Actions
`GITHUB_TOKEN` is not allowed to create a Pages site (`configure-pages` fails with
`Resource not accessible by integration`). Pages must be enabled once, by hand:

1. **Settings → Pages → Build and deployment → Source: _GitHub Actions_.**
2. Re-run the latest **Storybook Pages** workflow (or push any commit to `main`).

After that the deploy is fully automatic. `configure-pages` runs with `enablement: true`,
which is a harmless no-op once the site exists.

> ⚠️ **Risks — read before enabling:**
> - **Public exposure.** The repo is private, but a Pages site is **public** — anyone with
>   the URL can view every component and story. Pages can't be private except on Enterprise.
>   Keep secrets/confidential copy out of stories. To take it down later: **Settings → Pages
>   → Source: None**.
> - **Plan requirement.** Pages on a private repo needs a paid GitHub plan. On Free, the
>   *GitHub Actions* source in step 1 won't be available and the deploy can't run.
> - **Fail-safe.** Until step 1 is done the deploy job simply fails at "Configure Pages" and
>   nothing is published — there is no accidental exposure in the meantime.
