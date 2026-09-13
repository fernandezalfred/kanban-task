# Current Feature: Dashboard Phase 1 — Foundation

## Status

In Progress

## Goals

- Initialize shadcn/ui (Tailwind v4 CSS-based config, no `tailwind.config.*`) and install the core primitives: `button`, `dialog`, `sheet`, `switch`, `dropdown-menu`, `select`, `checkbox`, `input`, `textarea`, `label`, `separator`, `scroll-area`.
- Theme the shadcn CSS variables to the project's 5-color palette (`context/project-overview.md` §6) for both light and dark themes.
- Add the `Plus Jakarta Sans` font and wire dark-mode support with dark as the default theme.
- Define the TypeScript data model (`Subtask`, `Task`, `Column`, `Board`) in `src/types/kanban.ts`, exactly per `context/project-overview.md` §4.
- Add mock data (`src/lib/mock-data.ts`) — "Platform Launch", "Marketing Plan", "Roadmap" boards, with task/subtask counts matching the reference screenshots.
- Move the board to the `/dashboard` route; `src/app/page.tsx` redirects there.

## Notes

- Source spec: `context/features/dashboard-phase-1-spec.md` (see its "Prompt for Claude Code" section for full detail).
- Out of scope this phase: sidebar/header/columns layout (phase 2 — `dashboard-phase-2-spec.md`); Zustand store, localStorage persistence, drag-and-drop, working modals (phase 3 — `dashboard-phase-3-spec.md`).
- After implementation: run `npx tsc --noEmit`, `npm run lint`, `npm run build`, fix all errors, explain what changed, and wait for approval before starting phase 2.

## History
