import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mockBoards } from "@/lib/mock-data";
import type { Board, Column, Task } from "@/types/kanban";

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function updateBoard(
  boards: Board[],
  boardId: string,
  fn: (board: Board) => Board
): Board[] {
  return boards.map((board) => (board.id === boardId ? fn(board) : board));
}

function findColumnBoard(boards: Board[], columnId: string) {
  return boards.find((board) =>
    board.columns.some((column) => column.id === columnId)
  );
}

function withColumn(
  boards: Board[],
  columnId: string,
  fn: (column: Column) => Column
): Board[] {
  return boards.map((board) => ({
    ...board,
    columns: board.columns.map((column) =>
      column.id === columnId ? fn(column) : column
    ),
  }));
}

function withTask(
  boards: Board[],
  taskId: string,
  fn: (task: Task) => Task
): Board[] {
  return boards.map((board) => ({
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      tasks: column.tasks.map((task) => (task.id === taskId ? fn(task) : task)),
    })),
  }));
}

function findTask(boards: Board[], taskId: string) {
  for (const board of boards) {
    for (const column of board.columns) {
      const task = column.tasks.find((t) => t.id === taskId);
      if (task) return task;
    }
  }
  return undefined;
}

type KanbanState = {
  boards: Board[];
  selectedBoardId: string | null;
};

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
    destinationColumnId: string
  ) => void;

  toggleSubtask: (taskId: string, subtaskId: string) => void;
};

export type KanbanStore = KanbanState & KanbanActions;

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      boards: mockBoards,
      selectedBoardId: mockBoards[0]?.id ?? null,

      createBoard: (name) =>
        set((state) => {
          const board: Board = {
            id: crypto.randomUUID(),
            name,
            columns: [],
          };
          return {
            boards: [...state.boards, board],
            selectedBoardId: board.id,
          };
        }),

      updateBoard: (boardId, name) =>
        set((state) => ({
          boards: updateBoard(state.boards, boardId, (board) => ({
            ...board,
            name,
          })),
        })),

      deleteBoard: (boardId) =>
        set((state) => {
          const boards = state.boards.filter((board) => board.id !== boardId);
          const selectedBoardId =
            state.selectedBoardId === boardId
              ? (boards[0]?.id ?? null)
              : state.selectedBoardId;
          return { boards, selectedBoardId };
        }),

      selectBoard: (boardId) => set({ selectedBoardId: boardId }),

      createColumn: (boardId, name) =>
        set((state) => ({
          boards: updateBoard(state.boards, boardId, (board) => ({
            ...board,
            columns: [
              ...board.columns,
              { id: crypto.randomUUID(), name, tasks: [] },
            ],
          })),
        })),

      updateColumn: (columnId, name) =>
        set((state) => ({
          boards: withColumn(state.boards, columnId, (column) => ({
            ...column,
            name,
          })),
        })),

      deleteColumn: (columnId) =>
        set((state) => ({
          boards: state.boards.map((board) => ({
            ...board,
            columns: board.columns.filter((column) => column.id !== columnId),
          })),
        })),

      createTask: (columnId, task) =>
        set((state) => ({
          boards: withColumn(state.boards, columnId, (column) => ({
            ...column,
            tasks: [...column.tasks, task],
          })),
        })),

      updateTask: (taskId, updates) =>
        set((state) => ({
          boards: withTask(state.boards, taskId, (task) => ({
            ...task,
            ...updates,
          })),
        })),

      deleteTask: (taskId) =>
        set((state) => ({
          boards: state.boards.map((board) => ({
            ...board,
            columns: board.columns.map((column) => ({
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            })),
          })),
        })),

      moveTask: (taskId, sourceColumnId, destinationColumnId) => {
        const { boards } = get();
        if (sourceColumnId === destinationColumnId) return;

        const sourceBoard = findColumnBoard(boards, sourceColumnId);
        const destinationBoard = findColumnBoard(boards, destinationColumnId);
        const task = findTask(boards, taskId);
        if (!sourceBoard || !destinationBoard || !task) return;

        const destinationColumn = destinationBoard.columns.find(
          (column) => column.id === destinationColumnId
        );
        if (!destinationColumn) return;

        const movedTask: Task = { ...task, status: destinationColumn.name };

        set((state) => ({
          boards: state.boards.map((board) => ({
            ...board,
            columns: board.columns.map((column) => {
              if (column.id === sourceColumnId) {
                return {
                  ...column,
                  tasks: column.tasks.filter((t) => t.id !== taskId),
                };
              }
              if (column.id === destinationColumnId) {
                return { ...column, tasks: [...column.tasks, movedTask] };
              }
              return column;
            }),
          })),
        }));
      },

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          boards: withTask(state.boards, taskId, (task) => ({
            ...task,
            subtasks: task.subtasks.map((subtask) =>
              subtask.id === subtaskId
                ? { ...subtask, isCompleted: !subtask.isCompleted }
                : subtask
            ),
          })),
        })),
    }),
    {
      name: "kanban-storage",
      skipHydration: true,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage
      ),
    }
  )
);

export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(() =>
    useKanbanStore.persist.hasHydrated()
  );

  useEffect(() => {
    const unsubscribe = useKanbanStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );
    useKanbanStore.persist.rehydrate();
    return unsubscribe;
  }, []);

  return hydrated;
}
