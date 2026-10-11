function EmptyState({ filter, searchQuery = "", onAddTask }) {
  const hasSearch = searchQuery.trim().length > 0;

  const messages = {
    all: {
      title: "Nothing here yet",
      description: "Your workspace is ready for its first task.",
      action: "Create your first task",
    },
    pending: {
      title: "No pending tasks",
      description: "You're all caught up on pending tasks.",
      action: "Create a task",
    },
    "in-progress": {
      title: "Nothing in progress",
      description: "Start a task when you're ready to work on it.",
      action: "Create a task",
    },
    completed: {
      title: "No completed tasks yet",
      description: "Tasks you finish will appear here.",
      action: "Create a task",
    },
  };

  const currentMessage = messages[filter] || messages.all;

  return (
    <section
      className="empty-state"
      aria-labelledby="empty-state-title"
    >
      <div className="empty-state-icon" aria-hidden="true">
        {hasSearch ? "⌕" : filter === "completed" ? "✓" : "＋"}
      </div>

      <h3 id="empty-state-title">
        {hasSearch ? "No matching tasks found" : currentMessage.title}
      </h3>

      <p>
        {hasSearch
          ? `We couldn't find tasks matching "${searchQuery.trim()}". Try a different keyword.`
          : currentMessage.description}
      </p >

{
  hasSearch?(
        <p className = "empty-state-hint" >
      Check the spelling or try a shorter search.
        </p>
      ) : (
  <button
    type="button"
    className="add-task-button"
    onClick={onAddTask}
  >
    <span aria-hidden="true">+</span>
    {currentMessage.action}
  </button>
)}
    </section >
  );
}

export default EmptyState;
