const STATUSES = [
  {
    id: "all",
    label: "Total Tasks",
    icon: "▦",
    color: "blue",
  },
  {
    id: "pending",
    label: "Pending",
    icon: "◷",
    color: "orange",
  },
  {
    id: "in-progress",
    label: "In Progress",
    icon: "◉",
    color: "purple",
  },
  {
    id: "completed",
    label: "Completed",
    icon: "✓",
    color: "green",
  },
];

function StatsCards({ tasks = [] }) {
  const stats = {
    all: tasks.length,
    pending: tasks.filter(
      (task) => task.status === "pending"
    ).length,
    "in-progress": tasks.filter(
      (task) => task.status === "in-progress"
    ).length,
    completed: tasks.filter(
      (task) => task.status === "completed"
    ).length,
  };

  return (
    <section className="stats-grid" aria-label="Task statistics">
      {STATUSES.map((item) => (
        <article
          className={`stat-card stat-${item.color}`}
          key={item.id}
        >
          <div className="stat-card-top">
            <span className="stat-label">{item.label}</span>

            <span className="stat-icon" aria-hidden="true">
              {item.icon}
            </span>
          </div>

          <strong className="stat-value">
            {stats[item.id]}
          </strong>

          <span className="stat-caption">
            {item.id === "all"
              ? "Tasks in your workspace"
              : `${item.label} tasks`}
          </span>
        </article>
      ))}
    </section>
  );
}

export default StatsCards;