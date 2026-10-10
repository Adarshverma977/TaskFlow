import { useCallback, useEffect, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch tasks from the backend
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Unable to load tasks.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create a new task
  const addTask = async (taskData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const newTask = await createTask(taskData);

      setTasks((currentTasks) => [newTask, ...currentTasks]);

      return newTask;
    } catch (err) {
      setError(err.message || "Unable to create task.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update an existing task
  const editTask = async (id, taskData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const updatedTask = await updateTask(id, taskData);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task)),
      );

      return updatedTask;
    } catch (err) {
      setError(err.message || "Unable to update task.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a task
  const removeTask = async (id) => {
    setError("");

    try {
      await deleteTask(id);

      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message || "Unable to delete task.");
      throw err;
    }
  };

  // Change a task's status
  const changeTaskStatus = async (id, status) => {
    await editTask(id, { status });
  };

  return {
    tasks,
    isLoading,
    isSubmitting,
    error,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    changeTaskStatus,
  };
}

export default useTasks;
