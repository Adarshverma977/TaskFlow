const API_URL = "http://localhost:5000/api/tasks";
// Get all tasks

export async function getTasks({
  page = 1,
  limit = 10,
  status,
  priority,
  sortBy = "createdAt",
  order = "desc",
  search,
  dueFrom,
  dueTo,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
    order,
  });

  if (status && status !== "all") {
    params.set("status", status);
  }

  if (priority) {
    params.set("priority", priority);
  }

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  if (dueFrom) {
    params.set("dueFrom", dueFrom);
  }

  if (dueTo) {
    params.set("dueTo", dueTo);
  }

  const response = await fetch(`${API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to fetch tasks."));
  }

  const result = await response.json();

  const tasks = Array.isArray(result.data) ? result.data : [];

  return {
    tasks: tasks.map((task) => ({
      ...task,
      id: task._id ?? task.id,
    })),
    pagination: result.pagination ?? {
      page,
      limit,
      totalTasks: tasks.length,
      totalPages: 1,
    },
  };
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

  const result = await response.json();

  // Support both direct task and wrapped API responses
  const task = result.data ?? result.task ?? result;

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
