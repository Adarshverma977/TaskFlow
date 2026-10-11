
import { useState } from "react";
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

function App() {
  const [filter, setFilter] = useState(getInitialFilter);

  return (
    <div className="app-layout">
      <Sidebar
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <main className="main-content">
        <Dashboard filter={filter} />
      </main>
    </div>
  );
}

export default App;
