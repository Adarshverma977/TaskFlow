function Sidebar({ activeFilter, onFilterChange }) {
  const navItems = [
    { id: "all", icon: "▦", label: "All Tasks" },
    { id: "pending", icon: "◷", label: "Pending" },
    { id: "in-progress", icon: "◉", label: "In Progress" },
    { id: "completed", icon: "✓", label: "Completed" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">T</div>

        <div>
          <h2>TaskFlow</h2>
          <span>WORKSPACE</span>
        </div>
      </div>

      <p className="sidebar-label">WORKSPACE</p>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${activeFilter === item.id ? "active" : ""
              }`}
            onClick={() => onFilterChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">R</div>

        <div className="user-info">
          <strong>My Workspace</strong>
          <span>Personal account</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;