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
}) {
  const hasSearch = searchQuery.trim().length > 0;

  return (
    <section className="tasks-section">
      <div className="section-heading">
        <div>
          <h2>Task Overview</h2>
          <p>Manage and track your work</p>
        </div>

        <span className="task-count">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          filter={filter}
          searchQuery={searchQuery}
          onAddTask={onAddTask}
        />
      ) : (
        <div className="task-list">
          {tasks.map((task) => {
            const taskId = task.id ?? task._id;

            return (
              <TaskCard
                key={taskId}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                isUpdating={updatingTaskId === taskId}
                isDeleting={deletingTaskId === taskId}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default TaskList;
