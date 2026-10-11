const CACHE_PREFIX = "taskflow_tasks_cache";

function getCacheKey({ status = "all", search = "", sortBy = "newest" } = {}) {
  return `${CACHE_PREFIX}:${JSON.stringify({
    status,
    search: search.trim(),
    sortBy,
  })}`;
}

export function saveTasksCache(data, filters) {
  try {
    sessionStorage.setItem(
      getCacheKey(filters),
      JSON.stringify({
        ...data,
        cachedAt: Date.now(),
      }),
    );
  } catch (error) {
    console.warn("Unable to save tasks cache:", error);
  }
}

export function getTasksCache(filters) {
  try {
    const cachedData = sessionStorage.getItem(getCacheKey(filters));

    if (!cachedData) return null;

    const parsedData = JSON.parse(cachedData);

    if (!Array.isArray(parsedData.tasks) || !parsedData.pagination) {
      return null;
    }

    return parsedData;
  } catch (error) {
    console.warn("Unable to read tasks cache:", error);
    return null;
  }
}

export function clearTasksCache(filters) {
  try {
    if (filters) {
      sessionStorage.removeItem(getCacheKey(filters));
      return;
    }

    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(`${CACHE_PREFIX}:`))
      .forEach((key) => sessionStorage.removeItem(key));
  } catch (error) {
    console.warn("Unable to clear tasks cache:", error);
  }
}

export function clearAllTasksCache() {
  try {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(`${CACHE_PREFIX}:`))
      .forEach((key) => sessionStorage.removeItem(key));
  } catch (error) {
    console.warn("Unable to clear tasks cache:", error);
  }
}

