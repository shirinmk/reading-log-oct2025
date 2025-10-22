import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
console.log(API_BASE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending reset email");
    }
  };

  return (
    <>
    <Navbar />
    <div style={{ backgroundColor: "#fce8d5", minHeight: "100vh",paddingTop: "80px" }}>
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3>Forgot Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
    </div>
    </>
  );
};

export default ForgotPassword;
