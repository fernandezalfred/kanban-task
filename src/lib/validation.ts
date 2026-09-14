import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Can't be empty"),
  description: z.string().trim(),
  subtasks: z.array(
    z.object({
      id: z.string(),
      title: z.string().trim().min(1, "Can't be empty"),
    })
  ),
  columnId: z.string().min(1, "Select a status"),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const boardFormSchema = z.object({
  name: z.string().trim().min(1, "Can't be empty"),
  columns: z.array(
    z.object({
      id: z.string(),
      name: z.string().trim().min(1, "Can't be empty"),
    })
  ),
});

export type BoardFormValues = z.infer<typeof boardFormSchema>;
