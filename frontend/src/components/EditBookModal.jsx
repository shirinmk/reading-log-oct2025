import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../utils/axios";

const EditBookModal = ({ readerId, book, onClose, onSave }) => {
  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [pages, setPages] = useState(book.pages ?? "");
  const [summary, setSummary] = useState(book.summary || "");
  const [completedAt, setCompletedAt] = useState(
    book.completedAt ? new Date(book.completedAt) : new Date()
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required.");
    const n = Number(pages);
    if (!n || n <= 0) return setError("Pages must be > 0.");

    try {
      const { data } = await api.put(
        `/readers/${readerId}/books/${book._id}`,
        {
          title: title.trim(),
          author: author.trim(),
          pages: n,
          summary: summary.trim(),
          completedAt
        }
      );
      onSave?.(data.reader);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update book"
      );
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="editBookTitle"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="editBookTitle" className="modal-title">Edit Book</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div role="alert" className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label" htmlFor="editTitle">Title</label>
                <input id="editTitle" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="editAuthor">Author</label>
                <input id="editAuthor" className="form-control" value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="editPages">Pages</label>
                <input id="editPages" type="number" className="form-control" value={pages} onChange={(e) => setPages(e.target.value)} min={1} required />
              </div>
              <div className="mb-3">
                <label className="form-label d-flex justify-content-between" htmlFor="editSummary">
                  <span>Summary</span>
                </label>
                <textarea id="editSummary" className="form-control" rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="editCompletedAt">Completed At</label>
                <DatePicker id="editCompletedAt" selected={completedAt} onChange={setCompletedAt} className="form-control" />
              </div>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBookModal;
