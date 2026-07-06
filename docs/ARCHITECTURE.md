# Architecture — design-system

## Purpose

A reusable React + TypeScript UI foundation (tokens + components) that other web apps consume as a
**versioned package**, not a source/relative link. First consumer: `producer-release-os`.

## Package shape

- **Name / registry:** `@you1anna/design-system` on GitHub Packages (`npm.pkg.github.com`).
- **Format:** ESM-only (`"type": "module"`). Built with `tsup` (esbuild) → `dist/`.
- **Entry points** (`package.json` `exports`):
  - `.` → `dist/index.js` (+ `dist/index.d.ts` types)
  - `./styles.css` → `dist/index.css`
- **Published files:** `dist/` only (`files: ["dist"]`). `dist/` is gitignored and built fresh at
  publish time via `prepublishOnly`.
- **React:** peer dependency (`^18.3.1`), kept `external` in `tsup.config.ts` so the bundle never
  embeds React. This is what lets a consumer resolve a single React instance — the root cause of the
  earlier duplicate-React failure under `file:` linking.

## The token / CSS pipeline (the load-bearing part)

Tokens exist in two hand-synced forms:

- `src/styles/tokens.css` — the `--ds-*` CSS custom properties (runtime source of truth for styling).
- `src/tokens/*.ts` — typed JS mirrors, re-exported from the barrel for consumers who want values in JS.

`src/index.ts` imports `src/styles/global.css` (which `@import`s `tokens.css`) **before** the
component barrels. tsup folds all TS-imported CSS into one `dist/index.css`, so the single
`./styles.css` export contains the tokens first, then the per-component CSS-module rules that
reference them. Without that import the component rules would reference undefined variables and every
consumer would render unstyled — see `decisions/` (2026-07-06). `scripts/check-css.mjs`
(`npm run check:css`) fails the build if either the tokens or the component rules go missing.

## Public API

`src/index.ts` is the entire public surface: `cx`, the tokens, and every component. It is locked by
`src/public-api.test.ts`, which imports the built entry and asserts each component is defined — a
hollow barrel can't regress silently. Adding a component = add it to the barrel.

## Build, test, release

- **Build:** `tsup` → `dist/index.{js,css,d.ts}` (+ sourcemaps).
- **Gate:** `lint · typecheck · test (vitest) · build · check:css`.
- **Release:** bump `version`, publish a GitHub Release tagged `vX.Y.Z`; `.github/workflows/publish.yml`
  reruns the gate and `npm publish`es with the Actions `GITHUB_TOKEN`.
- **Storybook** (dev/docs) deploys separately via `.github/workflows/storybook-pages.yml`.
