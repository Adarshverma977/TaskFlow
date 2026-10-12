
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function getInitialFilter() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");

  const validFilters = [
    "all",
    "pending",
    "in-progress",
    "completed",
  ];

  return validFilters.includes(status) ? status : "all";
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem("taskflow-theme");

  return savedTheme === "dark" ? "dark" : "light";
}

function App() {
  const [filter, setFilter] = useState(getInitialFilter);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("taskflow-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeFilter={filter}
        onFilterChange={setFilter}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      <main className="main-content">
        <Dashboard filter={filter} />
      </main>
    </div>
  );
}

export default App;
