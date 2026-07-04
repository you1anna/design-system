# Design System Foundation — Design Spec

Date: 2026-07-01
Status: Approved, pending implementation

## Purpose

Build a standalone React component library — a foundation/template, not a finished product —
that gives Robin a real, on-brand set of UI components for any future web UI (a command-center
web view, a replacement for yr2l-emails' Streamlit review UI, or something not yet decided). Once
built, it gets synced to claude.ai/design via the `design-sync` skill so the design agent builds
mockups out of these real components instead of generic ones.

Explicitly **not** a one-shot final system: the component set, visual identity, and token values
are all expected to change as real consumers show up. The architecture is chosen to make that
cheap.

## Non-goals (v1)

- No consumer app wired in yet. This repo stands alone.
- No dark theme shipped (tokens are structured so one is a remap later, not a rewrite).
- No visual-regression tooling (Chromatic etc.) — Storybook + `design-sync`'s own verification
  cover the current need.
- No npm publishing — private, local package, consumed via `design-sync`'s bundling.
- Branding (palette, type) is a Claude-proposed placeholder, expected to be revised after Robin
  sees it rendered in Storybook.

## Tech stack

- Package manager: npm. `package.json`: `name: "design-system"`, `version: "0.1.0"`, `private: true`
  (never published to a registry — consumed locally via `design-sync`'s bundling).
- React 18 + TypeScript (strict mode)
- `tsup` (esbuild-based) to build `dist/` — matches what `design-sync`'s package-shape converter
  expects (esbuild-bundlable output)
- Storybook (Vite builder) for docs, live preview, and higher-fidelity `design-sync` verification
- Vitest + React Testing Library for component tests
- ESLint + Prettier

## Architecture

### Component behavior layer: Radix UI primitives

Components with real interaction complexity (Dialog, Tabs, Select, Checkbox, Radio) are built on
`@radix-ui/react-*` unstyled primitives rather than hand-rolled. Radix owns focus-trapping,
keyboard navigation, ARIA roles, and portals — the parts that are easy to get subtly wrong and
expensive to debug. This library owns 100% of the visual layer on top (markup wrapper, CSS,
variants). This was chosen over two alternatives:

- **Fully custom, no dependencies** — more code to write and maintain, and accessibility
  behavior (focus management etc.) has to be hand-verified per component.
- **Reskin an existing full library (MUI, Chakra)** — faster to a large component count, but
  fights the vendor's own DOM/class structure to look distinctive, and produces something less
  genuinely "Robin's" — a worse fit for what `design-sync` exists to ship (real, owned
  components).

### Styling: CSS Modules + CSS custom-property tokens

No Tailwind, no CSS-in-JS runtime. Two-layer token model:

- **Primitive tokens** — raw palette (e.g. `--ds-blue-500`), raw spacing/type scale — defined once.
- **Semantic tokens** — the names components actually consume (`--ds-color-text-primary`,
  `--ds-color-bg-surface`, `--ds-space-md`), each pointing at a primitive value.

A future theme (dark mode, brand refresh) means remapping the semantic layer, not touching
component code. Plain CSS variables were chosen over Tailwind/CSS-in-JS for portability — no
framework lock-in on the consumer side, and it matches the "token systems" idiom that
`design-sync`'s design agent already knows how to consume (`var(--*)` pattern).

### Repo layout

```
design-system/
  src/
    tokens/              primitive + semantic token definitions (TS, emits tokens.css)
    styles/
      tokens.css         generated/maintained custom-property definitions
      global.css         resets + base styles, imports tokens.css
    components/
      Button/
        Button.tsx
        Button.module.css
        Button.stories.tsx
        Button.test.tsx
        index.ts
      Input/  Select/  Checkbox/  Radio/
      Card/   Badge/   Dialog/    Tabs/    Alert/
      Stack/  Grid/                        (layout primitives)
      index.ts           barrel export of all components
    index.ts              package entry: exports tokens + components + styles path
  .storybook/
  dist/                    tsup build output (gitignored)
  README.md  ARCHITECTURE.md  AGENTS.md  CLAUDE.md
  package.json  tsconfig.json  .eslintrc  vitest.config.ts
```

Adding a component later means adding one new folder following this shape and exporting it from
`src/components/index.ts` — documented as the standard pattern in `ARCHITECTURE.md`.

## Component inventory (v1)

Core set, chosen to cover enough surface for the design agent to build real screens without
over-building up front:

| Component     | Notes                                                |
| ------------- | ---------------------------------------------------- |
| Button        | primary/secondary/ghost variants, sizes              |
| Input         | text input, label + error state                      |
| Select        | Radix Select primitive                               |
| Checkbox      | Radix Checkbox primitive                             |
| Radio (group) | Radix RadioGroup primitive                           |
| Card          | container, header/body/footer slots                  |
| Badge         | status/label chip                                    |
| Dialog        | Radix Dialog primitive (modal)                       |
| Tabs          | Radix Tabs primitive                                 |
| Alert         | inline status/toast-style message                    |
| Stack         | layout primitive (flex, gap from spacing tokens)     |
| Grid          | layout primitive (CSS grid, gap from spacing tokens) |

## Tooling & scripts

- `npm run dev` — Storybook dev server
- `npm run build` — `tsup` build to `dist/`
- `npm test` — Vitest
- `npm run lint` — ESLint
- `npm run storybook:build` — static Storybook build (used by `design-sync`'s storybook-shape
  verification)

## Testing strategy

Each component gets a render test plus a basic interaction test where relevant (e.g. Dialog
opens/closes, Checkbox toggles). Relying on Radix for accessibility guarantees rather than
hand-writing axe checks per component in v1 — full a11y test tooling is a future increment if it
proves necessary.

## Integration with command-center / other repos

- Add `design-system` to the area map table in `/Users/macbookair/Projects/CLAUDE.md`.
- Note its existence in the command-center hub (`map.md` and/or `sources.md`) so it's
  discoverable from `/start` and `hub-orient`.
- No code-level wiring into yr2l-emails or any other repo in this pass — that's future work once
  a concrete consumer is chosen.

## Path to `design-sync`

Once built and passing lint/test/build, run `/design-sync` from inside `design-system/`. It has a
Storybook, so it takes the storybook shape: previews come from real stories, verified against the
repo's own Storybook render. Expect the first sync to prompt for a new claude.ai/design project
(no existing pin) and to take real time given the fidelity/verification loop the skill runs.

## Success criteria

- `npm run build`, `npm test`, `npm run lint` all pass clean.
- Storybook runs locally and every v1 component has at least one story showing its default and
  key variant states.
- Repo has its own `README.md`, `ARCHITECTURE.md`, `AGENTS.md`, `CLAUDE.md` following the
  convention already used by `yr2l-emails`.
- Command-center hub references the new repo (map.md/sources.md) and `Projects/CLAUDE.md`'s area
  map is updated.

## Open questions / future work

- Which concrete app becomes the first real consumer (command-center web view? yr2l-emails
  replacement? something else?) — deliberately deferred.
- Dark theme — deferred; token architecture supports it when needed.
- Whether to push this repo to a GitHub remote (private, under `you1anna/`) — ask separately when
  the repo is ready, per existing git conventions.
