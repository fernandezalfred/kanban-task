# Dashboard UI Phase 2 Spec

## Overview

Phase 2 of 3 for the dashboard UI layout. Match the referenced screenshot for visual structure, and import the referenced mock data directly for now until a database is implemented.

## Requirements for phase 2

- Collapsible sidebar
- Drawer icon to open/close sidebar
- Always a drawer on mobile view

## References

- @context/screenshots/dashboard-ui2.jpg
- @context/project-overview.md
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-3-spec.md

## Prompt for Claude Code

> Build the full static layout for the Kanban board at `/dashboard`, on top of the phase 1 foundation (shadcn/ui, theme, types, mock data). This is **presentational only** — no Zustand store, no persistence, no drag-and-drop, no working Add/Edit/Delete modals yet (phase 3). Board/sidebar selection can use local component state (`useState`), not global state.
>
> Match `context/screenshots/dashboard-ui2.jpg` for the desktop layout.
>
> **Sidebar** (desktop, `context/project-overview.md` §7)
>
> - Logo, "ALL BOARDS (n)" list with active-board highlight, "+ Create New Board" row.
> - Light/dark theme toggle (sun/moon icons + switch).
> - "Hide Sidebar" control that collapses it; when hidden, a floating "show sidebar" icon appears (an eye icon docked to the left edge).
>
> **Mobile** (always a drawer, per this phase's requirements above)
>
> - Sidebar is hidden by default; the header shows a compact board-name selector instead.
> - Tapping it opens a drawer (shadcn `Sheet`) listing all boards + the theme toggle — this is the "always a drawer on mobile" requirement.
>
> **Header**
>
> - Board title, "+ Add New Task" button (renders, but inert — no modal wiring yet), and a kebab menu (shadcn `DropdownMenu`) with "Edit Board" / "Delete Board" items present but unwired.
>
> **Board view**
>
> - Columns rendered horizontally (horizontally scrollable on mobile/narrow viewports), each with a colored dot, `NAME (count)` header, and stacked task cards.
> - Task cards show title + "`x of y subtasks`" completed count. Non-interactive this phase (click-to-open the task detail modal is phase 3).
> - A "+ New Column" ghost column at the end.
> - An empty-board state (for a board with zero columns) per `context/project-overview.md` §9.
>
> After this phase: run `npx tsc --noEmit`, `npm run lint`, `npm run build`, fix all errors, explain what changed, and wait for approval before starting phase 3.
