


// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import api from "../utils/axios";

// const ICONS = {
//   medal: "🥇",
//   trophy: "🏆",
//   star: "⭐",
//   crown: "👑",
//   rocket: "🚀",
// };

// const BadgesPage = () => {
//   const { id } = useParams(); // reader id
//   const [data, setData] = useState({ name: "", pagesRead: 0, badges: [] });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await api.get(`/readers/${id}/badges`);
//         setData({
//           name: res.data.name,
//           pagesRead: res.data.pagesRead,
//           badges: res.data.badges || [],
//         });
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [id]);

//   const totalPoints = data.badges.reduce((s, b) => s + (b.points || 0), 0);

//   return (
//     <div style={{backgroundColor: "#fce8d5",minHeight: "100vh"}}> 
//     <div className="container" style={{ paddingTop: 80 }}>
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         <h1 className="h3 m-0">{data.name} — Badges</h1>
//         <Link to={`/dashboard?rid=${id}`} className="btn btn-outline-secondary" style={{backgroundColor: "#f3c791ff"}}>
//           Back to Reader
//         </Link>
//       </div>

//       {loading ? (
//         <div className="card p-4 shadow-sm">Loading badges…</div>
//       ) : (
//         <>
//           <div className="card p-3 mb-4 shadow-sm">
//             <div className="d-flex justify-content-between">
//               <div>
//                 <strong>Pages Read:</strong> {data.pagesRead}
//               </div>
//               <div>
//                 <strong>Total Points:</strong> {totalPoints}
//               </div>
//               <div>
//                 <strong>Badges Earned:</strong> {data.badges.length}
//               </div>
//             </div>
//           </div>

//           {data.badges.length === 0 ? (
//             <div className="card p-4 text-center shadow-sm">
//               No badges yet. Keep reading!
//             </div>
//           ) : (
//             <div className="row g-3">
//               {data.badges
//                 .sort((a, b) => a.level - b.level)
//                 .map((b, idx) => (
//                   <div className="col-md-4" key={`${b.level}-${idx}`}>
//                     <div className="card h-100 border-0 shadow-sm">
//                       <div className="card-body">
//                         <div className="d-flex align-items-center justify-content-between mb-2">
//                           <span className="fs-3">{ICONS[b.icon] || "🏅"}</span>
//                           <span className="badge rounded-pill bg-light text-dark">
//                             {b.points ?? 0} pts
//                           </span>
//                         </div>
//                         <h5 className="card-title mb-1">
//                           Level {b.level * 100} Pages
//                         </h5>
//                         <p className="text-muted mb-2">
//                           Earned:{" "}
//                           {b.earnedAt
//                             ? new Date(b.earnedAt).toLocaleString()
//                             : "—"}
//                         </p>
//                         <p className="mb-0">
//                           Keep it up! Next badge at {(b.level + 1) * 100} pages.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//     </div>
//   );
// };

// export default BadgesPage;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BadgesPage = () => {
  const { id } = useParams(); // readerId
  const navigate = useNavigate();
  const [reader, setReader] = useState(null);
  const [badges, setBadges] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/readers/${id}/badges`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setReader(res.data);
        setBadges(res.data.badges || []);
      } catch (err) {
        console.error("Error loading badges:", err);
      }
    };
    fetchBadges();
  }, [id]);

  if (!reader) return <div>Loading...</div>;

  // ✅ Calculate totals dynamically
  const totalBadges = badges.length;
  const totalPoints = badges.reduce((sum, b) => sum + (b.points || 0), 0);
  const nextTarget = Math.ceil(reader.pagesRead / 100) * 100 + 100;

  return (
    <div style={{ backgroundColor: "#ffe0c1", minHeight: "100vh", padding: "2rem" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "#d39e6a",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "8px 14px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        Back to Reader
      </button>

      <h2 style={{ textTransform: "capitalize" }}>
        {reader.name} — Badges
      </h2>

      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        <span>Pages Read: {reader.pagesRead}</span>
        <span>Total Points: {totalPoints}</span>
        <span>Badges Earned: {totalBadges}</span>
      </div>

      {badges.length === 0 ? (
        <p>No badges yet. Keep reading to earn your first one!</p>
      ) : (
        badges.map((badge) => (
          <div
            key={badge.level}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h4>🏅 Level {badge.level * 100} Pages</h4>
            <p>Earned: {new Date(badge.earnedAt).toLocaleString()}</p>
            <p>Points: {badge.points}</p>
            <p>
              Keep it up! Next badge at {nextTarget} pages.
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default BadgesPage;
