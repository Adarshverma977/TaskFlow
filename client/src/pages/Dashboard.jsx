import { useState } from "react";

import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import useTasks from "../hooks/useTasks";

function Dashboard({ filter }) {
  const {
    tasks,
    isLoading,
    isSubmitting,
    error,
    addTask,
    editTask,
    removeTask,
    changeTaskStatus,
  } = useTasks();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formError, setFormError] = useState("");

  const pageTitles = {
    all: "My Tasks",
    pending: "Pending Tasks",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  const pageTitle = pageTitles[filter] || "My Tasks";

  function openCreateForm() {
    setEditingTask(null);
    setFormError("");
    setIsFormOpen(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setFormError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingTask(null);
    setFormError("");
  }

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

  async function handleDeleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await removeTask(id);
    } catch {
      // The hook stores the API error for display.
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await changeTaskStatus(id, status);
    } catch {
      // The hook stores the API error for display.
    }
  }

  return (
    <section className="dashboard">
      <Header
        title={pageTitle}
        onAddTask={openCreateForm}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="dashboard-content">
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        <StatsCards tasks={tasks} />

        {isLoading ? (
          <div className="loading-state" role="status">
            Loading your tasks...
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            filter={filter}
            searchQuery={searchQuery}
            onEdit={openEditForm}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onAddTask={openCreateForm}
          />
        )}
      </div>

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
    </section>
  );
}

export default Dashboard;