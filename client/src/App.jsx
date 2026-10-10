import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [filter, setFilter] = useState("all");

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