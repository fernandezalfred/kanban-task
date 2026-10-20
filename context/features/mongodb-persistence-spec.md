# MongoDB Persistence Spec

## Overview

Replace the Zustand `persist`/`localStorage` layer (`src/store/kanban-store.ts`) with MongoDB as the real source of truth, accessed through Prisma's `mongodb` provider. This is a **full migration**, not a hybrid/offline-fallback: once done, no board/column/task/subtask data lives in `localStorage`, and Zustand (if it survives at all) only mirrors server state for the UI — it never originates data.

## Decision log (confirmed with the user before writing this spec)

- **ORM**: Prisma with `provider = "mongodb"`.
- **Version pin (verified against current Prisma docs via Context7)**: Prisma's `latest` tag is now v7, which **dropped the MongoDB connector entirely** (rewritten around SQL driver adapters). Mongo support only exists on the 6.x line; v8 (where Mongo is expected to return) is still a release candidate, not GA. This project therefore installs `prisma@6.19.3` and `@prisma/client@6.19.3` explicitly — never an unpinned/`latest` install — using the v6-style schema (`generator client { provider = "prisma-client-js" }`, datasource `url = env("MONGODB_URI")` directly in `schema.prisma`). Revisit this pin once Prisma 8 reaches GA with a Mongo connector.
- **Standards exception**: `context/coding-standards.md` says "Always use `prisma migrate dev` for schema changes (not `db push`)". **Prisma Migrate does not support the MongoDB provider at all** — Mongo is schemaless, so Prisma only exposes `prisma db push` there. This feature uses `db push` for all schema changes; this is a deliberate, documented exception scoped to MongoDB models, not a precedent for the rest of the standards doc.
- **Scope**: Full migration of all CRUD (boards, columns, tasks, subtasks, task move) to MongoDB via Server Actions. `localStorage`/`zustand/middleware persist` is removed entirely, along with the hydration-loading-screen plumbing (`useHasHydrated`, `skipHydration`, `noopStorage`) that exists only to work around localStorage's client-only nature.
- **Cascading deletes**: not relied on via `onDelete: Cascade` in the schema — Mongo referential-action support in Prisma 6 is inconsistent enough that this spec has each delete Server Action (`deleteBoard`, `deleteColumn`, `deleteTask`) explicitly delete its children first, rather than trusting the schema to cascade.

## Requirements

### 1. Environment

- `MONGODB_URI` in `.env` at the project root (never committed — covered by the repo's `.env*` gitignore rule; Next.js and the Prisma 6 CLI both auto-load root `.env`, so one file covers the app and the CLI). Shape:
  `mongodb+srv://root:<password>@cluster0.hcldudx.mongodb.net/kanban?retryWrites=true&w=majority`
  — note the `/kanban` database name: Prisma's Mongo connector requires a database name in the URL (the user's original string ended in a bare `/`).
- `.env.example` committed (placeholder value only) so the required variable is documented; `.gitignore` gets a `!.env.example` exception since the blanket `.env*` rule would otherwise also hide the example file.
- The real password is filled in by the user directly in `.env` on their machine — it is never pasted into chat, a commit, or any file that gets committed.

### 2. Prisma setup

- `npm install prisma@6.19.3 @prisma/client@6.19.3` — pinned explicitly (see Decision log: `latest`/v7 has no Mongo connector).
- `prisma/schema.prisma`, v6 style:
  ```prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "mongodb"
    url      = env("MONGODB_URI")
  }
  ```
- Models mirroring `src/types/kanban.ts`:
  - `Board { id, name, columns Column[] }`
  - `Column { id, name, boardId, tasks Task[] }`
  - `Task { id, title, description, status, columnId, subtasks Subtask[] }`
  - `Subtask { id, title, isCompleted, taskId }`
  - All ids: `@id @default(auto()) @map("_id") @db.ObjectId`; foreign keys typed `String @db.ObjectId`.
  - No `onDelete: Cascade` in the schema (see Decision log) — children are deleted explicitly in the Server Actions.
- Schema changes applied with `npx prisma db push` (not `migrate dev`, which errors against `provider = "mongodb"`).
- `src/lib/prisma.ts`: singleton `PrismaClient`, cached on `globalThis` in development to survive Next.js hot reload (the standard pattern — a fresh client per reload otherwise exhausts MongoDB connections).

### 3. Server Actions (`src/actions/boards.ts`, `src/actions/tasks.ts`)

One action per entry in the `KanbanActions` type (`kanban-store.ts`): `createBoard`, `updateBoard`, `deleteBoard`, `createColumn`, `updateColumn`, `deleteColumn`, `createTask`, `updateTask`, `deleteTask`, `moveTask`, `toggleSubtask`. (`selectBoard` is pure client UI state — which board is open — and does not need to touch the database.)

- Zod-validate all inputs.
- `try/catch`, return `{ success, data, error }` per `context/coding-standards.md`.
- `moveTask` must update the task's `columnId` and `status` (status is derived from the destination column's name, same as today's in-memory logic).

### 4. Reads

- A server-side fetch (server component or a dedicated `getBoards()` used by the page) loads all boards with nested `columns`/`tasks`/`subtasks` via a single Prisma `include` query, replacing `mockBoards` as the initial data source.

### 5. Client wiring

- `DashboardShell` receives initial `boards` as a prop from a server component ancestor instead of importing `mockBoards`.
- Form `onSubmit` handlers (`CreateBoardModal`, `AddTaskModal`, `EditTaskModal`, `EditBoardModal`, etc.) call the new Server Actions instead of Zustand store actions.
- Drag-and-drop (`moveTask`) should update optimistically for responsiveness, then reconcile with the server action result.
- Decide during implementation whether Zustand stays as a thin client cache (populated from server data, updated optimistically) or is removed in favor of React state + revalidation — either is consistent with "full migration," the spec doesn't mandate one.

### 6. Seeding

- A seed script (`prisma/seed.ts`) loading `src/lib/mock-data.ts` into MongoDB, for local dev parity with the current 3-board starter state. Not run automatically in production.

### 7. Testing

Per `context/coding-standards.md` (Vitest, server actions & `lib` only — no component tests):

- `src/actions/*.test.ts` covering create/update/delete success paths, Zod rejection, and not-found handling, with Prisma mocked at the module boundary (`vi.mock('@/lib/prisma')`).

## Definition of Done

- [ ] `MONGODB_URI` is only in `.env.local`; `.env.example` is committed with a placeholder.
- [ ] `npx prisma db push` applied successfully against the real cluster.
- [ ] All CRUD (boards/columns/tasks/subtasks, including drag-and-drop move) reads/writes MongoDB — verified in the browser, not just `tsc`/build.
- [ ] Data survives a full page refresh, sourced from MongoDB (not `localStorage`).
- [ ] No remaining references to `localStorage` or `zustand/middleware`'s `persist` for board data.
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm test` all pass.
- [ ] No console errors.

## References

- @context/project-overview.md
- @context/coding-standards.md
- @src/store/kanban-store.ts
- @src/types/kanban.ts
- @src/lib/mock-data.ts

## Prompt for Claude Code

> Migrate the Kanban app's persistence from Zustand's `localStorage` middleware to MongoDB via Prisma (`provider = "mongodb"`), per `context/features/mongodb-persistence-spec.md`.
>
> **Environment**: read `MONGODB_URI` from `.env` at the project root (already scaffolded with a placeholder password — do not invent or hardcode a real credential anywhere).
>
> **Prisma**: install `prisma@6.19.3` + `@prisma/client@6.19.3` pinned exactly — `latest` (v7) has no MongoDB connector. Write a v6-style `mongodb`-provider schema (`generator client { provider = "prisma-client-js" }`, `url = env("MONGODB_URI")` in the datasource block) modeling `Board`/`Column`/`Task`/`Subtask` from `src/types/kanban.ts`, no `onDelete: Cascade` (handle cascading deletes explicitly in the Server Actions instead). Apply it with `npx prisma db push` (Prisma Migrate does not support MongoDB at all — do not use `migrate dev` for this feature). Add `src/lib/prisma.ts` with a hot-reload-safe singleton client.
>
> **Server Actions**: implement one action per entry in `KanbanActions` (`src/store/kanban-store.ts`) in `src/actions/boards.ts` and `src/actions/tasks.ts`, Zod-validated, returning `{ success, data, error }`.
>
> **Wiring**: fetch initial board data server-side (replacing `mockBoards`) and pass it into `DashboardShell`; rewire every modal/form's submit handler from the Zustand store actions to the new Server Actions. Remove the `persist` middleware, `skipHydration`, `useHasHydrated`, and `noopStorage` from `kanban-store.ts` — Zustand (if kept) becomes a thin cache, never the source of truth.
>
> **Seed**: add `prisma/seed.ts` loading `src/lib/mock-data.ts` so local dev isn't empty.
>
> **Testing**: Vitest unit tests for the new Server Actions (`src/actions/*.test.ts`), Prisma mocked at the module boundary — per `context/coding-standards.md`, no component tests.
>
> Work in small phases (env/Prisma setup → Server Actions → client wiring → seed → tests). After each phase: run `npx tsc --noEmit`, `npm run lint`, `npm run build`, fix all errors, explain what changed, and wait for approval before continuing. Verify the full CRUD flow in a real browser before calling this done — don't rely on `tsc`/build alone. Follow `context/ai-interaction.md`'s branch/test/commit workflow throughout.
