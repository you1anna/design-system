# design-system

> Workspace update, 15 October 2026: command-center is retired. This repository owns its guidance, plans, status and decisions; historical hub references are provenance and do not require hub lookup or session fold-back. Start at `AGENTS.md`.

A standalone React + TypeScript component library built on CSS-variable design tokens,
with Storybook, Vitest, and `tsup` for bundling. Intended as a reusable UI foundation for
future web UIs.

> **Status: RAILS HARDENED (2026-07-05).** Phase 1 of Producer Release OS is complete: the
> public barrel exports all components, a regression guard locks the public API, and the
> Release OS rails showcase composes the package surface. All quality gates pass. The one
> remaining Phase 1 item is generating the Figma design library (see
> [Known gaps](#known-gaps--resume-here)); the package itself is consumer-ready.

## Install / Consume

Published to **GitHub Packages** as `@you1anna/design-system`. Consumers install it by version —
not via a `file:`/relative link — so React resolves once and versions are pinned by the lockfile.

1. Point the scope at GitHub Packages (add to the **consumer** repo's `.npmrc`):

   ```
   @you1anna:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

   Provide `NODE_AUTH_TOKEN` via the environment (a GitHub PAT/`GITHUB_TOKEN` with `read:packages`).
   Never commit the token.

2. Install and use:

   ```bash
   npm i @you1anna/design-system
   ```

   ```tsx
   import { Button } from '@you1anna/design-system';
   import '@you1anna/design-system/styles.css'; // ships the --ds-* tokens + component styles

   export const Example = () => <Button>Ship it</Button>;
   ```

- **React is a peer dependency** (`react`/`react-dom` `^18.3.1`) — the consumer provides it.
- `styles.css` is the complete stylesheet: design tokens (`--ds-*`) **and** component rules. Import
  it once at the app entry. The `check:css` build guard fails the release if tokens are ever dropped.

**Publishing** (maintainer): bump `version`, then publish a GitHub Release tagged `vX.Y.Z` — the
`publish.yml` workflow runs the gate and `npm publish`es to GitHub Packages.

## Stack

- React 18 + TypeScript
- Design tokens as CSS variables (`src/styles/tokens.css`) with typed mirrors in `src/tokens/`
- CSS Modules per component
- Storybook (Vite builder) for docs/dev
- Vitest + Testing Library for unit tests
- `tsup` for ESM + `.d.ts` bundling

## Developing this repo? Bootstrap first

Fresh clones (especially remote/web agent sessions) arrive without `node_modules`, and the
quality gate fails cryptically without it (`npm run lint` → `ERR_MODULE_NOT_FOUND:
eslint-plugin-storybook`). Run the bootstrap before anything else:

```bash
npm run bootstrap   # npm ci if node_modules is missing; no-op when already installed
```

## Commands

```bash
npm run bootstrap        # npm ci on a fresh clone (idempotent)
npm run typecheck        # tsc --noEmit
npm test                 # vitest run --project=unit
npm run test:storybook   # vitest run --project=storybook
npm run lint             # eslint .
npm run build            # tsup -> dist/
npm run storybook        # dev server on :6006
```

## What's built

Design tokens (primitive + semantic), a `cx()` classname helper, and **15 components**
(the `src/index.ts` barrel is the definitive list), each with component + CSS module +
tests + stories + a local barrel `index.ts`:

`Alert` · `Badge` · `Button` · `Calendar` · `Card` · `Checkbox` · `Dialog` · `Grid` ·
`Input` · `Progress` · `Radio` · `Select` · `Stack` · `Table` · `Tabs`

(Dialog/Tabs/Select/Radio/Checkbox are built on Radix primitives.)

## Verified state (2026-07-06)

- `typecheck` — passes (exit 0)
- `npm test` — **58 tests pass** across 18 files
- `lint` — clean
- `build` — succeeds (`dist/index.{js,d.ts}`)
- `check:css` — `dist/index.css` ships tokens + component rules
- Git history — clean, linear, one component per commit

## Known gaps — resume here

Phase 1 rails hardening is done. The blockers that used to live here are all resolved:

- ✅ **Public barrel exports every component.** `src/index.ts` re-exports all components;
  `import { Button } from '@you1anna/design-system'` resolves correctly.
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
