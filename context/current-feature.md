# Current Feature: Dashboard Phase 2 — Static Layout

## Status

In Progress

## Goals

- Sidebar (desktop): logo, "ALL BOARDS (n)" list with active-board highlight, "+ Create New Board" row, light/dark theme toggle, "Hide Sidebar" control that collapses it with a floating "show sidebar" icon when hidden.
- Mobile: sidebar hidden by default; header shows a compact board-name selector that opens a drawer (shadcn `Sheet`) listing all boards + the theme toggle — "always a drawer on mobile" per the spec.
- Header: board title, "+ Add New Task" button (renders, inert this phase), kebab `DropdownMenu` with "Edit Board"/"Delete Board" items present but unwired.
- Board view: columns rendered horizontally (scrollable on mobile), colored dot + `NAME (count)` header per column, stacked task cards, "+ New Column" ghost column.
- Task cards: title + "`x of y subtasks`" count, non-interactive this phase.
- Empty-board state for a board with zero columns.
- Board/sidebar selection via local `useState` (no Zustand yet).

## Notes

- Source spec: `context/features/dashboard-phase-2-spec.md` (see its "Prompt for Claude Code" section for full detail).
- Builds on Phase 1 Foundation (shadcn/ui, theme, types, mock data, `/dashboard` route) — see History below.
- Match `context/screenshots/dashboard-ui2.jpg` for desktop layout.
- Out of scope this phase: Zustand store, localStorage persistence, drag-and-drop, working Add/Edit/Delete modals (phase 3 — `dashboard-phase-3-spec.md`).
- After implementation: run `npx tsc --noEmit`, `npm run lint`, `npm run build`, fix all errors, explain what changed, and wait for approval before starting phase 3.

## History

- **Dashboard Phase 1 — Foundation** (2026-09-13): shadcn/ui initialized and themed to the Kanban 5-color palette (light/dark), `Plus Jakarta Sans` font, dark-mode-by-default, `Subtask`/`Task`/`Column`/`Board` types, mock data (3 boards), board moved to `/dashboard`. See `context/features/dashboard-phase-1-spec.md`. Next: phase 2 (static layout).
