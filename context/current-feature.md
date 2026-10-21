# Current Feature: Board Slug in URL

## Status

In Progress

## Goals

- When a board is selected from the sidebar (or header board switcher), the URL updates to reflect which board is active (e.g. `/dashboard/[slug]`).
- Loading `/dashboard/[slug]` directly (refresh, bookmark, shared link) opens that board selected, not just the first board.
- Plain `/dashboard` still works and falls back to selecting the first board (redirect or default behavior), to avoid a hard breaking change.
- Browser back/forward navigates between previously visited boards.

## Notes

- `Board` has no `slug` field today (`src/types/kanban.ts`, `prisma/schema.prisma`) — board names aren't guaranteed unique. Plan: derive the slug from the board name at render/lookup time (kebab-case, e.g. "Platform Launch" → `platform-launch`) rather than adding a persisted `slug` field/migration, since this is routing sugar, not new stored data. On a name collision, disambiguate by falling back to matching the first board whose slugified name matches (acceptable given boards are scoped to one user's small board list).
- Current routing is `src/app/dashboard/page.tsx` → single `DashboardShell` client component (`src/components/dashboard/DashboardShell.tsx`) that holds `selectedBoardId` in local `useState` only; no URL involvement at all today. This needs to move toward a dynamic segment (`src/app/dashboard/[slug]/page.tsx`) with `DashboardShell` driven by the slug from the route (via `useRouter`/`usePathname` or passed down from the server component), instead of pure local state.
- Board switching currently happens in two places: `Sidebar` → `BoardNavList`, and `Header`'s board switcher — both call `onSelectBoard`/`onBoardCreated` callbacks from `DashboardShell`. Both need to trigger a navigation (`router.push`) to the new board's slug instead of (or in addition to) local state.
- Keep this scoped to navigation/URL only — no change to board CRUD, layout, or data model persistence.

## History

- **Dashboard Phase 1 — Foundation** (2026-09-13): shadcn/ui initialized and themed to the Kanban 5-color palette (light/dark), `Plus Jakarta Sans` font, dark-mode-by-default, `Subtask`/`Task`/`Column`/`Board` types, mock data (3 boards), board moved to `/dashboard`. See `context/features/dashboard-phase-1-spec.md`. Next: phase 2 (static layout).
- **Dashboard Phase 2 — Static Layout** (2026-09-13): full static layout at `/dashboard` — collapsible desktop sidebar, mobile drawer board switcher, header (inert Add Task button, unwired board options menu), board/column/task-card views wired to mock data via local `useState`, empty-board state. See `context/features/dashboard-phase-2-spec.md`. Verified via `tsc`/lint/build; not yet checked visually in a browser (Claude in Chrome declined this session). Next: phase 3 (state, working modals, drag-and-drop).
- **Dashboard Phase 3 — State, Modals, Interactions & Polish** (2026-09-13): Zustand store (all `project-overview.md` §8 actions) with localStorage persistence; working Add/Edit Task, Task Details, Create/Edit Board, and Delete Confirmation modals (Zod-validated); column create/rename/delete via Edit Board; drag-and-drop between columns (dnd-kit) with the Task Details status dropdown as the keyboard alternative; hydration-aware loading state (fixed an SSR crash from zustand persist's default storage touching `window` on the server) and a zero-boards empty state. See `context/features/dashboard-phase-3-spec.md`. This closes out all 3 dashboard phases. Verified via `tsc`/lint/build only — not yet exercised in a real browser (drag-and-drop, forms, modal focus/keyboard behavior are unconfirmed interactively).
- **MongoDB Persistence Migration** (2026-10-20): replaced Zustand's `localStorage` persistence with MongoDB (Prisma 6.19.3, `mongodb` provider) as the real source of truth. `src/actions/boards.ts`/`tasks.ts` implement every CRUD operation (Zod-validated, `{success,data,error}`) including drag-and-drop move; `/dashboard` is now an async server component reading via `getBoards()`; every modal and the dnd-kit drag flow (React 19 `useOptimistic` + `router.refresh()`) rewired off the Zustand store onto these Server Actions. `src/store/kanban-store.ts` and the `zustand` dependency removed entirely — no `localStorage` usage remains. `prisma/seed.ts` restores the 3 mock-data boards for local dev (`npm run db:seed`/`db:clear`). Vitest added (27 tests across `src/actions/*.test.ts`, Prisma mocked at the module boundary). Full CRUD flow verified interactively via Playwright against the real MongoDB cluster — including drag-and-drop surviving a hard reload and a cascade-delete confirmed directly via a Prisma query — which surfaced and led to fixing a pre-existing bug: the task Status `<Select>` showed the raw MongoDB `columnId` instead of the column name (base-ui's `Select.Value` needs an `items` label map). See `context/features/mongodb-persistence-spec.md`. Standards exception: this feature uses `prisma db push` instead of `migrate dev`, since Prisma Migrate doesn't support MongoDB at all.
