# AGENTS.md — design-system

Guidance for AI agents (Codex, Claude, Cursor, …) working in this repo.

## Read first

- `README.md` — what this is, how to consume it (`@you1anna/design-system` on GitHub Packages).
- `docs/ARCHITECTURE.md` — how the package is built, the token pipeline, and the CSS ship guarantee.
- `decisions/` — durable choices; do not re-litigate (packaging → GitHub Packages).

## Verify changes (the gate)

Run the full gate before committing; CI (`publish.yml`) runs the same:

```bash
npm ci
npm run lint
npm run typecheck
npm test            # vitest, unit project
npm run build       # tsup -> dist/
npm run check:css   # dist/index.css must ship tokens + component rules
```

## Conventions that matter

- **Public API is the barrel.** Everything consumers use is re-exported from `src/index.ts` and
  locked by `src/public-api.test.ts`. Adding a component means adding it there.
- **Tokens ship in one stylesheet.** `src/index.ts` imports `src/styles/global.css` (which
  `@import`s `tokens.css`), so `dist/index.css` (= the `./styles.css` export) contains the `--ds-*`
  variables *and* component rules. Never remove that import — `npm run check:css` guards it.
- **Tokens are hand-mirrored.** `src/styles/tokens.css` (CSS vars) and `src/tokens/*.ts` (typed JS)
  must be kept in sync by hand; `tokens.test.ts` guards the TS side's internal consistency.
- **React is a peer dependency**, kept `external` in `tsup.config.ts`. Never move it to
  `dependencies` — that reintroduces duplicate-React for consumers.
- ESM-only (`"type": "module"`, tsup `format: ['esm']`).

## Sensitive / generated

- `dist/` is generated (gitignored) — never commit it; it's built at publish time.
- `.npmrc` maps the scope to GitHub Packages; it holds **no** token. Auth is env-only
  (`NODE_AUTH_TOKEN`). Never commit a token.

## Don't change without asking

- The publish target/registry, the package name/scope, or the peer-dependency stance.
- Publishing itself (`npm publish` / cutting a release) is an outward action — Robin-gated.
