# Dashboard UI Phase 1 Spec

## Overview

Phase 1 of 3 for the dashboard UI layout. Match the referenced screenshot for visual structure. This phase sets up the foundation the remaining phases build on.

## Requirements for phase 1

- ShadCN UI initialization and components
- ShadCN component installation
- Dashboard route at `/dashboard`
- Main dashboard layout and any global styles
- Dark mode by default

## References

- @context/screenshots/dashboard-ui.jpg
- @context/project-overview.md
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-2-spec.md
- @context/features/dashboard-phase-3-spec.md

## Prompt for Claude Code

> Set up the foundation for the Kanban board UI, living at the `/dashboard` route (not `/`).
>
> **shadcn/ui**
>
> - Initialize shadcn/ui (respect the existing Tailwind v4 CSS-based config — no `tailwind.config.ts`/`.js`, per `context/coding-standards.md`).
> - Install the primitives needed across all phases: `button`, `dialog`, `sheet`, `switch`, `dropdown-menu`, `select`, `checkbox`, `input`, `textarea`, `label`, `separator`, `scroll-area`.
>
> **Theme**
>
> - Override the shadcn CSS variables with the project's 5-color palette (`context/project-overview.md` §6): `--color-primary: #635FC7`, `--color-primary-hover: #A8A4FF`, `--color-background-light: #F4F7FD`, `--color-background-dark: #20212C`, `--color-surface: #FFFFFF`, plus the semantic colors (`--color-text-secondary`, `--color-border`, `--color-danger`, `--color-success`). Map them onto shadcn's `--primary` / `--background` / `--card` / `--border` / `--destructive` tokens for both light and dark themes.
> - Add the `Plus Jakarta Sans` font via `next/font/google` to match the Frontend Mentor design.
> - Wire dark-mode support (e.g. `next-themes`) with **dark as the default theme**.
>
> **Types and mock data**
>
> - `src/types/kanban.ts` — `Subtask`, `Task`, `Column`, `Board`, exactly as defined in `context/project-overview.md` §4.
> - `src/lib/mock-data.ts` — seed data matching the reference screenshots: a "Platform Launch" board (Todo/Doing/Done columns, task/subtask counts matching `dashboard-ui.jpg`, `dashboard-ui2.jpg`, `dashboard-ui3.jpg`), plus at least two more boards ("Marketing Plan", "Roadmap") to exercise board switching.
>
> **Routing**
>
> - `src/app/page.tsx` redirects to `/dashboard`.
> - `src/app/dashboard/page.tsx` is the new board route (server component), importing the mock data.
>
> Do not build the sidebar/header/columns yet — that's phase 2. Do not build the Zustand store, persistence, drag-and-drop, or working modals — that's phase 3.
>
> After this phase: run `npx tsc --noEmit`, `npm run lint`, `npm run build`, fix all errors, explain what changed, and wait for approval before starting phase 2.
