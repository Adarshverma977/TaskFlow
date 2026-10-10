
function formatDueDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}


function TaskCard({ task, onEdit, onDelete, onStatusChange, isUpdating = false, isDeleting = false, isDisabled = false}) {

  const { title, description, priority, status, dueDate } = task;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDateObject = dueDate ? new Date(dueDate) : null;

  const isOverdue =
    dueDateObject &&
    !Number.isNaN(dueDateObject.getTime()) &&
    dueDateObject < today &&
    status !== "completed";


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
            <span className={`due-date ${isOverdue ? "overdue" : ""}`}>
              {isOverdue ? "Overdue · " : "Due "}
              {formatDueDate(dueDate)}
            </span>
          )}

        </div>
      </div>

      <div className="task-card-actions">
        <label className="status-control">
          <span className="visually-hidden">Change task status</span>

          <select
            value={status}
            disabled={isDisabled || isUpdating}
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
          disabled={isDisabled || isUpdating || isDeleting}
          aria-label={`Edit ${title}`}
          title="Edit task"
        >
          {isUpdating ? "Saving..." : "✎"}
        </button>

        <button
          type="button"
          className="icon-button delete-button"
          onClick={() => onDelete(task.id)}
          disabled={isDisabled || isUpdating || isDeleting}
          aria-label={`Delete ${title}`}
          title="Delete task"
        >
          {isDeleting ? "..." : "×"}
        </button>
      </div>
    </article>
  );
}

export default TaskCard;