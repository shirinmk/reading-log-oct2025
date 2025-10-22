


import { useState } from "react";
import axios from "axios";

const AddReader = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [grade, setGrade] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        `${API_BASE}/api/readers`,
        { firstName, lastName, teacher, grade }, // ✅ send all required fields
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(res.data.message);
      setFirstName("");
      setLastName("");
      setTeacher("");
      setGrade("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Reader</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Teacher</label>
          <input
            type="text"
            className="form-control"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Grade</label>
          <select
            className="form-control"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          >
            <option value="">Select grade</option>
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd</option>
            <option value="4">4th</option>
            <option value="5">5th</option>
            <option value="6">6th</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Reader
        </button>
      </form>
    </div>
  );
};

export default AddReader;
