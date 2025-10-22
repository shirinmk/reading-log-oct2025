import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

// Add token to every request if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired/invalid token globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       // Redirect to login page
//       window.location.href = "/sign-in"; //check from App.js the path // you can also find it by looking at url
    
//     }
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const skip = error?.config?.skipAuthRedirect; // ⬅️ opt-out per request
    // if (status === 401 && !skip) {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("user");
    //   window.location.href = "/sign-in";
    // }
    if (status === 401 && !skip) {
  console.warn("Auth error, keeping token for now:", error.response?.data);
  // Don’t auto-remove token; let ProtectedRoutes decide
}

    return Promise.reject(error);
  }
);

export default api;
