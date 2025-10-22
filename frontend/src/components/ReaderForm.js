import React, { useState } from "react";
import axios from "axios";
import { teachers } from "../constants/teachers";

const ReaderForm = ({ onReaderAdded }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [teacher, setTeacher] = useState(teachers[0]);
  const [grade, setGrade] = useState("1");
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE}/api/readers`,
        { firstName, lastName, teacher, grade },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("Reader added successfully!");
      setFirstName("");
      setLastName("");
      setTeacher(teachers[0]);
      setGrade("1");

      if (onReaderAdded) onReaderAdded(res.data.reader);
    } catch (error) {
      console.error(error);
      alert("Error adding reader");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-light">
      <h3>Add Reader</h3>

      <div className="mb-3">
        <label className="form-label">First Name</label>
        <input
          type="text"
          className="form-control"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Last Name</label>
        <input
          type="text"
          className="form-control"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      {/* ✅ Grade selection */}
      {/* <div className="mb-3">
        <label className="form-label">Grade</label>
        <select
          className="form-select"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
        >
          <option value="1">Grade 1</option>
          <option value="2">Grade 2</option>
          <option value="3">Grade 3</option>
          <option value="4">Grade 4</option>
          <option value="5">Grade 5</option>
          <option value="6">Grade 6</option>
        </select>
      </div> */}

      <div className="mb-3">
  <label className="form-label">Grade</label>
  <select
    className="form-select"
    value={grade}
    onChange={(e) => setGrade(e.target.value)}
    required
  >
    <option value="">Select Grade</option>
    {[1, 2, 3, 4, 5, 6].map((g) => (
      <option key={g} value={g}>
        Grade {g}
      </option>
    ))}
  </select>
</div>


      <div className="mb-3">
        <label className="form-label">Teacher</label>
        <select
          className="form-select"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
        >
          {teachers.map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">Add Reader</button>
    </form>
  );
};

export default ReaderForm;
