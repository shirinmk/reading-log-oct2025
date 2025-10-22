// src/pages/BorrowReturnPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const BorrowReturnPage = () => {
  const [readers, setReaders] = useState([]);
  const [books, setBooks] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ readerId: "", bookId: "", dueDate: "" });

  const fetchData = async () => {
    const [rRes, bRes] = await Promise.all([
      axios.get(`${process.env.REACT_APP_API_URL}/api/readers`), // assumes you have /readers
      axios.get(`${process.env.REACT_APP_API_URL}/api/books`)
    ]);
    setReaders(rRes.data);
    setBooks(bRes.data);
  };

  const fetchRecords = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/borrow-records`); // make a GET route
    setRecords(res.data);
  };

  useEffect(() => {
    fetchData();
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_API_URL}/api/borrow/borrow`, form);
    fetchRecords();
  };

  const handleReturn = async (recordId) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/borrow/return`, { recordId });
    fetchRecords();
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">📖 Borrow & Return</h2>

      {/* Borrow Form */}
      <form onSubmit={handleBorrow} className="row g-3 mb-4">
        <div className="col-md-4">
          <select
            name="readerId"
            className="form-select"
            value={form.readerId}
            onChange={handleChange}
            required
          >
            <option value="">Select Reader</option>
            {readers.map((r) => (
              <option key={r._id} value={r._id}>
                {r.firstName} {r.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            name="bookId"
            className="form-select"
            value={form.bookId}
            onChange={handleChange}
            required
          >
            <option value="">Select Book</option>
            {books.map((b) => (
              <option key={b._id} value={b._id}>
                {b.title} ({b.availableCopies} left)
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="date"
            name="dueDate"
            className="form-control"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-1 d-grid">
          <button className="btn btn-success" type="submit">
            Borrow
          </button>
        </div>
      </form>

      {/* Borrow Records Table */}
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Book</th>
            <th>Reader</th>
            <th>Status</th>
            <th>Borrowed</th>
            <th>Due</th>
            <th>Returned</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec._id}>
              <td>{rec.book?.title}</td>
              <td>{rec.reader?.firstName} {rec.reader?.lastName}</td>
              <td>{rec.status}</td>
              <td>{new Date(rec.borrowedAt).toLocaleDateString()}</td>
              <td>{rec.dueDate ? new Date(rec.dueDate).toLocaleDateString() : "—"}</td>
              <td>{rec.returnedAt ? new Date(rec.returnedAt).toLocaleDateString() : "—"}</td>
              <td>
                {rec.status === "borrowed" && (
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleReturn(rec._id)}
                  >
                    Return
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowReturnPage;
