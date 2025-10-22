import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import LogReadingModal from "../components/LogReadingModal";
import EditBookModal from "../components/EditBookModal";
import EditReaderModal from "../components/EditReaderModal";
import api from "../utils/axios";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [readers, setReaders] = useState([]);
  const [currentReader, setCurrentReader] = useState(null);

  const [borrowedBooks, setBorrowedBooks] = useState([]); // ✅
  const [showLogModal, setShowLogModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editReaderId, setEditReaderId] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [searchParams] = useSearchParams();
  const ridFromUrl = searchParams.get("rid");

  // Dashboard banner
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/protected/dashboard");
        setMessage(res.data.message || "Welcome to your dashboard!");
      } catch (error) {
        console.error("Dashboard error:", error);
        setMessage("Error loading dashboard.");
      }
    };
    fetchDashboard();
  }, []);

  // Readers
  useEffect(() => {
    const fetchReaders = async () => {
      try {
        const res = await api.get("/readers");
        setReaders(res.data.readers || []);
      } catch (err) {
        console.error("Error fetching readers:", err);
        setReaders([]);
      }
    };
    fetchReaders();
  }, []);

  // Auto-select reader if ?rid param exists
  useEffect(() => {
    if (!readers.length || !ridFromUrl) return;
    const match = readers.find((r) => r._id === ridFromUrl);
    if (match) setCurrentReader(match);
  }, [readers, ridFromUrl]);

  // Fetch borrowed books when currentReader changes
  useEffect(() => {
    if (!currentReader?._id) return;

    // const fetchBorrowed = async () => {
    //   try {
    //     const { data } = await api.get(`/borrow/reader/${currentReader._id}`);
    //     setBorrowedBooks(data);
    //   } catch (err) {
    //     console.error("Error fetching borrowed books:", err);
    //     setBorrowedBooks([]);
    //   }
    // };
const fetchBorrowed = async () => {
  try {
    const { data } = await api.get(`/borrow/${currentReader._id}`);
    setBorrowedBooks(data);
  } catch (err) {
    console.error("Error fetching borrowed books:", err);
    setBorrowedBooks([]);
  }
};

    fetchBorrowed();
  }, [currentReader]);

  const handleReaderAdded = (newReader) => {
    if (newReader) {
      setReaders((prev) => [...prev, newReader]);
      setCurrentReader(newReader);
    }
  };

  const handleLogSuccess = (updatedReader) => {
    setReaders((prev) =>
      prev.map((r) => (r._id === updatedReader._id ? updatedReader : r))
    );
    setCurrentReader(updatedReader);
  };

  const openEditBook = (book) => {
    if (!currentReader) return;
    setEditTarget({ readerId: currentReader._id, book });
  };

  const handleDeleteBook = async (book) => {
    if (!currentReader) return;
    const ok = window.confirm(`Delete "${book.title}"?`);
    if (!ok) return;

    try {
      const { data } = await api.delete(
        `/readers/${currentReader._id}/books/${book._id}`
      );
      setReaders((prev) =>
        prev.map((r) => (r._id === data.reader._id ? data.reader : r))
      );
      setCurrentReader(data.reader);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete book");
    }
  };

  return (
    <div style={{ backgroundColor: "#fce8d5", minHeight: "100vh" }}>
      {/* Navbar */}
      <DashboardNavbar
        readers={readers}
        currentReader={currentReader}
        setCurrentReader={setCurrentReader}
        onReaderAdded={handleReaderAdded}
        onOpenLogModal={() => {
          if (!currentReader) {
            alert("Please choose a reader first.");
            return;
          }
          setShowLogModal(true);
        }}
      />

      <div className="container" style={{ paddingTop: "80px" }}>
        <h1>Dashboard</h1>
        <p>{message}</p>

        {currentReader ? (
          <div className="card p-3 mt-3 shadow-sm">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="m-0">Reader Information</h4>
              <div className="d-flex flex-column flex-md-row gap-2 mt-2 mt-md-0">
                <Link
                  to={`/readers/${currentReader._id}/badges`}
                  state={{ from: "dashboard" }}
                  className="btn btn-outline-primary btn-sm"
                  style={{
                    backgroundColor: "#f3c791ff",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  View {currentReader.firstName}'s Badges
                </Link>

                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setEditReaderId(currentReader._id)}
                >
                  Edit Reader
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  style={{
                    backgroundColor: "#f3c791ff",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  onClick={() => setShowLogModal(true)}
                >
                  Log Reading
                </button>
              </div>
            </div>

            {/* Info table */}
            <table className="table table-bordered mt-2">
              <tbody>
                <tr style={{ backgroundColor: "#ffe0f0" }}>
                  <th colSpan="2">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Total Pages Read</span>
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: "#ff6fa3",
                          color: "white",
                          fontSize: "1rem",
                          padding: "0.6rem 0.9rem",
                        }}
                      >
                        {currentReader.pagesRead || 0}
                      </span>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>
                    {currentReader.firstName} {currentReader.lastName}
                  </td>
                </tr>
                <tr>
                  <th>Teacher</th>
                  <td>{currentReader.teacher}</td>
                </tr>
                <tr>
                  <th>Parent</th>
                  <td>
                    {storedUser?.firstName} {storedUser?.lastName}
                  </td>
                </tr>
                <tr>
                  <th>Created</th>
                  <td>{new Date(currentReader.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Updated</th>
                  <td>{new Date(currentReader.updatedAt).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* Books */}
            <h4 className="mt-4">Books</h4>
            {currentReader.books?.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Pages</th>
                      <th>Summary</th>
                      <th>Completed</th>
                      <th>Logged At</th>
                      <th>Updated</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReader.books.map((book) => (
                      <tr key={book._id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.pages}</td>
                        <td style={{ maxWidth: 360, whiteSpace: "pre-wrap" }}>
                          {book.summary || <span className="text-muted">—</span>}
                        </td>
                        <td>
                          {book.completedAt
                            ? new Date(book.completedAt).toLocaleString()
                            : "—"}
                        </td>
                        <td>
                          {book.createdAt
                            ? new Date(book.createdAt).toLocaleString()
                            : "—"}
                        </td>
                        <td>
                          {book.updatedAt
                            ? new Date(book.updatedAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className="text-end d-flex flex-column flex-md-row gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditBook(book)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteBook(book)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No books logged yet.</p>
            )}
          </div>
        ) : (
          <p className="mt-3">Select a reader to view details</p>
        )}
      </div>

      {/* Log Reading Modal */}
      {showLogModal && currentReader && (
        <LogReadingModal
          reader={currentReader}
          borrowedBooks={borrowedBooks}   // ✅ send borrowed books
          onClose={() => setShowLogModal(false)}
          onLogSuccess={handleLogSuccess}
        />
      )}

      {/* Edit Book Modal */}
      {editTarget && (
        <EditBookModal
          readerId={editTarget.readerId}
          book={editTarget.book}
          onClose={() => setEditTarget(null)}
          onSave={(updatedReader) => {
            setReaders((prev) =>
              prev.map((r) => (r._id === updatedReader._id ? updatedReader : r))
            );
            setCurrentReader(updatedReader);
            setEditTarget(null);
          }}
        />
      )}

      {/* Edit Reader Modal */}
      {editReaderId && (
        <EditReaderModal
          readerId={editReaderId}
          onClose={() => setEditReaderId(null)}
          onSave={(updatedReader) => {
            setReaders((prev) =>
              prev.map((r) => (r._id === updatedReader._id ? updatedReader : r))
            );
            setCurrentReader(updatedReader);
            setEditReaderId(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
