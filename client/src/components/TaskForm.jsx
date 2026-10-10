import { useEffect, useState } from "react";

const initialFormData = {
  title: "",
  description: "",
  priority: "medium",
  status: "pending",
  dueDate: "",
};

function TaskForm({ task, onSubmit, onCancel, isSubmitting = false }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(task);

  // Populate the form when editing a task
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "pending",
        dueDate: task.dueDate
          ? String(task.dueDate).slice(0, 10)
          : "",
      });
    } else {
      setFormData(initialFormData);
    }

    setErrors({});
  }, [task]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Task title is required.";
    } else if (formData.title.trim().length < 3) {
      nextErrors.title = "Title must contain at least 3 characters.";
    }

    if (formData.title.trim().length > 100) {
      nextErrors.title = "Title cannot exceed 100 characters.";
    }

    if (formData.description.length > 1000) {
      nextErrors.description =
        "Description cannot exceed 1000 characters.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate || null,
    });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <div>
          <h2>{isEditing ? "Edit Task" : "Create a Task"}</h2>
          <p>
            {isEditing
              ? "Update the details of your task."
              : "Add a new task to your workspace."}
          </p>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={onCancel}
          aria-label="Close task form"
        >
          ×
        </button>
      </div>

      <div className="form-field">
        <label htmlFor="title">Task title *</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="e.g. Build the dashboard"
          value={formData.title}
          onChange={handleChange}
          maxLength={100}
          required
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && (
          <span className="field-error">{errors.title}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="What needs to be done?"
          value={formData.description}
          onChange={handleChange}
          maxLength={1000}
          rows={4}
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description && (
          <span className="field-error">{errors.description}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="dueDate">Due date</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="add-task-button"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Create Task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;