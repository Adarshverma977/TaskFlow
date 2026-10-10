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
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id ?? task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default TaskList;