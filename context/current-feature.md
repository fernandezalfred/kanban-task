# Current Feature: Dashboard Phase 3 — State, Modals, Interactions & Polish

## Status

In Progress

## Goals

- Zustand store (`src/store/kanban-store.ts`) implementing `createBoard`, `updateBoard`, `deleteBoard`, `selectBoard`, `createColumn`, `updateColumn`, `deleteColumn`, `createTask`, `updateTask`, `deleteTask`, `moveTask`, `toggleSubtask` (`context/project-overview.md` §8), persisted to `localStorage`, seeded from `src/lib/mock-data.ts`.
- Replace phase-2's local `useState` board/sidebar selection with the store where appropriate.
- Working "Add New Task" modal (matches `dashboard-ui.jpg`): title, description, dynamic subtask rows, status dropdown, Zod validation, wired to `createTask`.
- Working Task Details modal (matches `dashboard-ui3.jpg`): title, description, subtask checklist (toggling persists via `toggleSubtask`), status dropdown, edit/delete via kebab menu.
- Working Edit Task, Create Board, Edit Board, and Delete Confirmation (board/column/task) modals — destructive actions always confirm first and use the danger color only for the destructive button.
- Column create/rename/delete.
- Drag-and-drop task movement between columns (`@dnd-kit/core` + `@dnd-kit/sortable`) calling `moveTask`, plus a keyboard-accessible alternative for moving a task without a mouse.
- Final polish: modal/drag animations, loading/error states, full keyboard navigation and focus management, color-contrast check in both themes, no console errors.

## Notes

- Source spec: `context/features/dashboard-phase-3-spec.md` (see its "Prompt for Claude Code" section for full detail).
- Builds on Phase 1 (Foundation) and Phase 2 (Static Layout) — see History below.
- This is the last of the 3 dashboard phases — after this, walk through `context/project-overview.md` §11 Definition of Done before considering the feature complete.
- After implementation: run `npx tsc --noEmit`, `npm run lint`, `npm run build`, fix all errors, and verify in a browser (drag-and-drop and modals are genuinely interactive — type-checking alone won't catch UX/behavior issues).

## History

- **Dashboard Phase 1 — Foundation** (2026-09-13): shadcn/ui initialized and themed to the Kanban 5-color palette (light/dark), `Plus Jakarta Sans` font, dark-mode-by-default, `Subtask`/`Task`/`Column`/`Board` types, mock data (3 boards), board moved to `/dashboard`. See `context/features/dashboard-phase-1-spec.md`. Next: phase 2 (static layout).
- **Dashboard Phase 2 — Static Layout** (2026-09-13): full static layout at `/dashboard` — collapsible desktop sidebar, mobile drawer board switcher, header (inert Add Task button, unwired board options menu), board/column/task-card views wired to mock data via local `useState`, empty-board state. See `context/features/dashboard-phase-2-spec.md`. Verified via `tsc`/lint/build; not yet checked visually in a browser (Claude in Chrome declined this session). Next: phase 3 (state, working modals, drag-and-drop).
