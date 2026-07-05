# Producer Release OS Component Inventory

Date: 2026-07-04
Source spec: /Users/macbookair/Projects/command-center/docs/superpowers/specs/2026-07-04-producer-release-os-design.md
Phase: 1 - harden the rails, app-driven

## V1 Screens

| Screen | User job | Existing design-system components consumed | New Phase 1 component consumed |
| --- | --- | --- | --- |
| Release calendar | Plan release milestones across a month and see what is due next. | Card, Badge, Stack, Button, Input, Tabs | Calendar, Progress |
| Track pipeline | Track demos, mixes, masters, artwork, distribution, and promotion state. | Card, Badge, Button, Select, Input, Tabs | Table, Progress |
| Studio reset checklist | Reset the studio after a session and keep repeatable prep rituals visible. | Card, Checkbox, Stack, Badge, Button, Alert | None |
| Gig prep | Prepare export, USB, backups, travel, and set notes before a show. | Card, Checkbox, Stack, Badge, Button, Alert | None |

## Phase 1 Additions

Add exactly these components:

- `Table`: consumed by Track pipeline for dense track/status rows.
- `Calendar`: consumed by Release calendar for a month grid with milestone labels.
- `Progress`: consumed by Release calendar and Track pipeline for completion state.

## Phase 1 Deferrals

- `Toast`: defer because existing `Alert` covers inline export and save feedback in v1.
- `List`: defer because `Stack`, `Card`, `Badge`, and `Checkbox` cover the two checklist screens.
- `DateInput`: defer because existing `Input` accepts `type="date"` for date editing.
- Charts, rich calendar drag/drop, command palette, and PDF/JSON export controls are app-layer concerns for Phase 2.

## Guardrail

If a future task proposes another Phase 1 component, stop and update this inventory first with the named screen and user job that consumes it.
