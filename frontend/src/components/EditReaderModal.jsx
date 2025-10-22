import React, { useEffect, useState } from "react";
import api from "../utils/axios";

const EditReaderModal = ({ readerId, onClose, onSave }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    teacher: "",
    grade: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load reader data + teachers/grades when modal opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reader
        const { data } = await api.get(`/readers/${readerId}`);
        const reader = data.reader;
        setForm({
          firstName: reader.firstName || "",
          lastName: reader.lastName || "",
          teacher: reader.teacher || "",
          grade: reader.grade || "",
        });

        // Fetch teachers and grades
        const [teachersRes, gradesRes] = await Promise.all([
          api.get("/readers/teachers"),
          api.get("/readers/grades"),
        ]);

        setTeachers(teachersRes.data.teachers || []);
        setGrades(gradesRes.data.grades || []);
      } catch (err) {
        console.error("Error loading reader/metadata:", err);
        alert("Failed to load reader details");
      } finally {
        setLoading(false);
      }
    };

    if (readerId) fetchData();
  }, [readerId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/readers/${readerId}`, form);
      onSave(data.reader);
    } catch (err) {
      console.error("Update reader error:", err);
      alert(err.response?.data?.message || "Failed to update reader");
    }
  };

  if (loading) {
    return (
      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content p-3 text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Reader</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
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
                <label className="form-label">Teacher</label>
                <select
                  name="teacher"
                  value={form.teacher}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t, i) => (
                    <option key={i} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
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
                  <option value="">Select Grade</option>
                  {grades.map((g, i) => (
                    <option key={i} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditReaderModal;
