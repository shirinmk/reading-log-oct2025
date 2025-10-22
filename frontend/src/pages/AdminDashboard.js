import React, { useState } from "react";
import AdminReports from "./AdminReports";
import AdminLibraryDashboard from "./AdminLibraryDashboard";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("reports");

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>

      <ul className="nav nav-tabs mt-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            📊 Reports
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "library" ? "active" : ""}`}
            onClick={() => setActiveTab("library")}
          >
            📚 Library
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3">
        {activeTab === "reports" && (
          <div className="tab-pane active">
            <AdminReports />
          </div>
        )}
        {activeTab === "library" && (
          <div className="tab-pane active">
            <AdminLibraryDashboard />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
