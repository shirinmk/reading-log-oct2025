// src/pages/SignIn.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setNeedsVerification(false);

    try {
      const res = await api.post("/auth/login", formData);

      // Save user + token
      // login(res.data); // res.data = { token, user }
      login({ user: res.data.user, token: res.data.token });

      setMessage(`Welcome ${res.data.user.firstName}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Login failed";
      setMessage(errMsg);

      // If error is about verification → show resend link
      if (errMsg.toLowerCase().includes("verify")) {
        setNeedsVerification(true);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{ backgroundColor: "#fce8d5", minHeight: "100vh", paddingTop: "80px" }}
      >
        <div className="container mt-2" style={{ maxWidth: "400px" }}>
          <h2 className="text-center mb-4">Sign In</h2>

          <form onSubmit={handleSubmit}>
            {/* Email/Username */}
            <div className="mb-3">
              <label className="form-label">Email or Username</label>
              <input
                type="text"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Support Links */}
            <div className="text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link> |{" "}
              <Link to="/forgot-username">Forgot Username?</Link> |{" "}
              <Link to="/contact-support">Contact Support</Link>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Sign In
            </button>
          </form>

          {/* Messages */}
          {message && (
            <div className="alert alert-info mt-3 text-center">{message}</div>
          )}

          {/* Show resend verification only if needed */}
          {needsVerification && (
            <p className="text-center mt-3 text-danger">
              Please verify your email before logging in.{" "}
              <Link to="/resend-verification" className="text-primary">
                Resend Verification Email
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default SignIn;
