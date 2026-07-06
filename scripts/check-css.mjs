// Build-artifact guard: fail if the published stylesheet is incomplete.
//
// dist/index.css (exposed as `@you1anna/design-system/styles.css`) must contain BOTH:
//   1. the design tokens (--ds-* custom properties from src/styles/tokens.css), and
//   2. at least one component rule (a hashed CSS-module class from a *.module.css).
//
// Regression this guards: the tokens.css file used to be imported only by Storybook,
// so the published CSS shipped component rules referencing undefined var(--ds-*) and
// every consumer rendered unstyled. See decisions/2026-07-06-design-system-packaging.md.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const cssPath = resolve(here, '..', 'dist', 'index.css');

if (!existsSync(cssPath)) {
  console.error(`check:css FAILED — ${cssPath} does not exist. Run \`npm run build\` first.`);
  process.exit(1);
}

const css = readFileSync(cssPath, 'utf8');

// A stable semantic token that must resolve for any consumer.
const TOKEN = '--ds-color-text-primary';
const hasTokens = css.includes(TOKEN);
// Component CSS-module rules land as plain class selectors (e.g. `.button { ... }`).
// Match any of a few core component classes to prove component styles are present.
const hasComponentRule = /\.(button|card|alert|badge|input|table)\s*\{/.test(css);

const problems = [];
if (!hasTokens) problems.push(`missing design tokens (expected \`${TOKEN}\`)`);
if (!hasComponentRule) problems.push('missing component rules (expected a core component class, e.g. `.button`)');

if (problems.length > 0) {
  console.error(`check:css FAILED — dist/index.css is incomplete:\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}

console.log('check:css OK — dist/index.css ships tokens + component rules.');
