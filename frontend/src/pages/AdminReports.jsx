import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";

const AdminReports = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // UX gate (server is the real gate)
  useEffect(() => {
    if (user?.role !== "admin") navigate("/");
  }, [user, navigate]);

  const [tab, setTab] = useState("students"); // 'students' | 'teachers' | 'grades'
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [byTeacher, setByTeacher] = useState([]);
  const [byGrade, setByGrade] = useState([]);

  // filters for students tab
  const [search, setSearch] = useState("");
  const filteredStudents = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return students;
    return students.filter((r) =>
      [r.firstName, r.lastName, r.teacher, r.grade]
        .filter(Boolean)
        .some((x) => String(x).toLowerCase().includes(s))
    );
  }, [students, search]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      api.get("/admin/reports/readers"), // students
      api.get("/admin/reports/by-teacher"), // group
      api.get("/admin/reports/by-grade"), // group
    ])
      .then(([a, b, c]) => {
        if (!mounted) return;
        // setStudents(a.data.items || []);
        // setByTeacher(b.data.items || []);
        // setByGrade(c.data.items || []);
        setStudents(a.data || []);
        setByTeacher(b.data || []);
        setByGrade(c.data || []);
      })
      .catch((e) => {
        console.error("Admin reports load error:", e);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  // const handleSignOut = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   window.location.href = "/admin/login";
  // };

  return (
    <div style={{ backgroundColor: "#fce8d5", minHeight: "100vh",paddingTop: "80px"}}>
    <div className="container" style={{ paddingTop: 80 }}>
{/*       
                    <button
                      className=" btn btn-outline-primary"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button> */}
                
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 m-0">Admin Reports</h1>
        <div className="btn-group">
          <button
            className={`btn btn-sm ${
              tab === "students" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTab("students")}
          >
            Students
          </button>
          <button
            className={`btn btn-sm ${
              tab === "teachers" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTab("teachers")}
          >
            By Teacher
          </button>
          <button
            className={`btn btn-sm ${
              tab === "grades" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTab("grades")}
          >
            By Grade
          </button>
        </div>
      </div>

      {tab === "students" && (
        <>
          <div className="card p-3 mb-3 shadow-sm">
            <div className="row g-2">
              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Search name/teacher/grade…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-8 text-end">
                <small className="text-muted">
                  Showing {filteredStudents.length} of {students.length}
                </small>
              </div>
            </div>
          </div>

          <div className="card p-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Teacher</th>
                    <th>Grade</th>
                    <th className="text-end">Pages Read ↓</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center p-4">
                        Loading…
                      </td>
                    </tr>
                  ) : filteredStudents.length ? (
                    filteredStudents.map((r, i) => (
                      <tr key={`${r._id}-${i}`}>
                        <td>{i + 1}</td>
                        <td>
                          {r.firstName} {r.lastName}
                        </td>
                        <td>{r.teacher || "—"}</td>
                        <td>{r.grade || "—"}</td>
                        <td className="text-end fw-semibold">
                          {r.pagesRead ?? 0}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center p-4">
                        No results.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "teachers" && (
        <div className="card p-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Teacher</th>
                  <th className="text-end">Students</th>
                  <th className="text-end">Total Pages</th>
                  <th className="text-end">Avg Pages</th>
                  <th>Top Reader</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      Loading…
                    </td>
                  </tr>
                ) : byTeacher.length ? (
                  byTeacher.map((row, i) => (
                    <tr key={`${row.teacher}-${i}`}>
                      <td>{i + 1}</td>
                      <td>{row.teacher || "—"}</td>
                      <td className="text-end">{row.students}</td>
                      <td className="text-end fw-semibold">{row.totalPages}</td>
                      <td className="text-end">{row.avgPages}</td>
                      <td>
                        {row.topReader
                          ? `${row.topReader.firstName} ${
                              row.topReader.lastName
                            } (${row.topReader.pagesRead ?? 0})`
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      No data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "grades" && (
        <div className="card p-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Grade</th>
                  <th className="text-end">Students</th>
                  <th className="text-end">Total Pages</th>
                  <th className="text-end">Avg Pages</th>
                  <th>Top Reader</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      Loading…
                    </td>
                  </tr>
                ) : byGrade.length ? (
                  byGrade.map((row, i) => (
                    <tr key={`${row.grade}-${i}`}>
                      <td>{i + 1}</td>
                      <td>{row.grade || "—"}</td>
                      <td className="text-end">{row.students}</td>
                      <td className="text-end fw-semibold">{row.totalPages}</td>
                      <td className="text-end">{row.avgPages}</td>
                      <td>
                        {row.topReader
                          ? `${row.topReader.firstName} ${
                              row.topReader.lastName
                            } (${row.topReader.pagesRead ?? 0})`
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      No data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
{/* 
      <div className="mt-3">
        <Link to="/dashboard" className="btn btn-outline-secondary btn-sm">
          Back to Dashboard
        </Link>
      </div> */}
    </div>
    </div>
  );
};

export default AdminReports;
