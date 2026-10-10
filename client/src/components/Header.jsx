function Header({ title, onAddTask, searchQuery, onSearchChange }) {
  return (
    <header className="dashboard-header">
      <div className="header-heading">
        <p className="header-eyebrow">WORKSPACE / TASKS</p>
        <h1>{title}</h1>
        <p className="header-subtitle">
          Organize your work. Get things done.
        </p>
      </div>

      <div className="header-actions">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>

          <input
            type="search"
            placeholder="Search tasks..."
            aria-label="Search tasks"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />

          <kbd>⌕</kbd>
        </label>

        <button
          type="button"
          className="add-task-button"
          onClick={onAddTask}
        >
          <span aria-hidden="true">+</span>
          Add Task
        </button>
      </div>
    </header>
  );
}

export default Header;