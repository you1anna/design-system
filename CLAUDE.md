# CLAUDE.md — design-system

See `AGENTS.md` for the full agent contract. Quick orientation for Claude Code:

- **What this is:** a standalone React + TypeScript component library on CSS-variable tokens,
  published to GitHub Packages as `@you1anna/design-system` and consumed by version.
- **Fresh clone / web session:** run `npm run bootstrap` first (npm ci only when
  `node_modules` is missing) — the gate fails cryptically without it.
- **Gate before commit:** `npm run lint && npm run typecheck && npm test && npm run build && npm run check:css`.
- **Public surface:** `src/index.ts` barrel, locked by `src/public-api.test.ts`.
- **CSS invariant:** `dist/index.css` (the `./styles.css` export) must ship the `--ds-*` tokens
  *and* component rules — `src/index.ts` imports `styles/global.css` to guarantee it; `check:css`
  enforces it. Don't drop that import.
- **React** stays a peer dependency (kept external in tsup) — moving it to `dependencies` brings
  back duplicate-React for consumers.
- **Publishing** (`npm publish` / release) is outward-facing — flag before running.
- Hub-level context and cross-repo decisions live in the `command-center` repo.
