import { prisma } from "../src/lib/prisma";
import { mockBoards } from "../src/lib/mock-data";

async function clearAll() {
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.column.deleteMany();
  await prisma.board.deleteMany();
}

async function fill() {
  for (const board of mockBoards) {
    await prisma.board.create({
      data: {
        name: board.name,
        columns: {
          create: board.columns.map((column) => ({
            name: column.name,
            tasks: {
              create: column.tasks.map((task) => ({
                title: task.title,
                description: task.description,
                status: task.status,
                subtasks: {
                  create: task.subtasks.map((subtask) => ({
                    title: subtask.title,
                    isCompleted: subtask.isCompleted,
                  })),
                },
              })),
            },
          })),
        },
      },
    });
  }
}

async function main() {
  const mode = process.argv[2];

  if (mode === "clear") {
    await clearAll();
    console.log("Cleared all boards, columns, tasks, and subtasks.");
    return;
  }

  if (mode === "fill" || !mode) {
    await clearAll();
    await fill();
    console.log(`Seeded ${mockBoards.length} boards from mock data.`);
    return;
  }

  console.error(`Unknown mode "${mode}". Use "fill" or "clear".`);
  process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
