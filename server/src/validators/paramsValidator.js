const { z } = require("zod");

const taskIdSchema = z.object({
  id: z.string().regex(/[a-fA-F0-9]{24}$/, "Invalid task ID") 
}).strict();

module.exports = { taskIdSchema };

// mongodb objectid normally 24 hexadecimal characters ka hota hai.