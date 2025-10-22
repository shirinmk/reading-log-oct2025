


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import bannerImage from "../assets/images/Reading.png";
import api from "../utils/axios";

const HomePage = () => {
  const [topReaders, setTopReaders] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [school, setSchool] = useState(null);

  const navigate = useNavigate();

  // ✅ Load selected school from localStorage
  useEffect(() => {
    const selected = localStorage.getItem("selectedSchool");
    if (!selected) {
      navigate("/select-school"); // redirect if no school
    } else {
      setSchool(JSON.parse(selected));
    }
  }, [navigate]);

  // ✅ Load top readers filtered by school
  useEffect(() => {
    if (!school) return;

    const loadTopReaders = async () => {
      try {
        const { data } = await api.get(`/readers/top?schoolId=${school._id}`, {
          skipAuthRedirect: true,
        });
        setTopReaders(data.readers || []);
      } catch (err) {
        console.error("Failed to load top readers:", err);
        setTopReaders([]);
      } finally {
        setLoadingTop(false);
      }
    };

    loadTopReaders();
  }, [school]);

  return (
    <div style={{ backgroundColor: "#fce8d5", minHeight: "100vh" }}>
      <Navbar />

      {/* Show school name */}
      {school && (
        <div className="text-center mt-3">
          <h4>🏫 {school.name}</h4>
        </div>
      )}

      {/* Hero Section */}
      <div
        className="hero-section d-flex align-items-center justify-content-center flex-column"
        style={{
          height: "400px",
          width: "100%",
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          className="banner-rectangle p-4"
          style={{
            backgroundColor: "#c298a4",
            borderRadius: "12px",
            maxWidth: "800px",
            width: "90%",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginTop: "220px",
            color: "white",
          }}
        >
          <h1 className="mb-2">
            Welcome To <br />
            Reading Olympiad Program
          </h1>

          <p className="mt-2" style={{ color: "#ffeef5" }}>
            September 1, 2025 – June 30, 2026
          </p>
        </div>
      </div>

      {/* Program Description */}
      <div className="container py-5" style={{ marginTop: "30px" }}>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h3 className="mb-3">About the Program</h3>
                <p className="mb-3">
                  The Reading Olympiad motivates students to build consistent
                  reading habits, reflect on their books, and celebrate
                  progress. Families can add readers, log daily pages, and track
                  achievements throughout the school year.
                </p>
                <ul className="mb-0">
                  <li>
                    🏁 Runs from <strong>Sep 1, 2025</strong> to{" "}
                    <strong>Jun 30, 2026</strong>
                  </li>
                  <li>
                    📚 Log titles, authors, and pages—watch totals grow
                  </li>
                  <li>
                    🎖️ Celebrate milestones and top readers on the leaderboard
                  </li>
                  <li>👨‍👩‍👧 Parents manage readers; teachers view progress</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Top Readers */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-9">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="mb-0">Top Readers</h3>
              <span className="text-muted small">Updated live</span>
            </div>

            {loadingTop ? (
              <div className="card p-4 text-center shadow-sm">
                Loading top readers…
              </div>
            ) : topReaders.length === 0 ? (
              <div className="card p-4 text-center shadow-sm">
                No readers yet. Be the first!
              </div>
            ) : (
              <div className="row g-3">
                {topReaders.map((r, idx) => (
                  <div className="col-md-4" key={r._id || idx}>
                    <div className="card h-100 border-0 shadow-sm">
                      <div
                        className="card-body"
                        style={{
                          borderTop: "5px solid #ff6fa3",
                          borderRadius: "8px 8px 0 0",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span
                            className="badge rounded-pill"
                            style={{
                              background: "#ffe0f0",
                              color: "#a30045",
                            }}
                          >
                            #{idx + 1}
                          </span>
                          <span className="small text-muted">
                            {r.grade ? `Grade ${r.grade}` : r.teacher}
                          </span>
                        </div>
                        <h5 className="mb-1">
                          {r.firstName} {r.lastName}
                        </h5>
                        <p className="text-muted mb-3">{r.teacher}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-semibold">Pages Read</span>
                          <span
                            className="badge rounded-pill"
                            style={{
                              backgroundColor: "#ff6fa3",
                              color: "white",
                              padding: "0.5rem 0.75rem",
                            }}
                          >
                            {r.pagesRead ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
