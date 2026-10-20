# Current Feature: MongoDB Persistence Migration

## Status

In Progress

## Goals

- Replace Zustand's `localStorage` persistence with MongoDB (Prisma, `mongodb` provider) as the real source of truth.
- All board/column/task/subtask CRUD, including drag-and-drop move, reads and writes MongoDB via Server Actions.
- `MONGODB_URI` lives only in `.env.local`; `.env.example` documents the shape without a real credential.
- `localStorage`/`zustand` `persist` middleware and its hydration workaround (`useHasHydrated`, `skipHydration`, `noopStorage`) are removed entirely.
- **Seeding** (done): `prisma/seed.ts` loads `src/lib/mock-data.ts` (`mockBoards`) into MongoDB via nested Prisma creates, runnable as a single command in two modes — fill (seed the 3 mock boards) and clear (wipe all Board/Column/Task/Subtask documents) — per spec §6.
- **Server Actions + client wiring** (done): `src/actions/boards.ts` and `src/actions/tasks.ts` implement all CRUD (Zod-validated, `{success,data,error}`); `/dashboard` is now an async server component calling `getBoards()` (`export const dynamic = "force-dynamic"` so it's never statically cached); every modal and the drag-and-drop flow was rewired off the Zustand store onto these Server Actions + `router.refresh()`; `moveTask` drag-and-drop uses React 19 `useOptimistic` for instant feedback, reconciled by `router.refresh()` after the action resolves. `src/store/kanban-store.ts` and the `zustand` dependency are removed entirely — nothing reads/writes `localStorage` anymore.
- **Testing** (done): `vitest@2.1.9` added as a devDependency (pinned below the current major to avoid an `@types/node` peer conflict with the project's `@types/node@^20`); `vitest.config.ts` restricts the run to `src/actions/**/*.test.ts` and `src/lib/**/*.test.ts` per `context/coding-standards.md`, Node environment, `@` alias wired to `src/`. `npm test`/`npm run test:watch` scripts added. `src/actions/boards.test.ts` and `src/actions/tasks.test.ts` cover every Server Action's success path, Zod-rejection path, and not-found/Prisma-error path (27 tests), with `@/lib/prisma` mocked at the module boundary — no real DB hit in tests.
- **Browser verification** (done): exercised the full CRUD flow via Playwright MCP against the real MongoDB cluster — toggle subtask, move task via status dropdown, drag-and-drop move (confirmed surviving a hard reload), create board, add task, delete board (confirmed cascade delete directly via a Prisma query — no orphaned columns/tasks). Zero console errors/warnings. Found and fixed one pre-existing bug surfaced by this check: the task Status `<Select>` in `TaskDetailsModal`/`TaskForm` (used by Add/Edit Task) displayed the raw MongoDB `columnId` instead of the column name — base-ui's `Select.Value` renders the raw value unless given an `items` map; fixed by passing `items={Object.fromEntries(columns.map(c => [c.id, c.name]))}` to `Select` in both components. Pre-dated this feature (same code existed against mock-data slugs) but was invisible until real ObjectIds made it obvious — first time this screen had been checked in a browser. `tsc`/lint/test/build all re-verified green after the fix.
- **Still open**: none — all Definition of Done items are met.

## Notes

- Full spec: `context/features/mongodb-persistence-spec.md`.
- Seeding sub-task: mock data uses human-readable slug ids (e.g. `platform-launch`), not Mongo ObjectIds — the seed script lets Prisma `@default(auto())` generate real ids via nested `create`, it does not try to preserve the slugs.
- Standards exception: `context/coding-standards.md` requires `prisma migrate dev`, but Prisma Migrate doesn't support the MongoDB provider at all — this feature uses `npx prisma db push` instead (documented in the spec's decision log).
- **Prisma version pin**: verified via Context7 that `latest` (Prisma 7) dropped MongoDB support entirely; this feature pins `prisma@6.19.3` / `@prisma/client@6.19.3`. Revisit once Prisma 8 is GA with Mongo back.
- Connection string provided by the user: `mongodb+srv://root:<password>@cluster0.hcldudx.mongodb.net/` — needs a database name appended (e.g. `/kanban`) since Prisma's Mongo connector requires one in the URL. Real password must be filled into `.env` directly, never pasted into chat or committed.
- Branch: `feature/mongodb-persistence`.

## History

- **Dashboard Phase 1 — Foundation** (2026-09-13): shadcn/ui initialized and themed to the Kanban 5-color palette (light/dark), `Plus Jakarta Sans` font, dark-mode-by-default, `Subtask`/`Task`/`Column`/`Board` types, mock data (3 boards), board moved to `/dashboard`. See `context/features/dashboard-phase-1-spec.md`. Next: phase 2 (static layout).
- **Dashboard Phase 2 — Static Layout** (2026-09-13): full static layout at `/dashboard` — collapsible desktop sidebar, mobile drawer board switcher, header (inert Add Task button, unwired board options menu), board/column/task-card views wired to mock data via local `useState`, empty-board state. See `context/features/dashboard-phase-2-spec.md`. Verified via `tsc`/lint/build; not yet checked visually in a browser (Claude in Chrome declined this session). Next: phase 3 (state, working modals, drag-and-drop).
- **Dashboard Phase 3 — State, Modals, Interactions & Polish** (2026-09-13): Zustand store (all `project-overview.md` §8 actions) with localStorage persistence; working Add/Edit Task, Task Details, Create/Edit Board, and Delete Confirmation modals (Zod-validated); column create/rename/delete via Edit Board; drag-and-drop between columns (dnd-kit) with the Task Details status dropdown as the keyboard alternative; hydration-aware loading state (fixed an SSR crash from zustand persist's default storage touching `window` on the server) and a zero-boards empty state. See `context/features/dashboard-phase-3-spec.md`. This closes out all 3 dashboard phases. Verified via `tsc`/lint/build only — not yet exercised in a real browser (drag-and-drop, forms, modal focus/keyboard behavior are unconfirmed interactively).
