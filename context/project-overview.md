# Kanban Task Management App — Project Overview

## 1. Project Goal

Build a responsive Kanban task-management application based on the Frontend Mentor challenge:

https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB

The app should allow users to create boards, organize tasks into columns, manage subtasks, and move tasks through the workflow.

The implementation should be clean, responsive, accessible, and easy to extend.

---

## 2. Core Features

### Board Management

- Display the current board.
- Create a new board.
- Rename a board.
- Delete a board.
- Switch between boards.
- Show the number of boards in the sidebar.

### Column Management

- Display columns such as:
  - Todo
  - Doing
  - Done
- Create a new column.
- Rename a column.
- Delete a column.
- Reorder columns if needed.

### Task Management

- Create a task.
- Edit a task.
- Delete a task.
- Add a task description.
- Assign a task to a column.
- Set a task status.
- Add subtasks.
- Mark subtasks as complete.
- Move tasks between columns.
- Display the number of completed subtasks.

### UI Features

- Responsive desktop, tablet, and mobile layouts.
- Sidebar that can open and close.
- Light and dark themes.
- Modal dialogs for creating and editing items.
- Dropdown menus.
- Drag-and-drop task movement.
- Empty-column states.
- Accessible keyboard navigation.
- Clear loading, error, and confirmation states.

---

## 3. Recommended Technology

- Next.js
- TypeScript
- Tailwind CSS
- React
- Zustand or React Context for state management
- Zod for form validation
- dnd-kit for drag-and-drop
- localStorage for initial persistence

Suggested commands:

```bash
npx create-next-app@latest kanban-app --typescript --tailwind --eslint --app
cd kanban-app
npm install zustand zod @dnd-kit/core @dnd-kit/sortable
```

---

## 4. Data Model

```ts
export type Subtask = {
  id: string;
  title: string;
  isCompleted: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
};

export type Column = {
  id: string;
  name: string;
  tasks: Task[];
};

export type Board = {
  id: string;
  name: string;
  columns: Column[];
};
```

---

## 5. Suggested Folder Structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileHeader.tsx
│   ├── board/
│   │   ├── BoardView.tsx
│   │   ├── BoardColumn.tsx
│   │   └── EmptyBoard.tsx
│   ├── task/
│   │   ├── TaskCard.tsx
│   │   ├── TaskDetailsModal.tsx
│   │   └── TaskForm.tsx
│   ├── modals/
│   │   ├── CreateBoardModal.tsx
│   │   ├── EditBoardModal.tsx
│   │   ├── CreateColumnModal.tsx
│   │   └── DeleteConfirmationModal.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Dropdown.tsx
├── store/
│   └── kanban-store.ts
├── types/
│   └── kanban.ts
└── lib/
    ├── storage.ts
    └── validation.ts
```

---

## 6. Color Palette — 5 Main Colors

Use these five colors consistently across the application.

| Color         | Hex       | Purpose                                          |
| ------------- | --------- | ------------------------------------------------ |
| Deep Navy     | `#20212C` | Dark sidebar and dark-theme background           |
| Slate Blue    | `#635FC7` | Primary buttons, active states, and highlights   |
| Soft Lavender | `#A8A4FF` | Hover states, secondary accents, and focus rings |
| Cloud Gray    | `#F4F7FD` | Light-theme page background                      |
| Pure White    | `#FFFFFF` | Cards, modals, inputs, and main surfaces         |

### Additional Semantic Colors

These are optional supporting colors:

```css
:root {
  --color-primary: #635fc7;
  --color-primary-hover: #a8a4ff;
  --color-background-light: #f4f7fd;
  --color-background-dark: #20212c;
  --color-surface: #ffffff;
  --color-text-primary: #000112;
  --color-text-secondary: #828fa3;
  --color-border: #e4ebfa;
  --color-danger: #ea5555;
  --color-success: #67e2ae;
}
```

### Tailwind Usage

```ts
const colors = {
  primary: "#635FC7",
  primaryHover: "#A8A4FF",
  dark: "#20212C",
  background: "#F4F7FD",
  surface: "#FFFFFF",
};
```

Recommended visual rules:

- Use `#635FC7` for the main CTA button.
- Use `#20212C` for the dark sidebar.
- Use `#F4F7FD` for the light page background.
- Use `#FFFFFF` for task cards and modal surfaces.
- Use `#A8A4FF` only for hover, focus, or selected states.
- Use the danger color only for destructive actions.
- Keep text contrast accessible in both themes.

---

## 7. Main Layout

### Desktop

```text
┌───────────────────────────────────────────────────────────────┐
│ Header: Logo | Board Name | Add Task | More                   │
├───────────────┬───────────────────────────────────────────────┤
│ Sidebar       │ Board Content                                 │
│               │                                                 │
│ All Boards    │ Todo       Doing       Done                   │
│               │ ┌───────┐  ┌───────┐   ┌───────┐              │
│ + Create      │ │ Task  │  │ Task  │   │ Task  │              │
│               │ └───────┘  └───────┘   └───────┘              │
│               │                                                 │
└───────────────┴───────────────────────────────────────────────┘
```

### Mobile

- Hide the full sidebar.
- Show a compact board selector in the header.
- Display columns vertically or horizontally scrollable.
- Keep task cards readable and touch-friendly.
- Place the primary “Add Task” action where it is easy to reach.

---

## 8. State Management Requirements

The store should support:

```ts
type KanbanActions = {
  createBoard: (name: string) => void;
  updateBoard: (boardId: string, name: string) => void;
  deleteBoard: (boardId: string) => void;
  selectBoard: (boardId: string) => void;

  createColumn: (boardId: string, name: string) => void;
  updateColumn: (columnId: string, name: string) => void;
  deleteColumn: (columnId: string) => void;

  createTask: (columnId: string, task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
  ) => void;

  toggleSubtask: (taskId: string, subtaskId: string) => void;
};
```

Persist the board state to `localStorage` so that data remains available after refreshing the page.

---

## 9. Component Behavior

### Task Card

A task card should show:

- Task title.
- Completed subtasks count.
- Total subtasks count.
- Click behavior to open task details.
- Drag behavior to move the task.
- Keyboard-accessible alternative for moving tasks.

### Task Details Modal

The modal should include:

- Task title.
- Description.
- Subtask checklist.
- Current status dropdown.
- Edit action.
- Delete action.
- Close action.

### Delete Confirmation

Before deleting a board, column, or task:

- Explain what will be deleted.
- Use a destructive button.
- Provide a cancel action.
- Avoid accidental deletion.

---

## 10. Implementation Order

### Phase 1 — Foundation

- Create the Next.js project.
- Configure Tailwind CSS.
- Add global colors and typography.
- Create TypeScript types.
- Add initial mock data.

### Phase 2 — Layout

- Build the header.
- Build the sidebar.
- Build the board view.
- Build columns and task cards.
- Add responsive behavior.

### Phase 3 — State

- Create the Zustand store.
- Add board selection.
- Add task and column CRUD operations.
- Add localStorage persistence.

### Phase 4 — Modals and Forms

- Create board modal.
- Create task modal.
- Edit task modal.
- Delete confirmation modal.
- Add Zod validation.

### Phase 5 — Interactions

- Add drag-and-drop.
- Add subtask toggling.
- Add status changes.
- Add light/dark theme switching.
- Add keyboard accessibility.

### Phase 6 — Polish

- Add animations.
- Add empty states.
- Add error handling.
- Test mobile layouts.
- Test keyboard navigation.
- Check color contrast.
- Refactor repeated components.

---

## 11. Definition of Done

- [ ] The app runs locally without errors.
- [ ] Users can create, edit, and delete boards.
- [ ] Users can create, edit, and delete columns.
- [ ] Users can create, edit, and delete tasks.
- [ ] Users can create and complete subtasks.
- [ ] Users can move tasks between columns.
- [ ] Board state persists after refresh.
- [ ] Light and dark themes work.
- [ ] Desktop and mobile layouts work.
- [ ] Modals close correctly.
- [ ] Forms validate user input.
- [ ] Destructive actions require confirmation.
- [ ] Keyboard navigation works.
- [ ] The five-color palette is used consistently.
- [ ] No major console errors remain.

---

## 12. Prompt for Claude Code

Use this prompt to begin implementation:

> Build a responsive Kanban task-management application using Next.js, TypeScript, Tailwind CSS, Zustand, Zod, and dnd-kit.
>
> Follow the project overview in this file. Start with the application foundation, TypeScript data models, mock data, and responsive layout. Use the five-color palette:
>
> - Deep Navy: `#20212C`
> - Slate Blue: `#635FC7`
> - Soft Lavender: `#A8A4FF`
> - Cloud Gray: `#F4F7FD`
> - Pure White: `#FFFFFF`
>
> Implement the project in small phases. After each phase:
>
> 1. Run the type checker.
> 2. Run the linter.
> 3. Fix all errors.
> 4. Explain what was changed.
> 5. Wait for approval before starting the next major phase.
>
> Prioritize clean component boundaries, accessible interactions, responsive design, and maintainable state management. Do not add unnecessary dependencies or features outside the project scope.
