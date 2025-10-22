


import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/axios";

const ICONS = {
  medal: "🥇",
  trophy: "🏆",
  star: "⭐",
  crown: "👑",
  rocket: "🚀",
};

const BadgesPage = () => {
  const { id } = useParams(); // reader id
  const [data, setData] = useState({ name: "", pagesRead: 0, badges: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/readers/${id}/badges`);
        setData({
          name: res.data.name,
          pagesRead: res.data.pagesRead,
          badges: res.data.badges || [],
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const totalPoints = data.badges.reduce((s, b) => s + (b.points || 0), 0);

  return (
    <div style={{backgroundColor: "#fce8d5",minHeight: "100vh"}}> 
    <div className="container" style={{ paddingTop: 80 }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 m-0">{data.name} — Badges</h1>
        <Link to={`/dashboard?rid=${id}`} className="btn btn-outline-secondary" style={{backgroundColor: "#f3c791ff"}}>
          Back to Reader
        </Link>
      </div>

      {loading ? (
        <div className="card p-4 shadow-sm">Loading badges…</div>
      ) : (
        <>
          <div className="card p-3 mb-4 shadow-sm">
            <div className="d-flex justify-content-between">
              <div>
                <strong>Pages Read:</strong> {data.pagesRead}
              </div>
              <div>
                <strong>Total Points:</strong> {totalPoints}
              </div>
              <div>
                <strong>Badges Earned:</strong> {data.badges.length}
              </div>
            </div>
          </div>

          {data.badges.length === 0 ? (
            <div className="card p-4 text-center shadow-sm">
              No badges yet. Keep reading!
            </div>
          ) : (
            <div className="row g-3">
              {data.badges
                .sort((a, b) => a.level - b.level)
                .map((b, idx) => (
                  <div className="col-md-4" key={`${b.level}-${idx}`}>
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="fs-3">{ICONS[b.icon] || "🏅"}</span>
                          <span className="badge rounded-pill bg-light text-dark">
                            {b.points ?? 0} pts
                          </span>
                        </div>
                        <h5 className="card-title mb-1">
                          Level {b.level * 100} Pages
                        </h5>
                        <p className="text-muted mb-2">
                          Earned:{" "}
                          {b.earnedAt
                            ? new Date(b.earnedAt).toLocaleString()
                            : "—"}
                        </p>
                        <p className="mb-0">
                          Keep it up! Next badge at {(b.level + 1) * 100} pages.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
    </div>
  );
};

export default BadgesPage;
