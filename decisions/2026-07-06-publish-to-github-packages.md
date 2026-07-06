# 2026-07-06 — Publish design-system to GitHub Packages

## Decision

Ship `design-system` as a versioned package `@you1anna/design-system` on **GitHub Packages**.
Consumers install it by semver (`^0.2.0`) and import from the scoped name — not via a relative
`file:` link. First release: `0.2.0`.

## Rationale

- The `file:../design-system` link used by the first consumer caused **duplicate React** ("Invalid
  hook call"): a `file:` dependency gets its own resolution root and a nested React copy. A registry
  tarball carries no `node_modules`, so the consumer's React resolves once (React stays a peer dep).
- A relative link doesn't scale — every new consumer re-hits the fragility, and there is no version
  boundary between library and app. A published package pins versions in the consumer lockfile.
- Forced a real fix to a latent bug: the `--ds-*` tokens were imported only by Storybook, so the
  published `styles.css` shipped component rules referencing undefined variables. `src/index.ts` now
  imports `styles/global.css`, and `scripts/check-css.mjs` guards it.

## Consequences

- `package.json`: scoped name, `version 0.2.0`, `private` removed, `publishConfig` →
  GitHub Packages (`access: restricted`), `repository` field, `sideEffects: ["**/*.css"]`,
  `prepublishOnly: build`. New `.npmrc` maps the scope (no token committed).
- New `.github/workflows/publish.yml` publishes on a `vX.Y.Z` GitHub Release.
- Consumers need `@you1anna:registry=https://npm.pkg.github.com` in `.npmrc` and a
  `NODE_AUTH_TOKEN` with `read:packages`.
- The hub's SHA-based version reconciliation is superseded by the consumer lockfile version.
- The first `npm publish` is an outward action (Robin-gated). Everything is verifiable offline first
  via `npm pack` + tarball install.
