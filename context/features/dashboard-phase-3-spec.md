# Dashboard UI Phase 3 Spec

## Overview

Phase 3 of 3 for the dashboard UI layout — the final pass. Match the referenced screenshot for visual structure.

## Requirements for phase 3

Everything remaining from `context/project-overview.md` §10 (phases 3-6): state management, working modals/forms, drag-and-drop and other interactions, and final polish.

- Zustand store with the actions defined in `context/project-overview.md` §8, persisted to `localStorage`.
- Working "Add New Task" modal (matches `dashboard-ui.jpg`): title, description, dynamic subtask rows (add/remove), status dropdown, Zod validation, `Create Task` action wired to the store.
- Working Task Details modal (matches `dashboard-ui3.jpg`): title, description, subtask checklist (toggling persists via the store), status dropdown, edit/delete actions, kebab menu.
- Working Edit Task, Create Board, Edit Board, and Delete Confirmation (board/column/task) modals per `context/project-overview.md` §9.
- Drag-and-drop task movement between columns (dnd-kit), plus a keyboard-accessible alternative (e.g. status dropdown or move-to-column menu) per `context/project-overview.md` §9.
- Column create/rename/delete.
- Final polish: animations, loading/error states, accessible keyboard navigation throughout, color-contrast check in both themes, no console errors — per `context/project-overview.md` §11 Definition of Done.

## References

- @context/screenshots/dashboard-ui3.jpg
- @context/screenshots/dashboard-ui.jpg
- @context/project-overview.md
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-2-spec.md

## Prompt for Claude Code

> Wire up full interactivity for the Kanban board built in phases 1-2, at `/dashboard`.
>
> **State**
>
> - Zustand store (`src/store/kanban-store.ts`) implementing the actions in `context/project-overview.md` §8 (`createBoard`, `updateBoard`, `deleteBoard`, `selectBoard`, `createColumn`, `updateColumn`, `deleteColumn`, `createTask`, `updateTask`, `deleteTask`, `moveTask`, `toggleSubtask`).
> - Persist board state to `localStorage`; seed from `src/lib/mock-data.ts` on first load.
> - Replace the phase-2 local `useState` board/sidebar selection with the store where it makes sense.
>
> **Modals and forms** (Zod validation on every form; see `context/coding-standards.md`)
>
> - Add New Task (matches `dashboard-ui.jpg`): title, description, dynamic subtasks (add/remove rows), status dropdown, `Create Task`.
> - Task Details (matches `dashboard-ui3.jpg`): title, description, subtask checklist (checking a box calls `toggleSubtask` and persists), status dropdown, edit/delete actions via the kebab menu.
> - Edit Task, Create Board, Edit Board, Delete Confirmation (board/column/task) — destructive actions always confirm first, explain what will be deleted, and use the danger color only for the destructive button.
>
> **Interactions**
>
> - Drag-and-drop task movement between columns (`@dnd-kit/core` + `@dnd-kit/sortable`), calling `moveTask`.
> - A keyboard-accessible alternative for moving tasks (a task can be moved without a mouse — e.g. via the status dropdown in its details modal).
> - Column create/rename/delete.
>
> **Polish**
>
> - Animations for modal open/close and drag interactions.
> - Loading/error states where relevant; empty states already built in phase 2.
> - Full keyboard navigation and focus management in all modals.
> - Verify color contrast in both themes.
>
> After this phase: run `npx tsc --noEmit`, `npm run lint`, `npm run build`, fix all errors, explain what changed, then walk through `context/project-overview.md` §11 Definition of Done before considering the feature complete.
