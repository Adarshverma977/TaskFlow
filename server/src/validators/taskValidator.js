const { z } = require("zod");

const createTaskSchema = z.object({
  title: z.string()
  .trim()
  .min(1, "Task title is required")
  .max(100, "Title cannot exceed 100 characters"),

  description: z.string()
  .max(1000, "Description cannot exceed 1000 characters")
  .optional(),

  priority: z.enum(["low", "medium", "high"])
  .optional(),

  status: z.enum(["pending", "in-progress", "completed"])
  .optional(),

  dueDate: z.string()
  .datetime({ offset: true })
  .optional()
}).strict();

const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title cannot be empty")
    .max(100, "Title cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  priority: z.enum(["low", "medium", "high"])
  .optional(),

  status: z.enum(["pending", "in-progress", "completed"])
  .optional(),

  dueDate: z.string()
  .datetime({ offset: true })
  .optional(),
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required for update"
  }
)

module.exports = { createTaskSchema, updateTaskSchema };