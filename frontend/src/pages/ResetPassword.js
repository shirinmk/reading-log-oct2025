import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/reset-password/${token}`, { newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3>Reset Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Reset Password</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default ResetPassword;
