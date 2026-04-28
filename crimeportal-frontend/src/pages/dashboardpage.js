import React from "react";
import Dashboard from "./dashboard";
import "../styles/page.css";

function DashboardPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Crime Portal</h1>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/reports">Reports</a>
          <a href="/login">Login</a>
        </nav>
      </header>

      <main className="page-content">
        <Dashboard />
      </main>

      <footer className="page-footer">
        <p>© 2026 Crime Portal</p>
      </footer>
    </div>
  );
}

export default  DashboardPage;