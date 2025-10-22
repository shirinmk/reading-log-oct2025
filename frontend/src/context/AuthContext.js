


// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
    } catch (err) {
      console.error("AuthContext load error:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    setLoading(false);
  }, []);

  /**
   * Login function - accepts either:
   * login(res.data)  -> { token, user }
   * or
   * login({ user, token })
   */
  const login = (data) => {
    const tokenVal = data?.token;
    const userVal = data?.user;

    if (!tokenVal || !userVal) {
      console.error("⚠️ Invalid login payload:", data);
      return;
    }

    setUser(userVal);
    setToken(tokenVal);

    localStorage.setItem("user", JSON.stringify(userVal));
    localStorage.setItem("token", tokenVal);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
