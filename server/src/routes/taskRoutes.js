const express = require("express");

const validateParams = require("../middleware/validateparams");

const { taskIdSchema } = require("../validators/paramsValidator");

const validateRequest = require("../middleware/validateRequest");

const validateQuery = require("../middleware/validateQuery");

const { taskQuerySchema } = require("../validators/taskQueryValidator");

const {
  createTaskSchema,
  updateTaskSchema,
} = require("../validators/taskValidator");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", validateRequest(createTaskSchema), createTask);

router.get("/",validateQuery(taskQuerySchema), getTasks);

router.get("/:id", validateParams(taskIdSchema), getTaskById);

router.patch(
  "/:id",
  validateParams(taskIdSchema),
  validateRequest(updateTaskSchema),
  updateTask,
);

router.delete("/:id", validateParams(taskIdSchema), deleteTask);

module.exports = router;
