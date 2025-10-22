import React, { useEffect, useState } from "react";
import api from "../utils/axios";

const LogReadingModal = ({ reader, onClose, onLogSuccess }) => {
  const [mode, setMode] = useState("borrowed"); // "borrowed" | "new"
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [selectedBorrowedBook, setSelectedBorrowedBook] = useState("");
  const [pages, setPages] = useState("");
  const [summary, setSummary] = useState(""); // ✅ added summary for borrowed mode
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    pages: "",
    summary: "",
  });

  // 🔹 Load borrowed books for this reader
  useEffect(() => {
    const fetchBorrowed = async () => {
      try {
        const res = await api.get(`/borrow/${reader._id}`);
        setBorrowedBooks(res.data || []);
      } catch (err) {
        console.error("Error loading borrowed books:", err);
      }
    };
    if (reader?._id) fetchBorrowed();
  }, [reader]);

  // 🔹 Submit log
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = {};

      if (mode === "borrowed") {
        payload = {
          bookId: selectedBorrowedBook,
          pages: Number(pages) || 0,
          summary, // ✅ include summary
        };
      } else {
        payload = {
          title: newBook.title,
          author: newBook.author,
          pages: Number(newBook.pages) || 0,
          summary: newBook.summary,
        };
      }

      const { data } = await api.post(`/readers/${reader._id}/books`, payload);
      console.log("📚 Borrowed books loaded:", data);

      onLogSuccess(data.reader);
      onClose();
    } catch (err) {
      console.error("Error logging reading:", err);
      alert(err.response?.data?.message || "Error logging reading");
    }
  };

  return (
    <div className="modal fade show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Log Reading</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {/* Mode selection */}
              <div className="mb-3">
                <label className="me-3">
                  <input
                    type="radio"
                    checked={mode === "borrowed"}
                    onChange={() => setMode("borrowed")}
                  />{" "}
                  Select Borrowed Book
                </label>
                <label>
                  <input
                    type="radio"
                    checked={mode === "new"}
                    onChange={() => setMode("new")}
                  />{" "}
                  Enter New Book
                </label>
              </div>

              {mode === "borrowed" ? (
                <>
                  <select
                    className="form-select mb-3"
                    value={selectedBorrowedBook}
                    onChange={(e) => setSelectedBorrowedBook(e.target.value)}
                    required
                  >
                    <option value="">-- Select Borrowed Book --</option>
                    {borrowedBooks.map((record) => (
                      <option key={record._id} value={record.book?._id}>
                        {record.book?.title || "Untitled"}{" "}
                        {record.book?.author ? `(${record.book.author})` : ""}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Pages Read"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    required
                  />

                  {/* ✅ Summary for borrowed book */}
                  <textarea
                    className="form-control"
                    placeholder="Summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Pages"
                    value={newBook.pages}
                    onChange={(e) => setNewBook({ ...newBook, pages: e.target.value })}
                  />
                  <textarea
                    className="form-control"
                    placeholder="Summary"
                    value={newBook.summary}
                    onChange={(e) => setNewBook({ ...newBook, summary: e.target.value })}
                  />
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-success" type="submit">
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogReadingModal;
