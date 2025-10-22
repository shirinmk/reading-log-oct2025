import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/resend-verification`,
        { email }
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
    <Navbar />
    <div style={{ backgroundColor: "#fce8d5", minHeight: "100vh" }}>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="card shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
          <div className="card-body text-center p-4">
            <h2 className="card-title mb-3">Resend Verification Email</h2>
            <p className="text-muted mb-4">
              Enter your email below and we’ll send you a new verification link.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control text-center"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Resend Email
              </button>
            </form>

            {/* Success/Error messages */}
            {message && (
              <div className="alert alert-success mt-3" role="alert">
                {message}
              </div>
            )}
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            {/* Back to Sign In */}
            <p className="mt-4 mb-0 text-muted">
              Already verified?{" "}
              <Link to="/sign-in" className="text-primary fw-bold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ResendVerification;
