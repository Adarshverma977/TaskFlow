const task = require("../models/Task");

const createTask = async(req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message
    });
  }
};

module.exports = {
  createTask
};