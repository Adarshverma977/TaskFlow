import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";

function TaskList({
  tasks = [],
  filter = "all",
  searchQuery = "",
  onEdit,
  onDelete,
  onStatusChange,
  onAddTask,
  updatingTaskId = null,
  deletingTaskId = null,
  sortBy = "newest",
}) {
  // Step 1: Filter tasks according to selected status
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") {
      return true;
    }

    return task.status === filter;
  });

  // Step 2: Search within filtered tasks
  const visibleTasks = filteredTasks.filter((task) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      task.title.toLowerCase().includes(query) ||
      (task.description || "").toLowerCase().includes(query)
    );
  });

  // 3.Sorting tasks based on selection
  const sortedTasks = [...visibleTasks].sort((a, b) => {
    if (sortBy === "newest") {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();

      return dateB - dateA;
    }

    if (sortBy === "dueDate") {
      // Tasks without a due date should appear last.
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return new Date(a.dueDate) - new Date(b.dueDate);
    }

    if (sortBy === "priority") {
      const priorityOrder = {
        high: 3,
        medium: 2,
        low: 1,
      };

      return (
        (priorityOrder[b.priority] || 0) -
        (priorityOrder[a.priority] || 0)
      );
    }
    return 0;
  });


  return (
    <section className="tasks-section">
      <div className="section-heading">
        <div>
          <h2>Task Overview</h2>
          <p>Manage and track your work</p>
        </div>

        <span className="task-count">
          {visibleTasks.length}{" "}
          {visibleTasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {visibleTasks.length === 0 ? (
        <EmptyState
          filter={filter}
          searchQuery={searchQuery}
          onAddTask={onAddTask}
        />
      ) : (
        <div className="task-list">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id ?? task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              isUpdating={updatingTaskId === (task.id ?? task._id)}
              isDeleting={deletingTaskId === (task.id ?? task._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default TaskList;