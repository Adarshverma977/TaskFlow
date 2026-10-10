const API_URL = "http://localhost:5000/api/tasks";
// Get all tasks
export async function getTasks() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks.");
  }

  const result = await response.json();

  console.log("Backend response:", result);

  // Extract tasks from the actual backend response
  const tasks = Array.isArray(result)
    ? result
    : Array.isArray(result.data)
      ? result.data
      : Array.isArray(result.tasks)
        ? result.tasks
        : [];

  return tasks.map((task) => ({
    ...task,
    id: task._id ?? task.id,
  }));
}
// Create a task
export async function createTask(taskData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to create task."));
  }
  const task = await response.json();
  return {
    ...task,
    id: task._id ?? task.id,
  };
}
// Update an existing task
export async function updateTask(id, taskData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to update task."));
  }
  const task = await response.json();
  return {
    ...task,
    id: task._id ?? task.id,
  };
}
// Delete a task
export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to delete task."));
  }
  // Some APIs return 204 No Content
  if (response.status === 204) {
    return true;
  }
  return response.json();
}
// Read the backend's error message when available
async function getErrorMessage(response, fallback) {
  try {
    const data = await response.json();
    return data.message || data.error || fallback;
  } catch {
    return fallback;
  }
}
