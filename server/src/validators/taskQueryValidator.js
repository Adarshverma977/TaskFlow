const { z } = require("zod");

const isoDateSchema = z.iso.date();

const taskQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z.enum([
    "pending",
    "in-progress",
    "completed"
  ]).optional(),

  priority: z.enum([
    "low",
    "medium",
    "high"
  ]).optional(),

  search: z.string()
  .trim()
  .min(1)
  .max(100)
  .optional(),

  dueFrom: z.iso.date().optional(),

  dueTo: z.iso.date().optional(),

  sortBy: z.enum([
    "createdAt",
    "dueDate",
    "title",
    "priority"
  ]).default("createdAt"),

  order: z.enum(["asc", "desc"]).default("desc")
}).strict().refine(
  (data) => {
    if (data.dueFrom && data.dueTo){
      return data.dueFrom <= data.dueTo;
    }
    return true;
  },
  {
    message: "dueFrom must be on or before dueTo",
    path: ["dueTo"]
  }
);

module.exports = { taskQuerySchema };