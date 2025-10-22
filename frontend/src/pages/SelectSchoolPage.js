


import React, { useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

const SelectSchoolPage = ({ setSchoolId }) => {
  const [schoolCode, setSchoolCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.get(`/schools/by-code/${schoolCode.trim()}`);

      if (!data || !data._id) throw new Error("Invalid school data");

      // ✅ Save in localStorage
      localStorage.setItem("schoolId", data._id);
      localStorage.setItem("selectedSchool", JSON.stringify(data));

      // ✅ Update parent (App.js)
      setSchoolId(data._id);

      console.log("✅ School saved:", data);
      navigate("/"); // redirect home
    } catch (err) {
      console.error("School select error:", err);
      setError("❌ Invalid or unknown school code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-3">🏫 Select Your School</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            value={schoolCode}
            onChange={(e) => setSchoolCode(e.target.value)}
            placeholder="Enter School Code (e.g. ISSD2025)"
            required
          />
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default SelectSchoolPage;
