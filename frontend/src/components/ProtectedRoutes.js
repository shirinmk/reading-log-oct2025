


// import { useContext, useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import api from "../utils/axios";
// import { AuthContext } from "../context/AuthContext";

// const ProtectedRoutes = ({ children }) => {
//   const { user, token, logout, loading } = useContext(AuthContext);
//   const [checking, setChecking] = useState(true);
//   const [valid, setValid] = useState(false);

//   useEffect(() => {
//     const checkToken = async () => {
//       // 🚨 Don’t run until AuthContext finishes loading
//       if (loading) return;

//       console.log("🔍 Checking token:", token, "for user:", user);

//       if (!user || !token) {
//         console.warn("⚠️ No user or token found in localStorage");
//         setValid(false);
//         setChecking(false);
//         return;
//       }

//       try {
//         const res = await api.get("/protected/check", {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { t: Date.now() }, // bust cache
//         });
//         console.log("✅ /check response:", res.data);
//         setValid(res.data.valid);
//         if (!res.data.valid) logout();
//       } catch (err) {
//         console.error("❌ Token check failed:", err.response?.data || err.message);
//         setValid(false);
//         logout();
//       }
//       setChecking(false);
//     };

//     checkToken();
//   }, [user, token, loading, logout]);

//   // 🚨 Important: Wait until both AuthContext and checkToken finish
//   if (loading || checking) return <p>Loading...</p>;

//   return valid && user ? children : <Navigate to="/sign-in" />;
// };

// export default ProtectedRoutes;


import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";

export default function ProtectedRoute({ children, requiredRole }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setAuthorized(false);

      try {
        const res = await api.get("/auth/check", { skipAuthRedirect: true });
        const user = res.data.user;
        if (requiredRole && user.role !== requiredRole) {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
      } catch {
        setAuthorized(false);
      }
    };
    check();
  }, [requiredRole]);

  if (authorized === null) return null; // can replace with a spinner
  if (!authorized) {
    // Redirect admins vs parents properly
    return <Navigate to={requiredRole === "admin" ? "/admin/login" : "/sign-in"} replace />;
  }

  return children;
}
