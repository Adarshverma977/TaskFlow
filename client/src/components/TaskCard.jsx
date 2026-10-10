function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const { title, description, priority, status, dueDate } = task;

  const statusLabels = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  const priorityLabels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return (
    <article className="task-card">
      <div className="task-card-main">
        <div className="task-title-row">
          <h3>{title}</h3>

          <span className={`priority-badge ${priority}`}>
            {priorityLabels[priority] || "Medium"}
          </span>
        </div>

        <p className="task-description">
          {description || "No description provided."}
        </p>

        <div className="task-meta">
          <span className={`status-badge ${status}`}>
            {statusLabels[status] || "Pending"}
          </span>

          {dueDate && (
            <span className="due-date">
              Due {dueDate}
            </span>
          )}
        </div>
      </div>

      <div className="task-card-actions">
        <label className="status-control">
          <span className="visually-hidden">Change task status</span>

          <select
            value={status}
            onChange={(event) =>
              onStatusChange(task.id, event.target.value)
            }
            aria-label={`Change status of ${title}`}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <button
          type="button"
          className="icon-button"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${title}`}
          title="Edit task"
        >
          ✎
        </button>

        <button
          type="button"
          className="icon-button delete-button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${title}`}
          title="Delete task"
        >
          ×
        </button>
      </div>
    </article>
  );
}

export default TaskCard;