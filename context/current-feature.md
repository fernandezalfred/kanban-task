# Current Feature

## Status

<!-- Not Started | In Progress | Complete -->

## Goals

<!-- Bullet points of what success looks like -->

## Notes

<!-- Additional context, constraints, or details from spec -->

## History

- **Dashboard Phase 1 — Foundation** (2026-09-13): shadcn/ui initialized and themed to the Kanban 5-color palette (light/dark), `Plus Jakarta Sans` font, dark-mode-by-default, `Subtask`/`Task`/`Column`/`Board` types, mock data (3 boards), board moved to `/dashboard`. See `context/features/dashboard-phase-1-spec.md`. Next: phase 2 (static layout).
- **Dashboard Phase 2 — Static Layout** (2026-09-13): full static layout at `/dashboard` — collapsible desktop sidebar, mobile drawer board switcher, header (inert Add Task button, unwired board options menu), board/column/task-card views wired to mock data via local `useState`, empty-board state. See `context/features/dashboard-phase-2-spec.md`. Verified via `tsc`/lint/build; not yet checked visually in a browser (Claude in Chrome declined this session). Next: phase 3 (state, working modals, drag-and-drop).
- **Dashboard Phase 3 — State, Modals, Interactions & Polish** (2026-09-13): Zustand store (all `project-overview.md` §8 actions) with localStorage persistence; working Add/Edit Task, Task Details, Create/Edit Board, and Delete Confirmation modals (Zod-validated); column create/rename/delete via Edit Board; drag-and-drop between columns (dnd-kit) with the Task Details status dropdown as the keyboard alternative; hydration-aware loading state (fixed an SSR crash from zustand persist's default storage touching `window` on the server) and a zero-boards empty state. See `context/features/dashboard-phase-3-spec.md`. This closes out all 3 dashboard phases. Verified via `tsc`/lint/build only — not yet exercised in a real browser (drag-and-drop, forms, modal focus/keyboard behavior are unconfirmed interactively).
