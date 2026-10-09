const Task = require("../models/Task");
const sendResponse = require("../utils/sendResponse");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
// CREATE TASK
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;
  const task = await Task.create({
    title,
    description,
    priority,
    status,
    dueDate,
  });
  return sendResponse(
    res,
    201,
    "Task Created successfully",
    task
  )
});
// GET ALL TASKS
const getTasks = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    status,
    priority,
    sortBy,
    order,
    search,
    dueFrom,
    dueTo
  } = res.locals.validateQuery;

  const filter = {};

  if(status){
    filter.status = status;
  }

  if(priority){
    filter.priority = priority;
  }

  if(search){
    filter.title = {
      $regex: search,
      $options: "i"
    };
  }

  if(dueFrom || dueTo){
    filter.dueDate = {};

    if(dueFrom){
      filter.dueDate.$gte = new Date(`${dueFrom}T00:00:00.000Z`);
    }

    if(dueTo){
      filter.dueDate.$lte = new Date(`${dueTo}T23:59:59.999Z`)
    }
  }

  const skip = (page - 1) * limit;

  const sortOrder = order === "asc" ? 1 : -1;

  const sort = {
    [sortBy]: sortOrder,
    _id: sortOrder
  };

  const [tasks, totalTasks] = await Promise.all([
    Task.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit),

    Task.countDocuments(filter)
  ]);
  return sendResponse(
    res,
    200,
    "Task Fetched successfully",
    tasks,
    {
      pagination: {
        page,
        limit,
        totalTasks,
        totalPages: Math.ceil(totalTasks / limit)
      }
    }
  );
});
// GET SINGLE TASK
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  return sendResponse(
    res,
    200,
    "Task Fetched successfully",
    task
  );
});
// UPDATE TASK
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  return sendResponse(
    res,
    200,
    "Task Updated successfully",
    task
  )
});
// DELETE TASK
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  return sendResponse(
    res,
    200,
    "Task Deleted successfully"
  )
});
module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
