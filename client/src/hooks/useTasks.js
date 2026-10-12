import { useCallback, useEffect, useRef, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

import {
  saveTasksCache,
  getTasksCache,
  clearAllTasksCache,
} from "../utils/taskCache";

const PAGE_SIZE = 10;

function getSortOptions(sortBy) {
  const sortOptions = {
    newest: { sortBy: "createdAt", order: "desc" },
    oldest: { sortBy: "createdAt", order: "asc" },
    "due-date": { sortBy: "dueDate", order: "asc" },
    priority: { sortBy: "priority", order: "asc" },
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

function useTasks({ status = "all", search = "", sortBy = "newest" } = {}) {
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
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const isFirstFetch = useRef(true);
  const requestId = useRef(0);
  const isLoadingMoreRef = useRef(false);

  const filters = {
    status,
    search: search.trim(),
    sortBy,
  };

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
          search: search.trim(),
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
            search: search.trim(),
            sortBy: sortOptions.sortBy,
            order: sortOptions.order,
          });

          if (currentRequestId !== requestId.current) return;

          allTasks = [...allTasks, ...result.tasks];
          latestPagination = result.pagination;
        }

        const loadedData = {
          tasks: allTasks,
          pagination: {
            ...latestPagination,
            page: targetPage,
          },
        };

        setTasks(loadedData.tasks);
        setPagination(loadedData.pagination);
        setHasLoadedOnce(true);

        saveTasksCache(loadedData, filters);

        updateURLParams({
          page: targetPage,
          status,
          search: search.trim(),
          sortBy,
        });
      } catch (err) {
        if (currentRequestId !== requestId.current) return;

        const cachedData = getTasksCache(filters);

        if (cachedData) {
          setTasks(cachedData.tasks);
          setPagination(cachedData.pagination);
          setHasLoadedOnce(true);

          setError(
            "You're viewing saved tasks. The server is unavailable, so this data may be outdated.",
          );
        } else {
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
      isLoadingMoreRef.current ||
      pagination.page >= pagination.totalPages
    ) {
      return;
    }

    isLoadingMoreRef.current = true;

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
        search: search.trim(),
        sortBy: sortOptions.sortBy,
        order: sortOptions.order,
      });

      if (currentRequestId !== requestId.current) return;

      const updatedTasks = [
        ...tasks,
        ...result.tasks.filter(
          (newTask) =>
            !tasks.some(
              (existingTask) =>
                String(existingTask.id ?? existingTask._id) ===
                String(newTask.id ?? newTask._id),
            ),
        ),
      ];

      const updatedPagination = result.pagination;

      setTasks(updatedTasks);
      setPagination(updatedPagination);

      saveTasksCache(
        {
          tasks: updatedTasks,
          pagination: updatedPagination,
        },
        filters,
      );

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
      isLoadingMoreRef.current = false;

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

      clearAllTasksCache();
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

      // Clear every filtered cache because status, search,
      // sorting, or other task fields may have changed.
      clearAllTasksCache();

      const nextTasks = tasks.map((task) =>
        String(task.id ?? task._id) === String(id)
          ? {
              ...updatedTask,
              id: updatedTask._id ?? updatedTask.id,
            }
          : task,
      );

      setTasks(nextTasks);

      // Rebuild the current cache with the updated task list.
      saveTasksCache(
        {
          tasks: nextTasks,
          pagination,
        },
        filters,
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

      clearAllTasksCache();
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
    hasLoadedOnce,
    fetchTasks,
    loadMoreTasks,
    addTask,
    editTask,
    removeTask,
    changeTaskStatus,
  };
}

export default useTasks;
