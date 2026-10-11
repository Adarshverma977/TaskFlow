
import { useEffect, useState } from "react";

import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import useTasks from "../hooks/useTasks";

function getDashboardFilters() {
  const params = new URLSearchParams(window.location.search);

  return {
    search: params.get("search") || "",
    sortBy: params.get("sortBy") || "newest",
  };
}

function Dashboard({ filter }) {
  // 1. Search and sorting states
  const [searchQuery, setSearchQuery] = useState(
    () => getDashboardFilters().search
  );

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const [sortBy, setSortBy] = useState(
    () => getDashboardFilters().sortBy
  );

  // 2. Other UI states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formError, setFormError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // 3. Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // 4. Connect Dashboard with the custom hook
  const {
    tasks,
    pagination,
    hasMore,
    isLoading,
    isLoadingMore,
    isSubmitting,
    error,
    hasLoadedOnce,
    addTask,
    fetchTasks,
    loadMoreTasks,
    editTask,
    removeTask,
    changeTaskStatus,
  } = useTasks({
    status: filter,
    search: debouncedSearch,
    sortBy,
  });

  // 5. Page title
  const pageTitles = {
    all: "My Tasks",
    pending: "Pending Tasks",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  const pageTitle = pageTitles[filter] || "My Tasks";

  // 6. Open create form
  function openCreateForm() {
    setEditingTask(null);
    setFormError("");
    setIsFormOpen(true);
  }

  // 7. Open edit form
  function openEditForm(task) {
    setEditingTask(task);
    setFormError("");
    setIsFormOpen(true);
  }

  // 8. Close form
  function closeForm() {
    setIsFormOpen(false);
    setEditingTask(null);
    setFormError("");
  }

  // 9. Create or update task
  async function handleFormSubmit(formData) {
    setFormError("");

    try {
      if (editingTask) {
        await editTask(editingTask.id, formData);
      } else {
        await addTask(formData);
      }

      closeForm();
    } catch (err) {
      setFormError(err.message || "Unable to save the task.");
    }
  }

  // 10. Delete task
  async function handleDeleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setDeletingTaskId(id);

    try {
      await removeTask(id);
    } catch {
      // The hook stores the API error for display.
    } finally {
      setDeletingTaskId(null);
    }
  }

  // 11. Change task status
  async function handleStatusChange(id, status) {
    setUpdatingTaskId(id);

    try {
      await changeTaskStatus(id, status);
    } catch {
      // The hook stores the API error for display.
    } finally {
      setUpdatingTaskId(null);
    }
  }

  // 12. Dashboard UI
  return (
    <section className="dashboard">
      <Header
        title={pageTitle}
        onAddTask={openCreateForm}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="dashboard-content">
        {/* Show the error and retry action */}
        {error && hasLoadedOnce && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => fetchTasks(1)}
              disabled={isLoading}
            >
              {isLoading ? "Retrying..." : "Retry"}
            </button>
          </div>
        )}

        {/* Don't show misleading zero stats before the first successful load */}
        {hasLoadedOnce && <StatsCards tasks={tasks} />}

        {/* Initial loading */}
        {isLoading && !hasLoadedOnce && (
          <div
            className="loading-state"
            role="status"
            aria-live="polite"
          >
            Loading your tasks...
          </div>
        )}

        {/* Initial request failed */}
        {!isLoading && error && !hasLoadedOnce && (
          <div className="initial-error-state" role="alert">
            <h3>Unable to load tasks</h3>
            <p>
              We couldn't connect to the server. Check that the backend
              is running, then try again.
            </p>

            <button
              type="button"
              className="load-more-button"
              onClick={() => fetchTasks(1)}
              disabled={isLoading}
            >
              Try again
            </button>
          </div>
        )}

        {/* Show tasks after at least one successful fetch */}
        {hasLoadedOnce && (
          <>
            {isLoading && (
              <div
                className="loading-indicator"
                role="status"
                aria-live="polite"
              >
                Updating tasks...
              </div>
            )}

            <TaskList
              tasks={tasks}
              filter={filter}
              searchQuery={debouncedSearch}
              onEdit={openEditForm}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onAddTask={openCreateForm}
              updatingTaskId={updatingTaskId}
              deletingTaskId={deletingTaskId}
            />

            {hasMore && (
              <div className="load-more-container">
                <button
                  type="button"
                  className="load-more-button"
                  onClick={loadMoreTasks}
                  disabled={isLoading || isLoadingMore}
                >
                  {isLoadingMore
                    ? "Loading more..."
                    : "Load More Tasks"}
                </button>

                <p className="pagination-info">
                  Showing {tasks.length} of {pagination.totalTasks} tasks
                </p>
              </div>
            )}
          </>
        )}

        {/* Form modal */}
        {isFormOpen && (
          <div
            className="modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeForm();
              }
            }}
          >
            <div
              className="task-modal"
              role="dialog"
              aria-modal="true"
              aria-label={editingTask ? "Edit task" : "Create task"}
            >
              <TaskForm
                key={editingTask?.id || "new-task"}
                task={editingTask}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
                isSubmitting={isSubmitting}
              />

              {formError && (
                <p className="field-error modal-error" role="alert">
                  {formError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
