// src/pages/BooksPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", barcode: "" });

  const fetchBooks = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/books`);
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_API_URL}/api/books`, form);
    setForm({ title: "", author: "", barcode: "" });
    fetchBooks();
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">📚 Library Books</h2>

      {/* Add Book Modal Trigger */}
      <button
        className="btn btn-primary mb-3"
        data-bs-toggle="modal"
        data-bs-target="#addBookModal"
      >
        ➕ Add Book
      </button>

      {/* Table of Books */}
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Barcode</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.barcode}</td>
              <td>{book.availableCopies}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Book Modal */}
      <div
        className="modal fade"
        id="addBookModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Add New Book</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    name="author"
                    className="form-control"
                    value={form.author}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Barcode</label>
                  <input
                    type="text"
                    name="barcode"
                    className="form-control"
                    value={form.barcode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" type="submit">
                  Save Book
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
