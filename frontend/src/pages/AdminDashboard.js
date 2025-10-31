// // import React, { useState } from "react";
// // import AdminReports from "./AdminReports";
// // import AdminLibraryDashboard from "./AdminLibraryDashboard";

// // const AdminDashboard = () => {
// //   const [activeTab, setActiveTab] = useState("reports");

// //   return (
// //     <div className="container mt-4">
// //       <h2>Admin Dashboard</h2>

// //       <ul className="nav nav-tabs mt-3">
// //         <li className="nav-item">
// //           <button
// //             className={`nav-link ${activeTab === "reports" ? "active" : ""}`}
// //             onClick={() => setActiveTab("reports")}
// //           >
// //             📊 Reports
// //           </button>
// //         </li>
// //         <li className="nav-item">
// //           <button
// //             className={`nav-link ${activeTab === "library" ? "active" : ""}`}
// //             onClick={() => setActiveTab("library")}
// //           >
// //             📚 Library
// //           </button>
// //         </li>
// //       </ul>

// //       <div className="tab-content mt-3">
// //         {activeTab === "reports" && (
// //           <div className="tab-pane active">
// //             <AdminReports />
// //           </div>
// //         )}
// //         {activeTab === "library" && (
// //           <div className="tab-pane active">
// //             <AdminLibraryDashboard />
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

// import React, { useState, useRef } from "react";
// import AdminReports from "./AdminReports";
// import AdminLibraryDashboard from "./AdminLibraryDashboard";

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState("reports");

//   // ✅ References to child components to trigger export
//   const reportsRef = useRef();
//   const libraryRef = useRef();

//   // ✅ Unified export handler
//   const handleExport = () => {
//     if (activeTab === "reports" && reportsRef.current?.exportData) {
//       reportsRef.current.exportData();
//     } else if (activeTab === "library" && libraryRef.current?.exportData) {
//       libraryRef.current.exportData();
//     } else {
//       alert("No data available to export.");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h2>Admin Dashboard</h2>
//         <button
//           className="btn btn-success fw-bold"
//           onClick={handleExport}
//           type="button"
//           style={{
//             backgroundColor: "#28a745",
//             borderColor: "#28a745",
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//           }}
//         >
//           📤 Export Excel
//         </button>
//       </div>

//       {/* Tabs */}
//       <ul className="nav nav-tabs mt-3">
//         <li className="nav-item">
//           <button
//             className={`nav-link ${activeTab === "reports" ? "active" : ""}`}
//             onClick={() => setActiveTab("reports")}
//           >
//             📊 Reports
//           </button>
//         </li>
//         <li className="nav-item">
//           <button
//             className={`nav-link ${activeTab === "library" ? "active" : ""}`}
//             onClick={() => setActiveTab("library")}
//           >
//             📚 Library
//           </button>
//         </li>
//       </ul>

//       {/* Tabs Content */}
//       <div className="tab-content mt-3">
//         {activeTab === "reports" && (
//           <div className="tab-pane active">
//             {/* ✅ Forward ref for export */}
//             <AdminReports ref={reportsRef} />
//           </div>
//         )}
//         {activeTab === "library" && (
//           <div className="tab-pane active">
//             <AdminLibraryDashboard ref={libraryRef} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useRef } from "react";
import AdminReports from "./AdminReports";
import AdminLibraryDashboard from "./AdminLibraryDashboard";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const reportsRef = useRef();
  const libraryRef = useRef();

  const handleExport = () => {
    if (activeTab === "reports" && reportsRef.current?.exportData) {
      reportsRef.current.exportData();
    } else if (activeTab === "library" && libraryRef.current?.exportData) {
      libraryRef.current.exportData();
    } else {
      alert("No data available to export.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Dashboard</h2>
        <button
          className="btn btn-success fw-bold"
          onClick={handleExport}
          type="button"
          style={{
            backgroundColor: "#28a745",
            borderColor: "#28a745",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          📤 Export Excel
        </button>
      </div>

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
            <AdminReports ref={reportsRef} />
          </div>
        )}
        {activeTab === "library" && (
          <div className="tab-pane active">
            <AdminLibraryDashboard ref={libraryRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
