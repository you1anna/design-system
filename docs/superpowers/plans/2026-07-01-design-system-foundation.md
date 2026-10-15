# Design System Foundation Implementation Plan

> Retirement update, 15 October 2026: command-center references describe the earlier model. Hub contracts, registration steps, journal integration and central lifecycle ownership are superseded. Follow this repository's current AGENTS.md and README.md; retain this document as dated design evidence.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone React component library — design tokens plus a core set of 12 components — as an extensible foundation for future web UI, ready to be synced to claude.ai/design via the `design-sync` skill.

**Architecture:** CSS Modules styled by a two-layer (primitive → semantic) CSS custom-property token system; interactive components (Dialog, Tabs, Select, Checkbox, Radio) wrap unstyled Radix UI primitives for accessibility/behavior while this repo owns 100% of the visual layer; `tsup` builds an ESM `dist/` with types; Storybook (Vite builder) provides docs/preview and the higher-fidelity path for `design-sync`'s own verification.

**Tech Stack:** React 18, TypeScript (strict), CSS Modules, Radix UI primitives, Vitest + React Testing Library, tsup, Storybook (Vite builder), ESLint (flat config) + Prettier.

Full rationale: `docs/superpowers/specs/2026-07-01-design-system-foundation-design.md`.

## Global Constraints

- Package manager: npm. `package.json`: `name: "design-system"`, `version: "0.1.0"`, `private: true`. Never publish to a registry.
- React 18 + TypeScript strict mode throughout.
- Styling is CSS Modules referencing `var(--ds-*)` tokens only — never Tailwind, never a CSS-in-JS runtime, never a hardcoded color/spacing/font value in component CSS.
- Tokens are two-layer: primitive (raw values) → semantic (what components consume). Both a CSS file (`src/styles/tokens.css`) and TS objects (`src/tokens/`) exist and must be kept in sync by hand — no codegen in v1.
- Dialog, Tabs, Select, Checkbox, Radio are built on `@radix-ui/react-*` primitives, not hand-rolled.
- No dark theme, no visual-regression tooling, no npm publishing in v1 — explicitly out of scope.
- Every component folder (`src/components/<Name>/`) contains exactly: `<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx`, `<Name>.test.tsx`, `index.ts`.
- Test stack: Vitest, environment `jsdom`, `@testing-library/react` + `@testing-library/user-event`, globals on.
- Before any commit that changes `src/`: the relevant local check (test/build/lint as specified in that task) must pass.
- This is a template/foundation, not a finished product — component set and token values are expected to change; nothing here should be built to resist that.

---

### Task 1: Scaffold package.json, tsconfig, and directory skeleton

**Files:**

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/index.ts`

**Interfaces:**

- Produces: `src/index.ts` as the package entry point (empty module for now — later tasks add real exports).

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "design-system",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create the directory skeleton**

```bash
mkdir -p src/components src/tokens src/styles src/utils
```

- [ ] **Step 4: Write `src/index.ts`**

```ts
export {};
```

- [ ] **Step 5: Install core dependencies**

```bash
npm install react react-dom
npm install -D typescript @types/react @types/react-dom
```

- [ ] **Step 6: Verify the project compiles clean**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json src/index.ts
git commit -m "chore: scaffold package.json, tsconfig, directory skeleton"
```

---

### Task 2: ESLint + Prettier

**Files:**

- Create: `eslint.config.js`
- Create: `.prettierrc.json`
- Create: `.prettierignore`
- Modify: `package.json` (add `format` script)

**Interfaces:**

- Consumes: nothing from Task 1 beyond the existing `package.json`/`tsconfig.json`.
- Produces: `npm run lint` and `npm run format` as working scripts for all later tasks.

- [ ] **Step 1: Install dependencies**

```bash
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier
```

- [ ] **Step 2: Write `eslint.config.js`**

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist/**', 'storybook-static/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { react, 'react-hooks': reactHooks },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  prettier,
);
```

- [ ] **Step 3: Write `.prettierrc.json`**

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

- [ ] **Step 4: Write `.prettierignore`**

```
dist
storybook-static
node_modules
```

- [ ] **Step 5: Add the `format` script to `package.json`**

In the `"scripts"` object, add:

```json
"format": "prettier --write ."
```

- [ ] **Step 6: Verify lint passes clean**

Run: `npm run lint`
Expected: exits 0, no errors (only `src/index.ts` exists and is trivial).

- [ ] **Step 7: Commit**

```bash
git add eslint.config.js .prettierrc.json .prettierignore package.json
git commit -m "chore: add ESLint flat config and Prettier"
```

---

### Task 3: Vitest harness + `cx()` utility

**Files:**

- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/utils/cx.ts`
- Test: `src/utils/cx.test.ts`

**Interfaces:**

- Produces: `cx(...classes: ClassValue[]): string` from `src/utils/cx.ts`, where `type ClassValue = string | false | null | undefined`. Every later component imports `cx` from `../../utils/cx` for joining CSS Module class names.

- [ ] **Step 1: Install dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 2: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: true,
  },
});
```

- [ ] **Step 3: Write `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Write the failing test `src/utils/cx.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins truthy class names with a space', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c');
  });

  it('drops falsy values', () => {
    expect(cx('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('returns an empty string when nothing is truthy', () => {
    expect(cx(false, undefined)).toBe('');
  });
});
```

- [ ] **Step 5: Run the test and confirm it fails**

Run: `npx vitest run src/utils/cx.test.ts`
Expected: FAIL — cannot find module `./cx`.

- [ ] **Step 6: Write `src/utils/cx.ts`**

```ts
export type ClassValue = string | false | null | undefined;

export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
```

- [ ] **Step 7: Run the test and confirm it passes**

Run: `npx vitest run src/utils/cx.test.ts`
Expected: PASS — 3 tests passed.

- [ ] **Step 8: Commit**

```bash
git add vitest.config.ts vitest.setup.ts src/utils package.json package-lock.json
git commit -m "test: add Vitest harness and cx() utility"
```

---

### Task 4: tsup build config

**Files:**

- Create: `tsup.config.ts`
- Modify: `src/index.ts`

**Interfaces:**

- Consumes: `cx` from Task 3.
- Produces: `npm run build` emitting `dist/index.js`, `dist/index.d.ts`, `dist/index.js.map`.

- [ ] **Step 1: Install tsup**

```bash
npm install -D tsup
```

- [ ] **Step 2: Write `tsup.config.ts`**

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
});
```

- [ ] **Step 3: Modify `src/index.ts`**

```ts
export { cx } from './utils/cx';
export type { ClassValue } from './utils/cx';
```

- [ ] **Step 4: Run the build**

Run: `npm run build`
Expected: exits 0; `dist/index.js`, `dist/index.d.ts`, `dist/index.js.map` exist.

- [ ] **Step 5: Verify the type export is present**

Run: `grep -c "cx" dist/index.d.ts`
Expected: at least `1`.

- [ ] **Step 6: Commit**

```bash
git add tsup.config.ts src/index.ts package.json package-lock.json
git commit -m "build: add tsup config, export cx from package entry"
```

---

### Task 5: Storybook init

**Files:**

- Create: `.storybook/main.ts`, `.storybook/preview.ts` (scaffolded by the Storybook CLI)
- Modify: `.storybook/main.ts` (only if the `stories` glob needs adjusting)

**Interfaces:**

- Produces: `npm run storybook:build` as a working static-build command. Real component stories are added starting Task 7; the CLI's own example stories stay in place until Task 20.

- [ ] **Step 1: Run the Storybook initializer**

```bash
npx storybook@latest init --type react --yes
```

If it prompts for a builder/framework, choose the Vite-based React option. Let it install its own dependencies and add its own scripts — afterward, reconcile `package.json`'s `scripts` block with Task 1's (keep `build`/`test`/`lint`/`typecheck` as already defined; keep whatever `storybook`/`storybook:build` scripts style it wrote, editing names back to `storybook`/`storybook:build` if it used different names).

- [ ] **Step 2: Confirm the stories glob covers this repo's layout**

Open `.storybook/main.ts`. Its `stories` array must include a pattern matching `src/components/**/*.stories.tsx`. If it only globs a different default location (e.g. a top-level `stories/` folder), edit the array to:

```ts
stories: ['../src/**/*.stories.@(ts|tsx)', '../src/**/*.mdx'],
```

- [ ] **Step 3: Verify the static build works**

Run: `npm run storybook:build`
Expected: exits 0; `storybook-static/index.html` exists.

- [ ] **Step 4: Commit**

```bash
git add .storybook package.json package-lock.json
git add -A  # picks up any example story files the initializer scaffolded
git commit -m "chore: initialize Storybook (Vite builder)"
```

---

### Task 6: Design tokens (primitive + semantic + CSS)

**Files:**

- Create: `src/tokens/primitives.ts`
- Create: `src/tokens/semantic.ts`
- Create: `src/tokens/index.ts`
- Test: `src/tokens/tokens.test.ts`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Modify: `src/index.ts`
- Modify: `.storybook/preview.ts`

**Interfaces:**

- Produces: `colorPrimitives`, `spacePrimitives`, `radiusPrimitives`, `fontPrimitives` (from `src/tokens/primitives.ts`); `semanticColor`, `semanticSpace`, `semanticRadius`, `semanticFont` (from `src/tokens/semantic.ts`) — all `as const` objects. CSS custom properties prefixed `--ds-*` in `src/styles/tokens.css`, consumed by every component's `.module.css` from this point on.

- [ ] **Step 1: Write `src/tokens/primitives.ts`**

```ts
export const colorPrimitives = {
  white: '#ffffff',
  black: '#000000',
  gray50: '#fafafa',
  gray100: '#f4f4f5',
  gray200: '#e4e4e7',
  gray300: '#d4d4d8',
  gray400: '#a1a1aa',
  gray500: '#71717a',
  gray600: '#52525b',
  gray700: '#3f3f46',
  gray800: '#27272a',
  gray900: '#18181b',
  blue50: '#eff6ff',
  blue300: '#93c5fd',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  red50: '#fef2f2',
  red300: '#fca5a5',
  red500: '#ef4444',
  red700: '#b91c1c',
  green50: '#f0fdf4',
  green300: '#86efac',
  green500: '#22c55e',
  green700: '#15803d',
  amber50: '#fffbeb',
  amber300: '#fcd34d',
  amber500: '#f59e0b',
  amber700: '#b45309',
} as const;

export const spacePrimitives = {
  space0: '0px',
  space1: '4px',
  space2: '8px',
  space3: '12px',
  space4: '16px',
  space6: '24px',
  space8: '32px',
  space12: '48px',
  space16: '64px',
} as const;

export const radiusPrimitives = {
  radiusNone: '0px',
  radiusSm: '4px',
  radiusMd: '8px',
  radiusLg: '12px',
  radiusFull: '9999px',
} as const;

export const fontPrimitives = {
  familySans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  familyMono: "'SFMono-Regular', ui-monospace, Menlo, monospace",
  size12: '12px',
  size14: '14px',
  size16: '16px',
  size18: '18px',
  size24: '24px',
  size32: '32px',
  weight400: '400',
  weight500: '500',
  weight700: '700',
  lineHeight120: '1.2',
  lineHeight150: '1.5',
} as const;
```

- [ ] **Step 2: Write the failing test `src/tokens/tokens.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { colorPrimitives } from './primitives';
import { semanticColor } from './semantic';

describe('semantic tokens', () => {
  it('every semantic color resolves to a defined primitive value', () => {
    const primitiveValues = Object.values(colorPrimitives);
    for (const [name, value] of Object.entries(semanticColor)) {
      expect(
        primitiveValues,
        `semanticColor.${name} = ${value} is not a known primitive`,
      ).toContain(value);
    }
  });
});
```

- [ ] **Step 3: Run the test and confirm it fails**

Run: `npx vitest run src/tokens/tokens.test.ts`
Expected: FAIL — cannot find module `./semantic`.

- [ ] **Step 4: Write `src/tokens/semantic.ts`**

```ts
import { colorPrimitives, spacePrimitives, radiusPrimitives, fontPrimitives } from './primitives';

export const semanticColor = {
  bgPage: colorPrimitives.white,
  bgSurface: colorPrimitives.gray50,
  bgSurfaceHover: colorPrimitives.gray100,
  borderDefault: colorPrimitives.gray300,
  borderStrong: colorPrimitives.gray500,
  textPrimary: colorPrimitives.gray900,
  textSecondary: colorPrimitives.gray600,
  textInverse: colorPrimitives.white,
  actionPrimary: colorPrimitives.blue600,
  actionPrimaryHover: colorPrimitives.blue700,
  actionPrimaryText: colorPrimitives.white,
  danger: colorPrimitives.red500,
  dangerBg: colorPrimitives.red50,
  success: colorPrimitives.green500,
  successBg: colorPrimitives.green50,
  warning: colorPrimitives.amber500,
  warningBg: colorPrimitives.amber50,
} as const;

export const semanticSpace = {
  xs: spacePrimitives.space1,
  sm: spacePrimitives.space2,
  md: spacePrimitives.space4,
  lg: spacePrimitives.space6,
  xl: spacePrimitives.space8,
  '2xl': spacePrimitives.space12,
} as const;

export const semanticRadius = {
  sm: radiusPrimitives.radiusSm,
  md: radiusPrimitives.radiusMd,
  lg: radiusPrimitives.radiusLg,
  full: radiusPrimitives.radiusFull,
} as const;

export const semanticFont = {
  familySans: fontPrimitives.familySans,
  familyMono: fontPrimitives.familyMono,
  sizeXs: fontPrimitives.size12,
  sizeSm: fontPrimitives.size14,
  sizeMd: fontPrimitives.size16,
  sizeLg: fontPrimitives.size18,
  sizeXl: fontPrimitives.size24,
  size2xl: fontPrimitives.size32,
  weightRegular: fontPrimitives.weight400,
  weightMedium: fontPrimitives.weight500,
  weightBold: fontPrimitives.weight700,
  lineHeightTight: fontPrimitives.lineHeight120,
  lineHeightNormal: fontPrimitives.lineHeight150,
} as const;
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `npx vitest run src/tokens/tokens.test.ts`
Expected: PASS.

- [ ] **Step 6: Write `src/tokens/index.ts`**

```ts
export { colorPrimitives, spacePrimitives, radiusPrimitives, fontPrimitives } from './primitives';
export { semanticColor, semanticSpace, semanticRadius, semanticFont } from './semantic';
```

- [ ] **Step 7: Write `src/styles/tokens.css`**

```css
/**
 * Design tokens as CSS custom properties.
 * Values must be kept in sync with src/tokens/primitives.ts and semantic.ts by hand —
 * there is no build-time generator for v1. tokens.test.ts guards internal consistency
 * of the TS side; nothing currently checks this file against it.
 */
:root {
  /* primitive */
  --ds-white: #ffffff;
  --ds-black: #000000;
  --ds-gray-50: #fafafa;
  --ds-gray-100: #f4f4f5;
  --ds-gray-200: #e4e4e7;
  --ds-gray-300: #d4d4d8;
  --ds-gray-400: #a1a1aa;
  --ds-gray-500: #71717a;
  --ds-gray-600: #52525b;
  --ds-gray-700: #3f3f46;
  --ds-gray-800: #27272a;
  --ds-gray-900: #18181b;
  --ds-blue-50: #eff6ff;
  --ds-blue-300: #93c5fd;
  --ds-blue-500: #3b82f6;
  --ds-blue-600: #2563eb;
  --ds-blue-700: #1d4ed8;
  --ds-red-50: #fef2f2;
  --ds-red-300: #fca5a5;
  --ds-red-500: #ef4444;
  --ds-red-700: #b91c1c;
  --ds-green-50: #f0fdf4;
  --ds-green-300: #86efac;
  --ds-green-500: #22c55e;
  --ds-green-700: #15803d;
  --ds-amber-50: #fffbeb;
  --ds-amber-300: #fcd34d;
  --ds-amber-500: #f59e0b;
  --ds-amber-700: #b45309;

  /* semantic: color */
  --ds-color-bg-page: var(--ds-white);
  --ds-color-bg-surface: var(--ds-gray-50);
  --ds-color-bg-surface-hover: var(--ds-gray-100);
  --ds-color-border-default: var(--ds-gray-300);
  --ds-color-border-strong: var(--ds-gray-500);
  --ds-color-text-primary: var(--ds-gray-900);
  --ds-color-text-secondary: var(--ds-gray-600);
  --ds-color-text-inverse: var(--ds-white);
  --ds-color-action-primary: var(--ds-blue-600);
  --ds-color-action-primary-hover: var(--ds-blue-700);
  --ds-color-action-primary-text: var(--ds-white);
  --ds-color-danger: var(--ds-red-500);
  --ds-color-danger-bg: var(--ds-red-50);
  --ds-color-success: var(--ds-green-500);
  --ds-color-success-bg: var(--ds-green-50);
  --ds-color-warning: var(--ds-amber-500);
  --ds-color-warning-bg: var(--ds-amber-50);

  /* semantic: space */
  --ds-space-xs: 4px;
  --ds-space-sm: 8px;
  --ds-space-md: 16px;
  --ds-space-lg: 24px;
  --ds-space-xl: 32px;
  --ds-space-2xl: 48px;

  /* semantic: radius */
  --ds-radius-sm: 4px;
  --ds-radius-md: 8px;
  --ds-radius-lg: 12px;
  --ds-radius-full: 9999px;

  /* semantic: typography */
  --ds-font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --ds-font-family-mono: 'SFMono-Regular', ui-monospace, Menlo, monospace;
  --ds-font-size-xs: 12px;
  --ds-font-size-sm: 14px;
  --ds-font-size-md: 16px;
  --ds-font-size-lg: 18px;
  --ds-font-size-xl: 24px;
  --ds-font-size-2xl: 32px;
  --ds-font-weight-regular: 400;
  --ds-font-weight-medium: 500;
  --ds-font-weight-bold: 700;
  --ds-line-height-tight: 1.2;
  --ds-line-height-normal: 1.5;
}
```

- [ ] **Step 8: Write `src/styles/global.css`**

```css
@import './tokens.css';

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: var(--ds-color-bg-page);
  color: var(--ds-color-text-primary);
  font-family: var(--ds-font-family-sans);
  font-size: var(--ds-font-size-md);
  line-height: var(--ds-line-height-normal);
}
```

- [ ] **Step 9: Modify `.storybook/preview.ts`**

Add this import as the first line of the file (so every story renders with the tokens and base styles applied):

```ts
import '../src/styles/global.css';
```

- [ ] **Step 10: Modify `src/index.ts`**

```ts
export { cx } from './utils/cx';
export type { ClassValue } from './utils/cx';
export * from './tokens';
```

- [ ] **Step 11: Run full verification**

Run: `npm test && npm run build && npm run storybook:build`
Expected: all three exit 0.

- [ ] **Step 12: Commit**

```bash
git add src/tokens src/styles src/index.ts .storybook/preview.ts
git commit -m "feat: add primitive + semantic design tokens and global styles"
```

---

### Task 7: Stack component

**Files:**

- Create: `src/components/Stack/Stack.tsx`
- Create: `src/components/Stack/Stack.module.css`
- Test: `src/components/Stack/Stack.test.tsx`
- Create: `src/components/Stack/Stack.stories.tsx`
- Create: `src/components/Stack/index.ts`

**Interfaces:**

- Consumes: `cx` from `../../utils/cx` (Task 3).
- Produces: `Stack` component, `StackProps`, `StackGap`, `StackAlign`, `StackJustify` types — exported from `src/components/Stack/index.ts`.

- [ ] **Step 1: Write the failing test `src/components/Stack/Stack.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders children', () => {
    render(<Stack>hello</Stack>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('applies a row-direction class when direction="row"', () => {
    render(
      <Stack direction="row" data-testid="stack">
        content
      </Stack>,
    );
    expect(screen.getByTestId('stack').className).toMatch(/row/);
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

Run: `npx vitest run src/components/Stack/Stack.test.tsx`
Expected: FAIL — cannot find module `./Stack`.

- [ ] **Step 3: Write `src/components/Stack/Stack.module.css`**

```css
.stack {
  display: flex;
}
.row {
  flex-direction: row;
}
.column {
  flex-direction: column;
}
.alignStart {
  align-items: flex-start;
}
.alignCenter {
  align-items: center;
}
.alignEnd {
  align-items: flex-end;
}
.alignStretch {
  align-items: stretch;
}
.justifyStart {
  justify-content: flex-start;
}
.justifyCenter {
  justify-content: center;
}
.justifyEnd {
  justify-content: flex-end;
}
.justifyBetween {
  justify-content: space-between;
}
.gapXs {
  gap: var(--ds-space-xs);
}
.gapSm {
  gap: var(--ds-space-sm);
}
.gapMd {
  gap: var(--ds-space-md);
}
.gapLg {
  gap: var(--ds-space-lg);
}
.gapXl {
  gap: var(--ds-space-xl);
}
.gap2xl {
  gap: var(--ds-space-2xl);
}
```

- [ ] **Step 4: Write `src/components/Stack/Stack.tsx`**

```tsx
import { forwardRef } from 'react';
import styles from './Stack.module.css';
import { cx } from '../../utils/cx';

export type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
}

const gapClass: Record<StackGap, string> = {
  xs: styles.gapXs,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
  xl: styles.gapXl,
  '2xl': styles.gap2xl,
};
const alignClass: Record<StackAlign, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
};
const justifyClass: Record<StackJustify, string> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  {
    direction = 'column',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        styles.stack,
        direction === 'row' ? styles.row : styles.column,
        gapClass[gap],
        alignClass[align],
        justifyClass[justify],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
```

- [ ] **Step 5: Run and confirm it passes**

Run: `npx vitest run src/components/Stack/Stack.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 6: Write `src/components/Stack/Stack.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
};
export default meta;
type Story = StoryObj<typeof Stack>;

const swatch = (label: string) => (
  <div key={label} style={{ padding: 8, background: '#eee' }}>
    {label}
  </div>
);

export const Row: Story = {
  args: { direction: 'row', gap: 'md' },
  render: (args) => <Stack {...args}>{['One', 'Two', 'Three'].map(swatch)}</Stack>,
};

export const Column: Story = {
  args: { direction: 'column', gap: 'sm' },
  render: (args) => <Stack {...args}>{['One', 'Two', 'Three'].map(swatch)}</Stack>,
};
```

- [ ] **Step 7: Write `src/components/Stack/index.ts`**

```ts
export { Stack } from './Stack';
export type { StackProps, StackGap, StackAlign, StackJustify } from './Stack';
```

- [ ] **Step 8: Commit**

```bash
git add src/components/Stack
git commit -m "feat: add Stack layout component"
```

---

### Task 8: Grid component

**Files:**

- Create: `src/components/Grid/Grid.tsx`
- Create: `src/components/Grid/Grid.module.css`
- Test: `src/components/Grid/Grid.test.tsx`
- Create: `src/components/Grid/Grid.stories.tsx`
- Create: `src/components/Grid/index.ts`

**Interfaces:**

- Consumes: `cx` from `../../utils/cx` (Task 3).
- Produces: `Grid` component, `GridProps`, `GridGap` types.

- [ ] **Step 1: Write the failing test `src/components/Grid/Grid.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Grid } from './Grid';

describe('Grid', () => {
  it('renders children', () => {
    render(<Grid>hello</Grid>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('sets grid-template-columns from the columns prop', () => {
    render(
      <Grid columns={4} data-testid="grid">
        content
      </Grid>,
    );
    expect(screen.getByTestId('grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    });
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

Run: `npx vitest run src/components/Grid/Grid.test.tsx`
Expected: FAIL — cannot find module `./Grid`.

- [ ] **Step 3: Write `src/components/Grid/Grid.module.css`**

```css
.grid {
  display: grid;
}
.gapXs {
  gap: var(--ds-space-xs);
}
.gapSm {
  gap: var(--ds-space-sm);
}
.gapMd {
  gap: var(--ds-space-md);
}
.gapLg {
  gap: var(--ds-space-lg);
}
.gapXl {
  gap: var(--ds-space-xl);
}
.gap2xl {
  gap: var(--ds-space-2xl);
}
```

- [ ] **Step 4: Write `src/components/Grid/Grid.tsx`**

```tsx
import { forwardRef, type CSSProperties } from 'react';
import styles from './Grid.module.css';
import { cx } from '../../utils/cx';

export type GridGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gap?: GridGap;
}

const gapClass: Record<GridGap, string> = {
  xs: styles.gapXs,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
  xl: styles.gapXl,
  '2xl': styles.gap2xl,
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns = 2, gap = 'md', className, style, children, ...rest },
  ref,
) {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    ...style,
  };
  return (
    <div
      ref={ref}
      className={cx(styles.grid, gapClass[gap], className)}
      style={gridStyle}
      {...rest}
    >
      {children}
    </div>
  );
});
```

- [ ] **Step 5: Run and confirm it passes**

Run: `npx vitest run src/components/Grid/Grid.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 6: Write `src/components/Grid/Grid.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
};
export default meta;
type Story = StoryObj<typeof Grid>;

export const ThreeColumns: Story = {
  args: { columns: 3, gap: 'md' },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ padding: 16, background: '#eee' }}>
          Cell {i + 1}
        </div>
      ))}
    </Grid>
  ),
};
```

- [ ] **Step 7: Write `src/components/Grid/index.ts`**

```ts
export { Grid } from './Grid';
export type { GridProps, GridGap } from './Grid';
```

- [ ] **Step 8: Commit**

```bash
git add src/components/Grid
git commit -m "feat: add Grid layout component"
```

---

### Task 9: Button component

**Files:**

- Create: `src/components/Button/Button.tsx`
- Create: `src/components/Button/Button.module.css`
- Test: `src/components/Button/Button.test.tsx`
- Create: `src/components/Button/Button.stories.tsx`
- Create: `src/components/Button/index.ts`

**Interfaces:**

- Consumes: `cx` from `../../utils/cx` (Task 3).
- Produces: `Button` component, `ButtonProps`, `ButtonVariant`, `ButtonSize` types. `Card.stories.tsx` and `Dialog.stories.tsx` (Tasks 11, 18) import `Button` from `../Button`.

- [ ] **Step 1: Write the failing test `src/components/Button/Button.test.tsx`**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

Run: `npx vitest run src/components/Button/Button.test.tsx`
Expected: FAIL — cannot find module `./Button`.

- [ ] **Step 3: Write `src/components/Button/Button.module.css`**

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ds-font-family-sans);
  font-weight: var(--ds-font-weight-medium);
  border-radius: var(--ds-radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}
.button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.button:focus-visible {
  outline: 2px solid var(--ds-color-action-primary);
  outline-offset: 2px;
}

.primary {
  background-color: var(--ds-color-action-primary);
  color: var(--ds-color-action-primary-text);
}
.primary:not(:disabled):hover {
  background-color: var(--ds-color-action-primary-hover);
}

.secondary {
  background-color: var(--ds-color-bg-surface);
  color: var(--ds-color-text-primary);
  border-color: var(--ds-color-border-default);
}
.secondary:not(:disabled):hover {
  background-color: var(--ds-color-bg-surface-hover);
}

.ghost {
  background-color: transparent;
  color: var(--ds-color-text-primary);
}
.ghost:not(:disabled):hover {
  background-color: var(--ds-color-bg-surface-hover);
}

.danger {
  background-color: var(--ds-color-danger);
  color: var(--ds-color-action-primary-text);
}
.danger:not(:disabled):hover {
  opacity: 0.9;
}

.sm {
  padding: var(--ds-space-xs) var(--ds-space-sm);
  font-size: var(--ds-font-size-sm);
}
.md {
  padding: var(--ds-space-sm) var(--ds-space-md);
  font-size: var(--ds-font-size-md);
}
.lg {
  padding: var(--ds-space-md) var(--ds-space-lg);
  font-size: var(--ds-font-size-lg);
}
```

- [ ] **Step 4: Write `src/components/Button/Button.tsx`**

```tsx
import { forwardRef } from 'react';
import styles from './Button.module.css';
import { cx } from '../../utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
};
const sizeClass: Record<ButtonSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.button, variantClass[variant], sizeClass[size], className)}
      {...rest}
    />
  );
});
```

- [ ] **Step 5: Run and confirm it passes**

Run: `npx vitest run src/components/Button/Button.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 6: Write `src/components/Button/Button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true, children: 'Disabled' } };
```

- [ ] **Step 7: Write `src/components/Button/index.ts`**

```ts
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';
```

- [ ] **Step 8: Commit**

```bash
git add src/components/Button
git commit -m "feat: add Button component"
```

---

### Task 10: Badge component

**Files:**

- Create: `src/components/Badge/Badge.tsx`
- Create: `src/components/Badge/Badge.module.css`
- Test: `src/components/Badge/Badge.test.tsx`
- Create: `src/components/Badge/Badge.stories.tsx`
- Create: `src/components/Badge/index.ts`

**Interfaces:**

- Consumes: `cx` from `../../utils/cx` (Task 3).
- Produces: `Badge` component, `BadgeProps`, `BadgeTone` types.

- [ ] **Step 1: Write the failing test `src/components/Badge/Badge.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('defaults to neutral tone', () => {
    render(<Badge data-testid="badge">Active</Badge>);
    expect(screen.getByTestId('badge').className).toMatch(/neutral/);
  });

  it('applies the danger tone class', () => {
    render(
      <Badge tone="danger" data-testid="badge">
        Failed
      </Badge>,
    );
    expect(screen.getByTestId('badge').className).toMatch(/danger/);
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

Run: `npx vitest run src/components/Badge/Badge.test.tsx`
Expected: FAIL — cannot find module `./Badge`.

- [ ] **Step 3: Write `src/components/Badge/Badge.module.css`**

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px var(--ds-space-sm);
  border-radius: var(--ds-radius-full);
  font-family: var(--ds-font-family-sans);
  font-size: var(--ds-font-size-xs);
  font-weight: var(--ds-font-weight-medium);
  line-height: var(--ds-line-height-tight);
}
.neutral {
  background-color: var(--ds-color-bg-surface-hover);
  color: var(--ds-color-text-primary);
}
.success {
  background-color: var(--ds-color-success-bg);
  color: var(--ds-color-success);
}
.warning {
  background-color: var(--ds-color-warning-bg);
  color: var(--ds-color-warning);
}
.danger {
  background-color: var(--ds-color-danger-bg);
  color: var(--ds-color-danger);
}
```

- [ ] **Step 4: Write `src/components/Badge/Badge.tsx`**

```tsx
import styles from './Badge.module.css';
import { cx } from '../../utils/cx';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClass: Record<BadgeTone, string> = {
  neutral: styles.neutral,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return <span className={cx(styles.badge, toneClass[tone], className)} {...rest} />;
}
```

- [ ] **Step 5: Run and confirm it passes**

Run: `npx vitest run src/components/Badge/Badge.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 6: Write `src/components/Badge/Badge.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge tone="neutral">Neutral</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="danger">Danger</Badge>
    </div>
  ),
};
```

- [ ] **Step 7: Write `src/components/Badge/index.ts`**

```ts
export { Badge } from './Badge';
export type { BadgeProps, BadgeTone } from './Badge';
```

- [ ] **Step 8: Commit**

```bash
git add src/components/Badge
git commit -m "feat: add Badge component"
```

---

### Task 11: Alert component

**Files:**

- Create: `src/components/Alert/Alert.tsx`
- Create: `src/components/Alert/Alert.module.css`
- Test: `src/components/Alert/Alert.test.tsx`
- Create: `src/components/Alert/Alert.stories.tsx`
- Create: `src/components/Alert/index.ts`

**Interfaces:**

- Consumes: `cx` from `../../utils/cx` (Task 3).
- Produces: `Alert` component, `AlertProps`, `AlertTone` types.

- [ ] **Step 1: Write the failing test `src/components/Alert/Alert.test.tsx`**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders title and children', () => {
    render(<Alert title="Heads up">Something happened</Alert>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('exposes role="alert"', () => {
    render(<Alert>Notice</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('calls onDismiss when the dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<Alert onDismiss={onDismiss}>Notice</Alert>);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render a dismiss button when onDismiss is not provided', () => {
    render(<Alert>Notice</Alert>);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

Run: `npx vitest run src/components/Alert/Alert.test.tsx`
Expected: FAIL — cannot find module `./Alert`.

- [ ] **Step 3: Write `src/components/Alert/Alert.module.css`**

```css
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--ds-space-sm);
  padding: var(--ds-space-md);
  border-radius: var(--ds-radius-md);
  font-family: var(--ds-font-family-sans);
  font-size: var(--ds-font-size-sm);
}
.content {
  flex: 1;
}
.title {
  margin: 0 0 var(--ds-space-xs) 0;
  font-weight: var(--ds-font-weight-bold);
}
.body {
  margin: 0;
}
.dismiss {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--ds-font-size-lg);
  line-height: 1;
  color: inherit;
}

.info {
  background-color: var(--ds-color-bg-surface);
  color: var(--ds-color-text-primary);
}
.success {
  background-color: var(--ds-color-success-bg);
  color: var(--ds-color-success);
}
.warning {
  background-color: var(--ds-color-warning-bg);
  color: var(--ds-color-warning);
}
.danger {
  background-color: var(--ds-color-danger-bg);
  color: var(--ds-color-danger);
}
```

- [ ] **Step 4: Write `src/components/Alert/Alert.tsx`**

```tsx
import styles from './Alert.module.css';
import { cx } from '../../utils/cx';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  title?: string;
  onDismiss?: () => void;
}

const toneClass: Record<AlertTone, string> = {
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

export function Alert({
  tone = 'info',
  title,
  onDismiss,
  className,
  children,
  ...rest
}: AlertProps) {
  return (
    <div role="alert" className={cx(styles.alert, toneClass[tone], className)} {...rest}>
      <div className={styles.content}>
        {title ? <p className={styles.title}>{title}</p> : null}
        {children ? <div className={styles.body}>{children}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={onDismiss}>
          &times;
        </button>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 5: Run and confirm it passes**

Run: `npx vitest run src/components/Alert/Alert.test.tsx`
Expected: PASS — 4 tests passed.

- [ ] **Step 6: Write `src/components/Alert/Alert.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: { tone: 'info', title: 'Heads up', children: 'This is an informational message.' },
};
export const Success: Story = {
  args: { tone: 'success', title: 'Saved', children: 'Your changes were saved.' },
};
export const Warning: Story = {
  args: { tone: 'warning', title: 'Careful', children: 'This action needs review.' },
};
export const Danger: Story = {
  args: { tone: 'danger', title: 'Error', children: 'Something went wrong.' },
};
export const Dismissible: Story = {
  args: {
    tone: 'info',
    title: 'Dismissible',
    children: 'Click the × to dismiss.',
    onDismiss: () => {},
  },
};
```

- [ ] **Step 7: Write `src/components/Alert/index.ts`**

```ts
export { Alert } from './Alert';
export type { AlertProps, AlertTone } from './Alert';
```

- [ ] **Step 8: Commit**

```bash
git add src/components/Alert
git commit -m "feat: add Alert component"
```

---

### Task 12: Card component

**Files:**

- Create: `src/components/Card/Card.tsx`
- Create: `src/components/Card/Card.module.css`
- Test: `src/components/Card/Card.test.tsx`
- Create: `src/components/Card/Card.stories.tsx`
- Create: `src/components/Card/index.ts`

**Interfaces:**

- Consumes: `cx` from `../../utils/cx` (Task 3); `Button` from `../Button` (Task 9, story only).
- Produces: `Card` (with `Card.Header`, `Card.Body`, `Card.Footer` static members), `CardProps` type.

- [ ] **Step 1: Write the failing test `src/components/Card/Card.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders header, body, and footer content', () => {
    render(
      <Card>
        <Card.Header>Title</Card.Header>
        <Card.Body>Body text</Card.Body>
        <Card.Footer>Footer actions</Card.Footer>
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

Run: `npx vitest run src/components/Card/Card.test.tsx`
Expected: FAIL — cannot find module `./Card`.

- [ ] **Step 3: Write `src/components/Card/Card.module.css`**

```css
.card {
  background-color: var(--ds-color-bg-page);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-lg);
  overflow: hidden;
}
.header {
  padding: var(--ds-space-md);
  border-bottom: 1px solid var(--ds-color-border-default);
  font-weight: var(--ds-font-weight-bold);
}
.body {
  padding: var(--ds-space-md);
}
.footer {
  padding: var(--ds-space-md);
  border-top: 1px solid var(--ds-color-border-default);
  display: flex;
  gap: var(--ds-space-sm);
  justify-content: flex-end;
}
```

- [ ] **Step 4: Write `src/components/Card/Card.tsx`**

```tsx
import styles from './Card.module.css';
import { cx } from '../../utils/cx';

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

function CardRoot({ className, ...rest }: CardProps) {
  return <div className={cx(styles.card, className)} {...rest} />;
}

function CardHeader({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.header, className)} {...rest} />;
}

function CardBody({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.body, className)} {...rest} />;
}

function CardFooter({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.footer, className)} {...rest} />;
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
```

- [ ] **Step 5: Run and confirm it passes**

Run: `npx vitest run src/components/Card/Card.test.tsx`
Expected: PASS — 1 test passed.

- [ ] **Step 6: Write `src/components/Card/Card.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 320 }}>
      <Card.Header>Card title</Card.Header>
      <Card.Body>Some supporting body content for the card.</Card.Body>
      <Card.Footer>
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </Card.Footer>
    </Card>
  ),
};
```

- [ ] **Step 7: Write `src/components/Card/index.ts`**

```ts
export { Card } from './Card';
export type { CardProps } from './Card';
```

- [ ] **Step 8: Commit**

```bash
git add src/components/Card
git commit -m "feat: add Card component"
```

---

### Task 13: Input component

**Files:**

- Create: `src/components/Input/Input.tsx`
- Create: `src/components/Input/Input.module.css`
- Test: `src/components/Input/Input.test.tsx`
- Create: `src/components/Input/Input.stories.tsx`
- Create: `src/components/Input/index.ts`

**Interfaces:**

- Consumes: `cx` from `../../utils/cx` (Task 3).
- Produces: `Input` component, `InputProps` type.

- [ ] **Step 1: Write the failing test `src/components/Input/Input.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('associates the label with the input', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows an error message and marks the input invalid', () => {
    render(<Input label="Email" error="Email is required" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('does not mark the input invalid when there is no error', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false');
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

Run: `npx vitest run src/components/Input/Input.test.tsx`
Expected: FAIL — cannot find module `./Input`.

- [ ] **Step 3: Write `src/components/Input/Input.module.css`**

```css
.field {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-xs);
  font-family: var(--ds-font-family-sans);
}
.label {
  font-size: var(--ds-font-size-sm);
  font-weight: var(--ds-font-weight-medium);
  color: var(--ds-color-text-primary);
}
.input {
  padding: var(--ds-space-sm) var(--ds-space-md);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-md);
  font-size: var(--ds-font-size-md);
  color: var(--ds-color-text-primary);
  background-color: var(--ds-color-bg-page);
}
.input:focus-visible {
  outline: 2px solid var(--ds-color-action-primary);
  outline-offset: 1px;
}
.inputError {
  border-color: var(--ds-color-danger);
}
.error {
  margin: 0;
  font-size: var(--ds-font-size-xs);
  color: var(--ds-color-danger);
}
```

- [ ] **Step 4: Write `src/components/Input/Input.tsx`**

```tsx
import { forwardRef, useId } from 'react';
import styles from './Input.module.css';
import { cx } from '../../utils/cx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={cx(styles.input, error && styles.inputError, className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
});
```

- [ ] **Step 5: Run and confirm it passes**

Run: `npx vitest run src/components/Input/Input.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 6: Write `src/components/Input/Input.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { label: 'Email', placeholder: 'you@example.com' } };
export const WithError: Story = {
  args: { label: 'Email', placeholder: 'you@example.com', error: 'Email is required' },
};
```

- [ ] **Step 7: Write `src/components/Input/index.ts`**

```ts
export { Input } from './Input';
export type { InputProps } from './Input';
```

- [ ] **Step 8: Commit**

```bash
git add src/components/Input
git commit -m "feat: add Input component"
```

---

### Task 14: Checkbox component (Radix)

**Files:**

- Create: `src/components/Checkbox/Checkbox.tsx`
- Create: `src/components/Checkbox/Checkbox.module.css`
- Test: `src/components/Checkbox/Checkbox.test.tsx`
- Create: `src/components/Checkbox/Checkbox.stories.tsx`
- Create: `src/components/Checkbox/index.ts`

**Interfaces:**

- Consumes: `cx` from `../../utils/cx` (Task 3); `@radix-ui/react-checkbox`.
- Produces: `Checkbox` component, `CheckboxProps` type.

- [ ] **Step 1: Install Radix Checkbox**

```bash
npm install @radix-ui/react-checkbox
```

- [ ] **Step 2: Write the failing test `src/components/Checkbox/Checkbox.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders its label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('toggles and calls onCheckedChange', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept terms" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('respects the disabled prop', () => {
    render(<Checkbox label="Accept terms" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
```

- [ ] **Step 3: Run and confirm it fails**

Run: `npx vitest run src/components/Checkbox/Checkbox.test.tsx`
Expected: FAIL — cannot find module `./Checkbox`.

- [ ] **Step 4: Write `src/components/Checkbox/Checkbox.module.css`**

```css
.row {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-sm);
  font-family: var(--ds-font-family-sans);
}
.root {
  all: unset;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-sm);
  background-color: var(--ds-color-bg-page);
  cursor: pointer;
}
.root[data-state='checked'] {
  background-color: var(--ds-color-action-primary);
  border-color: var(--ds-color-action-primary);
}
.root:focus-visible {
  outline: 2px solid var(--ds-color-action-primary);
  outline-offset: 2px;
}
.indicator {
  color: var(--ds-color-action-primary-text);
  font-size: var(--ds-font-size-xs);
  line-height: 1;
}
.label {
  font-size: var(--ds-font-size-sm);
  color: var(--ds-color-text-primary);
}
```

- [ ] **Step 5: Write `src/components/Checkbox/Checkbox.tsx`**

```tsx
import { forwardRef, useId } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import styles from './Checkbox.module.css';
import { cx } from '../../utils/cx';

export interface CheckboxProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { label, checked, defaultChecked, onCheckedChange, disabled, id, className },
  ref,
) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className={cx(styles.row, className)}>
      <RadixCheckbox.Root
        ref={ref}
        id={checkboxId}
        className={styles.root}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onCheckedChange={(state) => onCheckedChange?.(state === true)}
      >
        <RadixCheckbox.Indicator className={styles.indicator}>&#10003;</RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <label htmlFor={checkboxId} className={styles.label}>
        {label}
      </label>
    </div>
  );
});
```

- [ ] **Step 6: Run and confirm it passes**

Run: `npx vitest run src/components/Checkbox/Checkbox.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 7: Write `src/components/Checkbox/Checkbox.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = { args: { label: 'Accept terms and conditions' } };
export const Checked: Story = {
  args: { label: 'Accept terms and conditions', defaultChecked: true },
};
export const Disabled: Story = { args: { label: 'Accept terms and conditions', disabled: true } };
```

- [ ] **Step 8: Write `src/components/Checkbox/index.ts`**

```ts
export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';
```

- [ ] **Step 9: Commit**

```bash
git add src/components/Checkbox package.json package-lock.json
git commit -m "feat: add Checkbox component (Radix)"
```

---

### Task 15: Radio component (Radix)

**Files:**

- Create: `src/components/Radio/Radio.tsx`
- Create: `src/components/Radio/Radio.module.css`
- Test: `src/components/Radio/Radio.test.tsx`
- Create: `src/components/Radio/Radio.stories.tsx`
- Create: `src/components/Radio/index.ts`

**Interfaces:**

- Consumes: `cx` from `../../utils/cx` (Task 3); `@radix-ui/react-radio-group`.
- Produces: `Radio` component, `RadioProps`, `RadioOption` types.

- [ ] **Step 1: Install Radix Radio Group**

```bash
npm install @radix-ui/react-radio-group
```

- [ ] **Step 2: Write the failing test `src/components/Radio/Radio.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio } from './Radio';

const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
];

describe('Radio', () => {
  it('renders one radio button per option', () => {
    render(<Radio name="size" options={options} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('calls onValueChange with the selected value', async () => {
    const onValueChange = vi.fn();
    render(<Radio name="size" options={options} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByLabelText('Medium'));
    expect(onValueChange).toHaveBeenCalledWith('md');
  });

  it('marks the defaultValue option as checked', () => {
    render(<Radio name="size" options={options} defaultValue="lg" />);
    expect(screen.getByLabelText('Large')).toHaveAttribute('data-state', 'checked');
  });
});
```

- [ ] **Step 3: Run and confirm it fails**

Run: `npx vitest run src/components/Radio/Radio.test.tsx`
Expected: FAIL — cannot find module `./Radio`.

- [ ] **Step 4: Write `src/components/Radio/Radio.module.css`**

```css
.group {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-sm);
  font-family: var(--ds-font-family-sans);
}
.row {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-sm);
}
.item {
  all: unset;
  width: 18px;
  height: 18px;
  border-radius: var(--ds-radius-full);
  border: 1px solid var(--ds-color-border-default);
  background-color: var(--ds-color-bg-page);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.item[data-state='checked'] {
  border-color: var(--ds-color-action-primary);
}
.item:focus-visible {
  outline: 2px solid var(--ds-color-action-primary);
  outline-offset: 2px;
}
.indicator {
  width: 10px;
  height: 10px;
  border-radius: var(--ds-radius-full);
  background-color: var(--ds-color-action-primary);
}
.label {
  font-size: var(--ds-font-size-sm);
  color: var(--ds-color-text-primary);
}
```

- [ ] **Step 5: Write `src/components/Radio/Radio.tsx`**

```tsx
import { useId } from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import styles from './Radio.module.css';
import { cx } from '../../utils/cx';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioProps {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

function RadioOptionRow({ option }: { option: RadioOption }) {
  const id = useId();
  return (
    <div className={styles.row}>
      <RadixRadioGroup.Item id={id} value={option.value} className={styles.item}>
        <RadixRadioGroup.Indicator className={styles.indicator} />
      </RadixRadioGroup.Item>
      <label htmlFor={id} className={styles.label}>
        {option.label}
      </label>
    </div>
  );
}

export function Radio({
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
}: RadioProps) {
  return (
    <RadixRadioGroup.Root
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      className={cx(styles.group, className)}
    >
      {options.map((option) => (
        <RadioOptionRow key={option.value} option={option} />
      ))}
    </RadixRadioGroup.Root>
  );
}
```

- [ ] **Step 6: Run and confirm it passes**

Run: `npx vitest run src/components/Radio/Radio.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 7: Write `src/components/Radio/Radio.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
};
export default meta;
type Story = StoryObj<typeof Radio>;

const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
];

export const Default: Story = { args: { name: 'size', options, defaultValue: 'md' } };
```

- [ ] **Step 8: Write `src/components/Radio/index.ts`**

```ts
export { Radio } from './Radio';
export type { RadioProps, RadioOption } from './Radio';
```

- [ ] **Step 9: Commit**

```bash
git add src/components/Radio package.json package-lock.json
git commit -m "feat: add Radio component (Radix)"
```

---

### Task 16: Select component (Radix)

**Files:**

- Create: `src/components/Select/Select.tsx`
- Create: `src/components/Select/Select.module.css`
- Test: `src/components/Select/Select.test.tsx`
- Create: `src/components/Select/Select.stories.tsx`
- Create: `src/components/Select/index.ts`
- Modify: `vitest.setup.ts` (jsdom polyfills Radix Select needs)

**Interfaces:**

- Consumes: `cx` from `../../utils/cx` (Task 3); `@radix-ui/react-select`.
- Produces: `Select` component, `SelectProps`, `SelectOption` types.

- [ ] **Step 1: Install Radix Select**

```bash
npm install @radix-ui/react-select
```

- [ ] **Step 2: Add jsdom polyfills Radix Select needs, to `vitest.setup.ts`**

Append to the end of the file:

```ts
// Radix Select (and other Radix primitives using pointer capture) need these in jsdom.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
```

- [ ] **Step 3: Write the failing test `src/components/Select/Select.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
];

describe('Select', () => {
  it('renders the trigger with a label', () => {
    render(<Select label="Size" options={options} />);
    expect(screen.getByRole('combobox', { name: 'Size' })).toBeInTheDocument();
  });

  it('shows the placeholder when no value is set', () => {
    render(<Select label="Size" options={options} placeholder="Choose a size" />);
    expect(screen.getByText('Choose a size')).toBeInTheDocument();
  });

  it('opens the option list and selects a value', async () => {
    const onValueChange = vi.fn();
    render(<Select label="Size" options={options} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Size' }));
    const option = await screen.findByText('Medium');
    await userEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith('md');
  });
});
```

- [ ] **Step 4: Run and confirm it fails**

Run: `npx vitest run src/components/Select/Select.test.tsx`
Expected: FAIL — cannot find module `./Select`.

- [ ] **Step 5: Write `src/components/Select/Select.module.css`**

```css
.field {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-xs);
  font-family: var(--ds-font-family-sans);
}
.label {
  font-size: var(--ds-font-size-sm);
  font-weight: var(--ds-font-weight-medium);
  color: var(--ds-color-text-primary);
}
.trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-space-sm);
  padding: var(--ds-space-sm) var(--ds-space-md);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-md);
  background-color: var(--ds-color-bg-page);
  font-size: var(--ds-font-size-md);
  color: var(--ds-color-text-primary);
  cursor: pointer;
}
.trigger:focus-visible {
  outline: 2px solid var(--ds-color-action-primary);
  outline-offset: 1px;
}
.icon {
  color: var(--ds-color-text-secondary);
}
.content {
  background-color: var(--ds-color-bg-page);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.item {
  padding: var(--ds-space-sm) var(--ds-space-md);
  font-size: var(--ds-font-size-md);
  color: var(--ds-color-text-primary);
  cursor: pointer;
}
.item[data-highlighted] {
  background-color: var(--ds-color-bg-surface-hover);
  outline: none;
}
```

- [ ] **Step 6: Write `src/components/Select/Select.tsx`**

```tsx
import { useId } from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import styles from './Select.module.css';
import { cx } from '../../utils/cx';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select...',
  disabled,
  className,
}: SelectProps) {
  const id = useId();

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger id={id} className={styles.trigger} aria-label={label}>
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className={styles.icon}>&#9662;</RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className={styles.content}>
            <RadixSelect.Viewport>
              {options.map((option) => (
                <RadixSelect.Item key={option.value} value={option.value} className={styles.item}>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}
```

- [ ] **Step 7: Run and confirm it passes**

Run: `npx vitest run src/components/Select/Select.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 8: Write `src/components/Select/Select.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
};
export default meta;
type Story = StoryObj<typeof Select>;

const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
];

export const Default: Story = { args: { label: 'Size', options, placeholder: 'Choose a size' } };
export const Preselected: Story = { args: { label: 'Size', options, defaultValue: 'md' } };
```

- [ ] **Step 9: Write `src/components/Select/index.ts`**

```ts
export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';
```

- [ ] **Step 10: Commit**

```bash
git add src/components/Select vitest.setup.ts package.json package-lock.json
git commit -m "feat: add Select component (Radix)"
```

---

### Task 17: Tabs component (Radix)

**Files:**

- Create: `src/components/Tabs/Tabs.tsx`
- Create: `src/components/Tabs/Tabs.module.css`
- Test: `src/components/Tabs/Tabs.test.tsx`
- Create: `src/components/Tabs/Tabs.stories.tsx`
- Create: `src/components/Tabs/index.ts`

**Interfaces:**

- Consumes: `cx` from `../../utils/cx` (Task 3); `@radix-ui/react-tabs`.
- Produces: `Tabs` component, `TabsProps`, `TabItem` types.

- [ ] **Step 1: Install Radix Tabs**

```bash
npm install @radix-ui/react-tabs
```

- [ ] **Step 2: Write the failing test `src/components/Tabs/Tabs.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tabs } from './Tabs';

const items = [
  { value: 'one', label: 'One', content: <p>Content one</p> },
  { value: 'two', label: 'Two', content: <p>Content two</p> },
];

describe('Tabs', () => {
  it('shows the first tab content by default', () => {
    render(<Tabs items={items} />);
    expect(screen.getByText('Content one')).toBeVisible();
  });

  it('switches content when a tab is clicked', async () => {
    render(<Tabs items={items} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByText('Content two')).toBeVisible();
  });
});
```

- [ ] **Step 3: Run and confirm it fails**

Run: `npx vitest run src/components/Tabs/Tabs.test.tsx`
Expected: FAIL — cannot find module `./Tabs`.

- [ ] **Step 4: Write `src/components/Tabs/Tabs.module.css`**

```css
.root {
  font-family: var(--ds-font-family-sans);
}
.list {
  display: flex;
  gap: var(--ds-space-md);
  border-bottom: 1px solid var(--ds-color-border-default);
}
.trigger {
  all: unset;
  padding: var(--ds-space-sm) var(--ds-space-xs);
  font-size: var(--ds-font-size-md);
  color: var(--ds-color-text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
}
.trigger[data-state='active'] {
  color: var(--ds-color-text-primary);
  border-bottom-color: var(--ds-color-action-primary);
}
.trigger:focus-visible {
  outline: 2px solid var(--ds-color-action-primary);
  outline-offset: 2px;
}
.content {
  padding: var(--ds-space-md) 0;
}
```

- [ ] **Step 5: Write `src/components/Tabs/Tabs.tsx`**

```tsx
import * as RadixTabs from '@radix-ui/react-tabs';
import styles from './Tabs.module.css';
import { cx } from '../../utils/cx';

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ items, defaultValue, value, onValueChange, className }: TabsProps) {
  return (
    <RadixTabs.Root
      className={cx(styles.root, className)}
      defaultValue={defaultValue ?? items[0]?.value}
      value={value}
      onValueChange={onValueChange}
    >
      <RadixTabs.List className={styles.list}>
        {items.map((item) => (
          <RadixTabs.Trigger key={item.value} value={item.value} className={styles.trigger}>
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className={styles.content}>
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
```

- [ ] **Step 6: Run and confirm it passes**

Run: `npx vitest run src/components/Tabs/Tabs.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 7: Write `src/components/Tabs/Tabs.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    items: [
      { value: 'account', label: 'Account', content: <p>Account settings go here.</p> },
      { value: 'billing', label: 'Billing', content: <p>Billing details go here.</p> },
      { value: 'team', label: 'Team', content: <p>Team members go here.</p> },
    ],
  },
};
```

- [ ] **Step 8: Write `src/components/Tabs/index.ts`**

```ts
export { Tabs } from './Tabs';
export type { TabsProps, TabItem } from './Tabs';
```

- [ ] **Step 9: Commit**

```bash
git add src/components/Tabs package.json package-lock.json
git commit -m "feat: add Tabs component (Radix)"
```

---

### Task 18: Dialog component (Radix)

**Files:**

- Create: `src/components/Dialog/Dialog.tsx`
- Create: `src/components/Dialog/Dialog.module.css`
- Test: `src/components/Dialog/Dialog.test.tsx`
- Create: `src/components/Dialog/Dialog.stories.tsx`
- Create: `src/components/Dialog/index.ts`

**Interfaces:**

- Consumes: `@radix-ui/react-dialog`; `Button` from `../Button` (Task 9, story only).
- Produces: `Dialog` component, `DialogProps` type.

- [ ] **Step 1: Install Radix Dialog**

```bash
npm install @radix-ui/react-dialog
```

- [ ] **Step 2: Write the failing test `src/components/Dialog/Dialog.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('is closed until the trigger is clicked', () => {
    render(<Dialog trigger={<button>Open</button>} title="Confirm action" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on trigger click and shows the title', async () => {
    render(<Dialog trigger={<button>Open</button>} title="Confirm action" />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm action')).toBeInTheDocument();
  });

  it('closes when the close button is clicked', async () => {
    render(<Dialog trigger={<button>Open</button>} title="Confirm action" />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run and confirm it fails**

Run: `npx vitest run src/components/Dialog/Dialog.test.tsx`
Expected: FAIL — cannot find module `./Dialog`.

- [ ] **Step 4: Write `src/components/Dialog/Dialog.module.css`**

```css
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
}
.content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(420px, 90vw);
  background-color: var(--ds-color-bg-page);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-lg);
  font-family: var(--ds-font-family-sans);
}
.title {
  margin: 0 0 var(--ds-space-xs) 0;
  font-size: var(--ds-font-size-lg);
  font-weight: var(--ds-font-weight-bold);
  color: var(--ds-color-text-primary);
}
.description {
  margin: 0 0 var(--ds-space-md) 0;
  font-size: var(--ds-font-size-sm);
  color: var(--ds-color-text-secondary);
}
.body {
  margin-bottom: var(--ds-space-md);
}
.close {
  position: absolute;
  top: var(--ds-space-md);
  right: var(--ds-space-md);
  background: none;
  border: none;
  font-size: var(--ds-font-size-lg);
  cursor: pointer;
  color: var(--ds-color-text-secondary);
}
```

- [ ] **Step 5: Write `src/components/Dialog/Dialog.tsx`**

```tsx
import * as RadixDialog from '@radix-ui/react-dialog';
import styles from './Dialog.module.css';

export interface DialogProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({
  trigger,
  title,
  description,
  children,
  open,
  defaultOpen,
  onOpenChange,
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={styles.overlay} />
        <RadixDialog.Content className={styles.content}>
          <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
          {description ? (
            <RadixDialog.Description className={styles.description}>
              {description}
            </RadixDialog.Description>
          ) : null}
          <div className={styles.body}>{children}</div>
          <RadixDialog.Close asChild>
            <button type="button" className={styles.close} aria-label="Close">
              &times;
            </button>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
```

- [ ] **Step 6: Run and confirm it passes**

Run: `npx vitest run src/components/Dialog/Dialog.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 7: Write `src/components/Dialog/Dialog.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';
import { Button } from '../Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {
    trigger: <Button>Open dialog</Button>,
    title: 'Delete item',
    description: 'This action cannot be undone.',
    children: <p>Are you sure you want to delete this item?</p>,
  },
};
```

- [ ] **Step 8: Write `src/components/Dialog/index.ts`**

```ts
export { Dialog } from './Dialog';
export type { DialogProps } from './Dialog';
```

- [ ] **Step 9: Commit**

```bash
git add src/components/Dialog package.json package-lock.json
git commit -m "feat: add Dialog component (Radix)"
```

---

### Task 19: Barrel exports + build verification

**Files:**

- Create: `src/components/index.ts`
- Modify: `src/index.ts`

**Interfaces:**

- Consumes: every component's own `index.ts` from Tasks 7–18.
- Produces: the package's full public API — `cx`, all token objects, and all 12 components — importable from `design-system` (i.e. `src/index.ts`).

- [ ] **Step 1: Write `src/components/index.ts`**

```ts
export { Stack } from './Stack';
export type { StackProps, StackGap, StackAlign, StackJustify } from './Stack';

export { Grid } from './Grid';
export type { GridProps, GridGap } from './Grid';

export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Badge } from './Badge';
export type { BadgeProps, BadgeTone } from './Badge';

export { Alert } from './Alert';
export type { AlertProps, AlertTone } from './Alert';

export { Card } from './Card';
export type { CardProps } from './Card';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { Radio } from './Radio';
export type { RadioProps, RadioOption } from './Radio';

export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';

export { Tabs } from './Tabs';
export type { TabsProps, TabItem } from './Tabs';

export { Dialog } from './Dialog';
export type { DialogProps } from './Dialog';
```

- [ ] **Step 2: Modify `src/index.ts`**

```ts
export { cx } from './utils/cx';
export type { ClassValue } from './utils/cx';
export * from './tokens';
export * from './components';
```

- [ ] **Step 3: Run the full verification suite**

Run: `npm run typecheck && npm test && npm run build && npm run lint`
Expected: all four exit 0.

- [ ] **Step 4: Verify every component is present in the built types**

Run: `grep -c "declare" dist/index.d.ts`
Expected: a positive count. Then spot check:

```bash
grep -q "Dialog" dist/index.d.ts && echo OK
grep -q "Checkbox" dist/index.d.ts && echo OK
```

Expected: both print `OK`.

- [ ] **Step 5: Commit**

```bash
git add src/components/index.ts src/index.ts
git commit -m "feat: export all components and tokens from the package entry"
```

---

### Task 20: Storybook static build verification

**Files:**

- Delete: whatever example story files `storybook@latest init` scaffolded in Task 5 (commonly `src/stories/`)
- Modify: `.storybook/main.ts` if its `stories` glob still references the deleted location

**Interfaces:**

- Consumes: all component stories from Tasks 7–18.
- Produces: a clean `npm run storybook:build` containing only this library's real components.

- [ ] **Step 1: Confirm the current static build succeeds with everything in place**

Run: `npm run storybook:build`
Expected: exits 0.

- [ ] **Step 2: Locate and remove the initializer's example stories**

```bash
ls src/stories 2>/dev/null && rm -rf src/stories
```

(If Task 5's initializer put its examples somewhere else, remove that location instead — check `.storybook/main.ts`'s `stories` glob if unsure where it pointed.)

- [ ] **Step 3: Confirm `.storybook/main.ts` no longer globs a now-deleted path**

Its `stories` array should read exactly:

```ts
stories: ['../src/**/*.stories.@(ts|tsx)', '../src/**/*.mdx'],
```

Edit it to this if it still references the deleted example directory.

- [ ] **Step 4: Re-run the static build without the example stories**

Run: `npm run storybook:build`
Expected: exits 0.

- [ ] **Step 5: Spot-check that real component stories are present**

```bash
grep -o '"title":"[^"]*Button[^"]*"' storybook-static/index.json
grep -o '"title":"[^"]*Dialog[^"]*"' storybook-static/index.json
```

Expected: both produce a match. (If `storybook-static/index.json` doesn't exist under that name in the installed Storybook version, `grep -rl 'Components/Button' storybook-static/` as a fallback check.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove Storybook example scaffold, keep only real component stories"
```

---

### Task 21: Repo documentation

**Files:**

- Create: `README.md`
- Create: `ARCHITECTURE.md`
- Create: `AGENTS.md`
- Create: `CLAUDE.md`

**Interfaces:**

- Consumes: nothing (documentation only).
- Produces: the four standard repo docs, matching the convention already used by `yr2l-emails`.

- [ ] **Step 1: Write `README.md`**

```markdown
# design-system

A standalone React component library — the foundation for future web UI work and the source
repo synced to claude.ai/design via the `design-sync` skill.

## Install

This package is private and not published to a registry. It's consumed locally (workspace/path
dependency) or via the Storybook build that `design-sync` uploads.

## Develop

\`\`\`bash
npm install
npm run storybook # component playground, http://localhost:6006
npm test # Vitest
npm run lint # ESLint
npm run typecheck # tsc --noEmit
npm run build # tsup -> dist/
\`\`\`

## What's here

- `src/tokens/` — primitive + semantic design tokens (also emitted as CSS custom properties in
  `src/styles/tokens.css`)
- `src/styles/global.css` — resets + base styles, imports `tokens.css`
- `src/components/` — one folder per component (`Component.tsx`, `.module.css`, `.stories.tsx`,
  `.test.tsx`, `index.ts`)

See `ARCHITECTURE.md` for the conventions behind these choices and how to add a new component.
```

- [ ] **Step 2: Write `ARCHITECTURE.md`**

```markdown
# Architecture

## Styling: CSS Modules + CSS custom-property tokens

No Tailwind, no CSS-in-JS runtime. Two layers of tokens live in `src/styles/tokens.css`:

- **Primitive** — raw palette/spacing/type values (`--ds-gray-500`, `--ds-blue-600`, ...)
- **Semantic** — the names components actually use (`--ds-color-text-primary`,
  `--ds-color-action-primary`, `--ds-space-md`, ...), each pointing at a primitive.

The same values exist as plain TS objects in `src/tokens/primitives.ts` and `src/tokens/semantic.ts`
for any code that needs a typed token value. **These two representations are kept in sync by hand**
— there's no codegen linking them yet. `src/tokens/tokens.test.ts` guards internal consistency on
the TS side (every semantic value must be a defined primitive); nothing currently checks the CSS
file against the TS file, so a manual token change means editing both.

Re-theming (dark mode, a brand refresh) means remapping the semantic layer only — component code
and component CSS never reference a primitive directly.

## Component behavior: Radix UI primitives

Anything with real interaction complexity — `Dialog`, `Tabs`, `Select`, `Checkbox`, `Radio` — wraps
an unstyled `@radix-ui/react-*` primitive rather than being hand-rolled. Radix owns focus-trapping,
keyboard navigation, ARIA roles, and portals. This library's code owns 100% of the visual layer:
the wrapping markup, the CSS Module, and the variant props.

## Component folder shape

Every component lives at `src/components/<Name>/` with exactly these files:

\`\`\`
<Name>.tsx component implementation
<Name>.module.css styles, referencing var(--ds-*) tokens only
<Name>.stories.tsx Storybook stories (at least a default + key variants)
<Name>.test.tsx Vitest + React Testing Library tests
index.ts re-exports the component and its prop types
\`\`\`

`src/components/index.ts` re-exports every component's `index.ts`; `src/index.ts` is the package
entry (tokens + components + the `cx` utility).

## Adding a new component

1. Create the folder and the five files above, following an existing component as a template
   (`Badge` for something simple, `Select` for something Radix-based).
2. Write the component's test first (TDD), then the implementation, then the story.
3. Add the two export lines to `src/components/index.ts`.
4. Run `npm test && npm run typecheck && npm run build && npm run lint` before committing.

## Non-goals (current)

- No dark theme yet — the semantic token layer is what makes adding one cheap later.
- No visual-regression tooling (Chromatic etc.) — Storybook plus `design-sync`'s own verification
  cover today's need.
- No `asChild`/polymorphic-component pattern — components render a fixed native element for now.
```

- [ ] **Step 3: Write `AGENTS.md`**

```markdown
# Agent instructions for design-system

- This is a standalone component library with no wired-in consumer app yet. Don't assume it's
  used by any specific other repo unless told so.
- Follow `ARCHITECTURE.md`'s component folder shape exactly when adding or modifying components:
  `Component.tsx`, `.module.css`, `.stories.tsx`, `.test.tsx`, `index.ts`.
- Styling is CSS Modules referencing `var(--ds-*)` tokens only. Never hardcode a color, spacing, or
  font value directly in a component's CSS — add or reuse a token in
  `src/tokens/semantic.ts` + `src/styles/tokens.css` instead.
- Interactive components (anything with focus management, keyboard nav, or portals) should wrap a
  Radix UI primitive rather than being hand-rolled.
- Before committing: `npm test && npm run typecheck && npm run lint && npm run build` must all
  pass clean.
- Solo repo: commit directly to `main`, no feature branches unless explicitly asked (matches the
  convention used across Robin's other repos, e.g. `yr2l-emails`).
- This repo is the source for a `claude.ai/design` sync via the `design-sync` skill. Changes here
  eventually need re-syncing — mention that when making a component-visible change, but don't run
  the sync yourself unless asked (it's a long-running, user-approved process).
```

- [ ] **Step 4: Write `CLAUDE.md`**

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## What this is

A standalone React component library (design tokens + a small core component set), built as an
extensible base for future web UI work. See `README.md` for setup and `ARCHITECTURE.md` for the
conventions (styling approach, Radix usage, component folder shape, how to add a component).

## Stack

React 18 + TypeScript (strict), CSS Modules + CSS custom-property tokens, Radix UI primitives for
interactive components, Storybook (Vite builder) for docs/preview, Vitest + React Testing Library
for tests, tsup for the `dist/` build.

\`\`\`bash
npm install
npm run storybook # component playground
npm test # Vitest
npm run lint # ESLint
npm run typecheck # tsc --noEmit
npm run build # tsup -> dist/
npm run storybook:build # static Storybook build
\`\`\`

## Git

Solo repo — commit directly to `main`, no feature branches unless explicitly asked.

## Design spec

The original design decisions (why Radix, why CSS Modules over Tailwind, v1 component scope) are
recorded in `docs/superpowers/specs/2026-07-01-design-system-foundation-design.md`.
```

- [ ] **Step 5: Commit**

```bash
git add README.md ARCHITECTURE.md AGENTS.md CLAUDE.md
git commit -m "docs: add README, ARCHITECTURE, AGENTS, CLAUDE.md"
```

---

### Task 22: Hub integration + final verification

**Files:**

- Modify: `/Users/macbookair/Projects/CLAUDE.md`
- Modify: `/Users/macbookair/Projects/command-center/projects.md`
- Modify: `/Users/macbookair/Projects/command-center/sources.md`

**Interfaces:**

- Consumes: nothing from the design-system package itself (this task only registers the repo in the organiser hub).
- Produces: the new repo discoverable from `/start`, `hub-orient`, and `Projects/CLAUDE.md`'s area map.

- [ ] **Step 1: Run final full verification in `design-system/`**

Run: `npm run typecheck && npm test && npm run lint && npm run build && npm run storybook:build`
Expected: all five exit 0. If anything fails, fix it before continuing — do not register the repo in the hub with a broken build.

- [ ] **Step 2: Add a row to `/Users/macbookair/Projects/CLAUDE.md`'s area map table**

Use the Edit tool with this exact old/new string pair:

Old:

```
| `yr2l-rag-poc/` | Planning stub (`PLAN.md`) for retrieval over approved replies; feeds yr2l-emails. | not a repo |
| `consultation/` | **SENSITIVE** personal legal case (detached-HEAD git checkout). | see boundaries below |
```

New:

```
| `yr2l-rag-poc/` | Planning stub (`PLAN.md`) for retrieval over approved replies; feeds yr2l-emails. | not a repo |
| `design-system/` | Standalone React component library — foundation for future web UI, no consumer wired in yet; source repo for a claude.ai/design sync via `design-sync`. | repo → not yet pushed |
| `consultation/` | **SENSITIVE** personal legal case (detached-HEAD git checkout). | see boundaries below |
```

- [ ] **Step 3: Add a row to `command-center/projects.md`'s Active Projects table**

Use the Edit tool with this exact old/new string pair:

Old:

```
| studio-macbookair (Studio layout) | `/Users/macbookair/Projects/studio-macbookair` | Active utility | studio, music, ableton, svg-generator | 2026-06-07 | Music production studio setup utility; compiles Samson S-Patch Plus patchbay wiring plans, documentation, and SVGs. | Targeted |

## Dormant Projects
```

New:

```
| studio-macbookair (Studio layout) | `/Users/macbookair/Projects/studio-macbookair` | Active utility | studio, music, ableton, svg-generator | 2026-06-07 | Music production studio setup utility; compiles Samson S-Patch Plus patchbay wiring plans, documentation, and SVGs. | Targeted |
| Design System (component library) | `/Users/macbookair/Projects/design-system` | Active | design-system, react, storybook, claude-design, ui-foundation | 2026-07-01 | Standalone React component library (design tokens + core primitives) built as an extensible foundation for future web UI; source repo for a claude.ai/design sync via `design-sync`. No consumer app wired in yet. | Targeted |

## Dormant Projects
```

- [ ] **Step 4: Add rows to `command-center/sources.md`'s Registered Roots table**

Use the Edit tool with this exact old/new string pair:

Old:

```
| studio-macbookair | `/Users/macbookair/Projects/studio-macbookair` | Utility | Active | Targeted | Targeted only | Compiles Samson S-Patch Plus patchbay wiring plans, documentation, and SVGs. |
| Claude Code workflow assets | `/Users/macbookair/Projects/reference/claude-code` | Tooling reference | Reference | Targeted | Targeted only | Prior commands, hooks, agents, and settings to adapt cautiously into tool-agnostic patterns. |
```

New:

```
| studio-macbookair | `/Users/macbookair/Projects/studio-macbookair` | Utility | Active | Targeted | Targeted only | Compiles Samson S-Patch Plus patchbay wiring plans, documentation, and SVGs. |
| design-system | `/Users/macbookair/Projects/design-system` | Component library | Active | Targeted | Targeted only | Standalone React component library (tokens + core components); source repo for a claude.ai/design sync via `design-sync`. No consumer app wired in yet. |
| Claude Code workflow assets | `/Users/macbookair/Projects/reference/claude-code` | Tooling reference | Reference | Targeted | Targeted only | Prior commands, hooks, agents, and settings to adapt cautiously into tool-agnostic patterns. |
```

- [ ] **Step 5: Add a row to `command-center/sources.md`'s Index Snapshot table**

Use the Edit tool with this exact old/new string pair:

Old:

```
| `/Users/macbookair/Projects/studio-macbookair` | studio-macbookair | Active | studio, music, ableton, svg-generator | 2026-06-07 | Music production studio setup utility; compiles patchbay wiring plans, docs, and SVGs. | Targeted |
| `/Users/macbookair/Projects/reference/claude-code` | Claude Code workflow assets | Reference | commands, hooks, agents, workflow | 2026-06-04 | Prior Claude Code workflow assets to mine for portable conventions. | Targeted |
```

New:

```
| `/Users/macbookair/Projects/studio-macbookair` | studio-macbookair | Active | studio, music, ableton, svg-generator | 2026-06-07 | Music production studio setup utility; compiles patchbay wiring plans, docs, and SVGs. | Targeted |
| `/Users/macbookair/Projects/design-system` | design-system | Active | design-system, react, storybook, claude-design, ui-foundation | 2026-07-01 | Standalone React component library (tokens + core primitives); foundation for future web UI, no consumer wired in yet. | Targeted |
| `/Users/macbookair/Projects/reference/claude-code` | Claude Code workflow assets | Reference | commands, hooks, agents, workflow | 2026-06-04 | Prior Claude Code workflow assets to mine for portable conventions. | Targeted |
```

- [ ] **Step 6: Commit the hub changes inside the `command-center` repo**

```bash
cd /Users/macbookair/Projects/command-center
git add projects.md sources.md
git commit -m "chore: register design-system repo in projects and sources"
```

(`/Users/macbookair/Projects/CLAUDE.md` is not inside any git repo — no commit needed for that file, just the saved edit.)

- [ ] **Step 7: Final confirmation**

Run, from `design-system/`:

```bash
git log --oneline
git status
```

Expected: a clean working tree, and a commit history showing every task's commits in order.
