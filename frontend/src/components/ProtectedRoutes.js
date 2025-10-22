


import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoutes = ({ children }) => {
  const { user, token, logout, loading } = useContext(AuthContext);
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      // 🚨 Don’t run until AuthContext finishes loading
      if (loading) return;

      console.log("🔍 Checking token:", token, "for user:", user);

      if (!user || !token) {
        console.warn("⚠️ No user or token found in localStorage");
        setValid(false);
        setChecking(false);
        return;
      }

      try {
        const res = await api.get("/protected/check", {
          headers: { Authorization: `Bearer ${token}` },
          params: { t: Date.now() }, // bust cache
        });
        console.log("✅ /check response:", res.data);
        setValid(res.data.valid);
        if (!res.data.valid) logout();
      } catch (err) {
        console.error("❌ Token check failed:", err.response?.data || err.message);
        setValid(false);
        logout();
      }
      setChecking(false);
    };

    checkToken();
  }, [user, token, loading, logout]);

  // 🚨 Important: Wait until both AuthContext and checkToken finish
  if (loading || checking) return <p>Loading...</p>;

  return valid && user ? children : <Navigate to="/sign-in" />;
};

export default ProtectedRoutes;
