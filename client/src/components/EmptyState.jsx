function EmptyState({ filter, searchQuery, onAddTask }) {
  const hasSearch = searchQuery.trim().length > 0;

  const messages = {
    all: "Your workspace is ready for its first task.",
    pending: "You have no pending tasks right now.",
    "in-progress": "No tasks are currently in progress.",
    completed: "Completed tasks will appear here.",
  };

  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        {hasSearch ? "⌕" : "✓"}
      </div>

      <h3>
        {hasSearch ? "No matching tasks" : "Nothing here yet"}
      </h3>

      <p>
        {hasSearch
          ? "Try another search term."
          : messages[filter] || messages.all}
      </p>

      {!hasSearch && (
        <button
          type="button"
          className="add-task-button"
          onClick={onAddTask}
        >
          <span aria-hidden="true">+</span>
          Create your first task
        </button>
      )}
    </div>
  );
}

export default EmptyState;