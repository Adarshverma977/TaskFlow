import { useCallback, useEffect, useRef, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

const PAGE_SIZE = 10;

function getSortOptions(sortBy) {
  const sortOptions = {
    newest: { sortBy: "createdAt", order: "desc" },
    oldest: { sortBy: "createdAt", order: "asc" },
    "due-date": { sortBy: "dueDate", order: "asc" },
    priority: { sortBy: "priority", order: "desc" },
  };

  return sortOptions[sortBy] || sortOptions.newest;
}

function getPageFromURL() {
  const params = new URLSearchParams(window.location.search);
  const page = Number(params.get("page") || 1);

  return Number.isInteger(page) && page >= 1 ? page : 1;
}

function updateURLParams(updates) {
  const url = new URL(window.location.href);

  Object.entries(updates).forEach(([key, value]) => {
    if (value === "" || value == null || value === "all") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
  });

  window.history.replaceState({}, "", url);
}

function useTasks({
  status = "all",
  search = "",
  sortBy = "newest",
} = {}) {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    totalTasks: 0,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isFirstFetch = useRef(true);
  const requestId = useRef(0);

  const fetchTasks = useCallback(
    async (requestedPage = 1) => {
      const currentRequestId = ++requestId.current;

      setIsLoading(true);
      setError("");

      const sortOptions = getSortOptions(sortBy);

      try {
        const firstResult = await getTasks({
          page: 1,
          limit: PAGE_SIZE,
          status,
          search,
          sortBy: sortOptions.sortBy,
          order: sortOptions.order,
        });

        if (currentRequestId !== requestId.current) return;

        const targetPage = Math.min(
          requestedPage,
          Math.max(firstResult.pagination.totalPages, 1),
        );

        let allTasks = firstResult.tasks;
        let latestPagination = firstResult.pagination;

        for (let page = 2; page <= targetPage; page += 1) {
          const result = await getTasks({
            page,
            limit: PAGE_SIZE,
            status,
            search,
            sortBy: sortOptions.sortBy,
            order: sortOptions.order,
          });

          if (currentRequestId !== requestId.current) return;

          allTasks = [...allTasks, ...result.tasks];
          latestPagination = result.pagination;
        }

        setTasks(allTasks);
        setPagination({
          ...latestPagination,
          page: targetPage,
        });

        updateURLParams({
          page: targetPage,
          status,
          search: search.trim(),
          sortBy,
        });
      } catch (err) {
        if (currentRequestId === requestId.current) {
          setError(err.message || "Unable to load tasks.");
        }
      } finally {
        if (currentRequestId === requestId.current) {
          setIsLoading(false);
        }
      }
    },
    [status, search, sortBy],
  );

  useEffect(() => {
    const requestedPage = isFirstFetch.current ? getPageFromURL() : 1;

    isFirstFetch.current = false;

    updateURLParams({
      page: requestedPage,
      status,
      search: search.trim(),
      sortBy,
    });

    fetchTasks(requestedPage);

    return () => {
      requestId.current += 1;
    };
  }, [fetchTasks, status, search, sortBy]);

  const loadMoreTasks = async () => {
    if (
      isLoading ||
      isLoadingMore ||
      pagination.page >= pagination.totalPages
    ) {
      return;
    }

    const nextPage = pagination.page + 1;
    const currentRequestId = requestId.current;
    const sortOptions = getSortOptions(sortBy);

    setIsLoadingMore(true);
    setError("");

    try {
      const result = await getTasks({
        page: nextPage,
        limit: PAGE_SIZE,
        status,
        search,
        sortBy: sortOptions.sortBy,
        order: sortOptions.order,
      });

      if (currentRequestId !== requestId.current) return;

      setTasks((currentTasks) => {
        const existingIds = new Set(
          currentTasks.map((task) => String(task.id)),
        );

        const newTasks = result.tasks.filter(
          (task) => !existingIds.has(String(task.id)),
        );

        return [...currentTasks, ...newTasks];
      });

      setPagination(result.pagination);

      updateURLParams({
        page: nextPage,
        status,
        search: search.trim(),
        sortBy,
      });
    } catch (err) {
      if (currentRequestId === requestId.current) {
        setError(err.message || "Unable to load more tasks.");
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setIsLoadingMore(false);
      }
    }
  };

  const addTask = async (taskData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const newTask = await createTask(taskData);
      await fetchTasks(1);
      return newTask;
    } catch (err) {
      setError(err.message || "Unable to create task.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const editTask = async (id, taskData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const updatedTask = await updateTask(id, taskData);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          String(task.id) === String(id)
            ? { ...updatedTask, id: updatedTask._id ?? updatedTask.id }
            : task,
        ),
      );

      return updatedTask;
    } catch (err) {
      setError(err.message || "Unable to update task.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeTask = async (id) => {
    setError("");

    try {
      await deleteTask(id);
      await fetchTasks(1);
    } catch (err) {
      setError(err.message || "Unable to delete task.");
      throw err;
    }
  };

  const changeTaskStatus = async (id, newStatus) => {
    await editTask(id, { status: newStatus });
  };

  const hasMore = pagination.page < pagination.totalPages;

  return {
    tasks,
    pagination,
    hasMore,
    isLoading,
    isLoadingMore,
    isSubmitting,
    error,
    fetchTasks,
    loadMoreTasks,
    addTask,
    editTask,
    removeTask,
    changeTaskStatus,
  };
}

export default useTasks;
