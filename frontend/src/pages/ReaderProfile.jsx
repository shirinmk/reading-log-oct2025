


import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ReaderProfile = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const [reader, setReader] = useState(null);
  const [borrowed, setBorrowed] = useState([]); // 🆕 borrowed records
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return; // wait until token is loaded

    const fetchReader = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/readers/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReader(data.reader || data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load reader"
        );
      }
    };

    const fetchBorrowed = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/borrow/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBorrowed(data);
      } catch (err) {
        console.error("Error fetching borrowed books:", err);
      }
    };

    fetchReader();
    fetchBorrowed(); // 🆕
  }, [id, token]);

  if (error) return <div className="container mt-4 text-danger">{error}</div>;
  if (!reader) return <div className="container mt-4">Loading…</div>;

  return (
    <div className="container mt-4">
      <h2>
        {reader.firstName} {reader.lastName}
      </h2>

      {user && (
        <p className="text-muted">
          Parent: {user.firstName} {user.lastName}
        </p>
      )}

      <div className="mt-3 d-flex gap-2">
        <Link className="btn btn-primary" to={`/edit-reader/${reader._id}`}>
          Edit
        </Link>
        <Link className="btn btn-secondary" to="/dashboard">
          Back to Dashboard
        </Link>
      </div>

      {/* 🆕 Borrowed Books Section */}
      <div className="mt-5">
        <h4>📚 Borrowed Books</h4>
        {borrowed.length === 0 ? (
          <p className="text-muted">No borrowed books yet.</p>
        ) : (
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Borrowed Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {borrowed.map((record) => (
                <tr key={record._id}>
                  <td>{record.book?.title}</td>
                  <td>{record.book?.author}</td>
                  <td>
                    {new Date(record.borrowedAt).toLocaleDateString()}
                  </td>
                  <td>
                    {record.dueDate
                      ? new Date(record.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {record.status === "borrowed" ? (
                      <span className="badge bg-warning text-dark">
                        Borrowed
                      </span>
                    ) : (
                      <span className="badge bg-success">Returned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReaderProfile;
