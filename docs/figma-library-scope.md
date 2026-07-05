# Figma Library Scope

Date: 2026-07-04
Source repo: /Users/macbookair/Projects/design-system
Purpose: Producer Release OS Phase 1 design library generated from code tokens.

## Generated Library (2026-07-05)

**File:** https://www.figma.com/design/J4Pl2gT1lRaNOVLHRWc4xl (Robin's drafts, "Producer Release OS — Design Library")

Built via Figma MCP from this scope doc: 5 collections, 96 variables (56 primitives hidden,
40 semantics aliased + role-scoped + `var(--ds-*)` Web code syntax), 7 Inter text styles, all
15 components with variant sets matching the code union types (Button 12, Badge 4, Alert 4,
Checkbox/Radio 2 each, Table 2, rest single). Binding audit: 0 unbound solid paints in components.

Starter-plan constraints (recorded, both reversible on upgrade): 3-page limit → sections-within-pages
(`Cover & Foundations` / `Components — Atoms` / `Components — Composites`); team-library publishing and
Code Connect unavailable — the file is the canonical visual/token reference, not a subscribable library.
Inter proxies the `-apple-system` stack in text styles; the `family/sans` variable carries the real CSS value.

## Token Source Of Truth

- CSS variables: src/styles/tokens.css
- Primitive TS mirrors: src/tokens/primitives.ts
- Semantic TS mirrors: src/tokens/semantic.ts

## Collections

Create these Figma variable collections:

| Collection | Mode | Source |
| --- | --- | --- |
| Primitives | Value | colorPrimitives, spacePrimitives, radiusPrimitives, fontPrimitives |
| Color | Light | semanticColor aliases to Primitives |
| Spacing | Value | semanticSpace aliases to Primitives |
| Radius | Value | semanticRadius aliases to Primitives |
| Typography | Value | semanticFont aliases to Primitives |

## Primitive Variables

Color primitives:

- white: #ffffff
- black: #000000
- gray/50: #fafafa
- gray/100: #f4f4f5
- gray/200: #e4e4e7
- gray/300: #d4d4d8
- gray/400: #a1a1aa
- gray/500: #71717a
- gray/600: #52525b
- gray/700: #3f3f46
- gray/800: #27272a
- gray/900: #18181b
- blue/50: #eff6ff
- blue/300: #93c5fd
- blue/500: #3b82f6
- blue/600: #2563eb
- blue/700: #1d4ed8
- red/50: #fef2f2
- red/300: #fca5a5
- red/500: #ef4444
- red/700: #b91c1c
- green/50: #f0fdf4
- green/300: #86efac
- green/500: #22c55e
- green/700: #15803d
- amber/50: #fffbeb
- amber/300: #fcd34d
- amber/500: #f59e0b
- amber/700: #b45309

Spacing primitives:

- space/0: 0
- space/1: 4
- space/2: 8
- space/3: 12
- space/4: 16
- space/6: 24
- space/8: 32
- space/12: 48
- space/16: 64

Radius primitives:

- radius/none: 0
- radius/sm: 4
- radius/md: 8
- radius/lg: 12
- radius/full: 9999

Typography primitives:

- family/sans: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif
- family/mono: SFMono-Regular, ui-monospace, Menlo, monospace
- size/12: 12
- size/14: 14
- size/16: 16
- size/18: 18
- size/24: 24
- size/32: 32
- weight/400: 400
- weight/500: 500
- weight/700: 700
- line-height/120: 1.2
- line-height/150: 1.5

## Semantic Variables And Web Syntax

Set Web code syntax to the exact CSS variable name with `var(...)`.

| Figma variable | Alias | Web syntax |
| --- | --- | --- |
| color/bg/page | Primitives/white | var(--ds-color-bg-page) |
| color/bg/surface | Primitives/gray/50 | var(--ds-color-bg-surface) |
| color/bg/surface-hover | Primitives/gray/100 | var(--ds-color-bg-surface-hover) |
| color/border/default | Primitives/gray/300 | var(--ds-color-border-default) |
| color/border/strong | Primitives/gray/500 | var(--ds-color-border-strong) |
| color/text/primary | Primitives/gray/900 | var(--ds-color-text-primary) |
| color/text/secondary | Primitives/gray/600 | var(--ds-color-text-secondary) |
| color/text/inverse | Primitives/white | var(--ds-color-text-inverse) |
| color/action/primary | Primitives/blue/600 | var(--ds-color-action-primary) |
| color/action/primary-hover | Primitives/blue/700 | var(--ds-color-action-primary-hover) |
| color/action/primary-text | Primitives/white | var(--ds-color-action-primary-text) |
| color/danger | Primitives/red/500 | var(--ds-color-danger) |
| color/danger-bg | Primitives/red/50 | var(--ds-color-danger-bg) |
| color/success | Primitives/green/500 | var(--ds-color-success) |
| color/success-bg | Primitives/green/50 | var(--ds-color-success-bg) |
| color/warning | Primitives/amber/500 | var(--ds-color-warning) |
| color/warning-bg | Primitives/amber/50 | var(--ds-color-warning-bg) |
| spacing/xs | Primitives/space/1 | var(--ds-space-xs) |
| spacing/sm | Primitives/space/2 | var(--ds-space-sm) |
| spacing/md | Primitives/space/4 | var(--ds-space-md) |
| spacing/lg | Primitives/space/6 | var(--ds-space-lg) |
| spacing/xl | Primitives/space/8 | var(--ds-space-xl) |
| spacing/2xl | Primitives/space/12 | var(--ds-space-2xl) |
| radius/sm | Primitives/radius/sm | var(--ds-radius-sm) |
| radius/md | Primitives/radius/md | var(--ds-radius-md) |
| radius/lg | Primitives/radius/lg | var(--ds-radius-lg) |
| radius/full | Primitives/radius/full | var(--ds-radius-full) |
| typography/font-family/sans | Primitives/family/sans | var(--ds-font-family-sans) |
| typography/font-family/mono | Primitives/family/mono | var(--ds-font-family-mono) |
| typography/font-size/xs | Primitives/size/12 | var(--ds-font-size-xs) |
| typography/font-size/sm | Primitives/size/14 | var(--ds-font-size-sm) |
| typography/font-size/md | Primitives/size/16 | var(--ds-font-size-md) |
| typography/font-size/lg | Primitives/size/18 | var(--ds-font-size-lg) |
| typography/font-size/xl | Primitives/size/24 | var(--ds-font-size-xl) |
| typography/font-size/2xl | Primitives/size/32 | var(--ds-font-size-2xl) |
| typography/font-weight/regular | Primitives/weight/400 | var(--ds-font-weight-regular) |
| typography/font-weight/medium | Primitives/weight/500 | var(--ds-font-weight-medium) |
| typography/font-weight/bold | Primitives/weight/700 | var(--ds-font-weight-bold) |
| typography/line-height/tight | Primitives/line-height/120 | var(--ds-line-height-tight) |
| typography/line-height/normal | Primitives/line-height/150 | var(--ds-line-height-normal) |

## Component Scope

The Figma library should represent these exported code components after Phase 1:

- Alert
- Badge
- Button
- Calendar
- Card
- Checkbox
- Dialog
- Grid
- Input
- Progress
- Radio
- Select
- Stack
- Table
- Tabs

Build Figma foundations first. Component pages can be generated in dependency order after variables pass validation: Button, Badge, Input, Checkbox, Radio, Select, Card, Stack, Grid, Alert, Dialog, Tabs, Table, Calendar, Progress.
