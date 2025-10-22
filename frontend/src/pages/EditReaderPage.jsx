import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";

const EditReaderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    grade: "",
    teacher: "",
  });

  const [teachers, setTeachers] = useState([]);
  const [grades, setGrades] = useState([]);

  // Load reader info
  useEffect(() => {
    const fetchReader = async () => {
      try {
        const res = await api.get(`/readers/${id}`);
        setForm(res.data.reader);
      } catch (err) {
        console.error("Error loading reader:", err);
      }
    };
    fetchReader();
  }, [id]);

  // Load teachers and grades lists
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [t, g] = await Promise.all([
          api.get("/readers/teachers"),
          api.get("/readers/grades"),
        ]);
        setTeachers(t.data.teachers || []);
        setGrades(g.data.grades || []);
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/readers/${id}`, form);
      alert("Reader updated!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <h2 className="mb-4">Edit Reader</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Grade</label>
            <select
              name="grade"
              value={form.grade}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select grade...</option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Teacher</label>
            <select
              name="teacher"
              value={form.teacher}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select teacher...</option>
              {teachers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditReaderPage;
