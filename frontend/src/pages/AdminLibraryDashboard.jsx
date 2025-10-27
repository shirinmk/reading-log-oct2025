


import React, { useEffect, useState } from "react";
import axios from "axios";
// import { BrowserMultiFormatReader } from "@zxing/browser";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";


import { fetchBookInfoByBarcode } from "../utils/bookLookup";

const AdminLibraryDashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [readers, setReaders] = useState([]);
  const [message, setMessage] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [activeTab, setActiveTab] = useState("books");
  const [newBook, setNewBook] = useState({ title: "", author: "", barcode: "" });
  const [useExistingReader, setUseExistingReader] = useState(true);
  const [selectedReaderId, setSelectedReaderId] = useState("");
  const [newReader, setNewReader] = useState({
    firstName: "",
    lastName: "",
    grade: "",
    teacher: "",
  });
  const [borrowData, setBorrowData] = useState({ bookId: "", dueDate: "" });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) return;
    fetchBooks();
    fetchReaders();
    fetchBorrowed();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/books`, authConfig);
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const fetchReaders = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/readers`, authConfig);
      setReaders(Array.isArray(res.data) ? res.data : res.data.readers || []);
    } catch (err) {
      console.error("Error fetching readers:", err);
      setReaders([]);
    }
  };

  const fetchBorrowed = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/borrow`, authConfig);
      setBorrowed(res.data);
    } catch (err) {
      console.error("Error fetching borrowed:", err);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/books`, newBook, authConfig);
      setMessage("✅ Book added successfully!");
      setShowAddModal(false);
      setNewBook({ title: "", author: "", barcode: "" });
      fetchBooks();
    } catch (err) {
      console.error("Error adding book:", err);
      alert(err.response?.data?.message || "Error adding book");
    }
  };

  const handleBorrowBook = async (e) => {
    e.preventDefault();
    try {
      let readerId = selectedReaderId;
      if (!useExistingReader) {
        const newReaderData = { ...newReader, parentId: null };
        const url =
          role === "admin"
            ? `${process.env.REACT_APP_API_URL}/api/readers/admin`
            : `${process.env.REACT_APP_API_URL}/api/readers`;
        const res = await axios.post(url, newReaderData, authConfig);
        readerId = res.data._id || res.data.reader?._id;
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/borrow/borrow`,
        { readerId, bookId: borrowData.bookId, dueDate: borrowData.dueDate },
        authConfig
      );

      setMessage("✅ Book borrowed successfully!");
      setShowBorrowModal(false);
      setBorrowData({ bookId: "", dueDate: "" });
      setSelectedReaderId("");
      fetchBooks();
      fetchBorrowed();
    } catch (err) {
      console.error("Borrow Error:", err);
      alert(err.response?.data?.message || "Error borrowing book.");
    }
  };

  const handleReturnBook = async (recordId) => {
    if (!window.confirm("Return this book?")) return;
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/borrow/return`,
        { recordId },
        authConfig
      );
      setMessage("✅ Book returned successfully!");
      fetchBooks();
      fetchBorrowed();
    } catch (err) {
      console.error("Error returning book:", err);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  // === 📷 Camera Scanner ===
  // useEffect(() => {
  //   if (!showCamera) return;

  //   const reader = new BrowserMultiFormatReader();
  //   let controls;

  //   reader
  //     .decodeFromVideoDevice(null, "barcode-video", (result, error, ctrl) => {
  //       if (result) {
  //         const scanned = result.getText().trim();
  //         console.log("📘 Scanned:", scanned);
  //         setNewBook((prev) => ({ ...prev, barcode: scanned }));
  //         setShowCamera(false);
  //         if (ctrl) ctrl.stop();
  //         reader.stopStreams();

  //         // auto-fetch
  //         if (scanned.length >= 10) {
  //           fetchBookInfoByBarcode(scanned).then((info) => {
  //             if (info) {
  //               setNewBook((prev) => ({
  //                 ...prev,
  //                 title: info.title || prev.title,
  //                 author: info.author || prev.author,
  //               }));
  //             }
  //           });
  //         }
  //       }
  //     })
  //     .then((ctrl) => (controls = ctrl))
  //     .catch((err) => console.error("Camera error:", err));

  //   return () => {
  //     controls?.stop();
  //     reader.stopStreams();
  //   };
  // }, [showCamera]);
// useEffect(() => {
//   if (!showCamera) return;

//   const codeReader = new BrowserMultiFormatReader();
//   const videoElement = document.getElementById("barcode-video");

//   let active = true;

//   const startScan = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "environment" },
//       });
//       videoElement.srcObject = stream;
//       videoElement.setAttribute("playsinline", true);
//       videoElement.play();

//       while (active) {
//         try {
//           const result = await codeReader.decodeOnceFromVideoElement(videoElement);
//           if (result) {
//             const scannedCode = result.getText().trim();
//             console.log("✅ Scanned:", scannedCode);
//             setNewBook((prev) => ({ ...prev, barcode: scannedCode }));
//             setShowCamera(false);

//             // Stop camera
//             stream.getTracks().forEach((t) => t.stop());

//             // Fetch book info automatically
//             if (scannedCode.length >= 10) {
//               const info = await fetchBookInfoByBarcode(scannedCode);
//               if (info) {
//                 setNewBook((prev) => ({
//                   ...prev,
//                   title: info.title || prev.title,
//                   author: info.author || prev.author,
//                 }));
//               }
//             }
//             break;
//           }
//         } catch (err) {
//           if (!(err instanceof NotFoundException)) {
//             console.warn("Scan error:", err);
//           }
//         }
//       }
//     } catch (err) {
//       console.error("Camera error:", err);
//       alert("Could not access camera. Please allow permissions.");
//     }
//   };

//   startScan();

//   return () => {
//     active = false;
//     codeReader.reset();
//     const stream = videoElement?.srcObject;
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//   };
// }, [showCamera]);


// useEffect(() => {
//   if (!showCamera) return;

//   const codeReader = new BrowserMultiFormatReader();
//   const videoEl = document.getElementById("barcode-video");
//   let isMounted = true;
//   let stream;

//   const startCamera = async () => {
//     try {
//       // ✅ request video stream from back camera if possible
//       stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: { ideal: "environment" } },
//       });
//       if (!isMounted) return;
//       videoEl.srcObject = stream;
//       await videoEl.play();

//       const scanLoop = async () => {
//         if (!isMounted) return;
//         try {
//           const result = await codeReader.decodeOnceFromVideoElement(videoEl);
//           if (result) {
//             const barcode = result.getText().trim();
//             console.log("✅ Barcode:", barcode);

//             setNewBook((prev) => ({ ...prev, barcode }));
//             setShowCamera(false);

//             // stop video stream
//             stream?.getTracks().forEach((t) => t.stop());

//             // fetch book info automatically
//             if (barcode.length >= 10) {
//               const info = await fetchBookInfoByBarcode(barcode);
//               if (info) {
//                 setNewBook((prev) => ({
//                   ...prev,
//                   title: info.title || prev.title,
//                   author: info.author || prev.author,
//                 }));
//               }
//             }
//           } else {
//             // retry every 500ms if no barcode found
//             setTimeout(scanLoop, 500);
//           }
//         } catch (err) {
//           if (err instanceof NotFoundException) {
//             // no barcode found yet, retry
//             if (isMounted) setTimeout(scanLoop, 500);
//           } else {
//             console.error("Decode error:", err);
//           }
//         }
//       };

//       scanLoop();
//     } catch (err) {
//       console.error("Camera init error:", err);
//       alert("Camera access failed. Please check permissions.");
//     }
//   };

//   startCamera();

//   return () => {
//     isMounted = false;
//     codeReader.reset();
//     stream?.getTracks().forEach((t) => t.stop());
//   };
// }, [showCamera]);


// useEffect(() => {
//   if (!showCamera) return;

//   const codeReader = new BrowserMultiFormatReader();
//   const videoEl = document.getElementById("barcode-video");
//   let isMounted = true;
//   let stream;

//   const startScanner = async () => {
//     try {
//       // Ask for the environment (rear) camera if available
//       stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: { ideal: "environment" } },
//       });
//       if (!isMounted) return;

//       videoEl.srcObject = stream;
//       videoEl.setAttribute("playsinline", true);
//       videoEl.setAttribute("muted", true);
//       videoEl.play();

//       // ✅ start continuous scanning loop
//       const scan = async () => {
//         if (!isMounted) return;
//         try {
//           const result = await codeReader.decodeOnceFromVideoElement(videoEl);
//           if (result) {
//             const scannedCode = result.getText().trim();
//             console.log("✅ Scanned:", scannedCode);

//             // stop camera feed
//             stream.getTracks().forEach((t) => t.stop());
//             codeReader.reset();

//             // fill form and close camera
//             setNewBook((prev) => ({ ...prev, barcode: scannedCode }));
//             setShowCamera(false);

//             // auto-fetch title + author
//             if (scannedCode.length >= 10) {
//               const info = await fetchBookInfoByBarcode(scannedCode);
//               if (info) {
//                 setNewBook((prev) => ({
//                   ...prev,
//                   title: info.title || prev.title,
//                   author: info.author || prev.author,
//                 }));
//               }
//             }
//             return;
//           }
//         } catch (err) {
//           // If nothing found, keep scanning
//           if (err instanceof NotFoundException && isMounted) {
//             requestAnimationFrame(scan);
//           } else {
//             console.error("Scan error:", err);
//           }
//         }
//       };

//       requestAnimationFrame(scan);
//     } catch (err) {
//       console.error("Camera error:", err);
//       alert("Camera access failed. Please allow permissions.");
//     }
//   };

//   startScanner();

//   return () => {
//     isMounted = false;
//     codeReader.reset();
//     if (stream) stream.getTracks().forEach((t) => t.stop());
//   };
// }, [showCamera]);

useEffect(() => {
  if (!showCamera) return;

  const codeReader = new BrowserMultiFormatReader();
  const videoEl = document.getElementById("barcode-video");
  let stream;
  let isMounted = true;

  const startScanner = async () => {
    try {
      console.log("🎥 Requesting camera access...");
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });

      if (!isMounted) return;
      console.log("✅ Camera stream received:", stream);
      videoEl.srcObject = stream;
      videoEl.setAttribute("playsinline", true);
      videoEl.setAttribute("muted", true);
      await videoEl.play();
      console.log("▶️ Video playing, starting decode loop...");

      const scan = async () => {
        if (!isMounted) return;
        try {
          const result = await codeReader.decodeOnceFromVideoElement(videoEl);
          if (result) {
            const barcode = result.getText().trim();
            console.log("📘 Detected barcode:", barcode);

            // stop camera
            stream.getTracks().forEach((t) => t.stop());
            codeReader.reset();

            setNewBook((prev) => ({ ...prev, barcode }));
            setShowCamera(false);

            // auto-fetch title + author
            if (barcode.length >= 10) {
              console.log("🔍 Fetching book info for:", barcode);
              const info = await fetchBookInfoByBarcode(barcode);
              console.log("📚 API result:", info);
              if (info) {
                setNewBook((prev) => ({
                  ...prev,
                  title: info.title || prev.title,
                  author: info.author || prev.author,
                }));
              }
            }
          }
        } catch (err) {
          if (err instanceof NotFoundException) {
            // nothing found, retry
            requestAnimationFrame(scan);
          } else {
            console.error("⚠️ Decode error:", err);
          }
        }
      };

      requestAnimationFrame(scan);
    } catch (err) {
      console.error("🚫 Camera initialization error:", err);
      alert("Camera access denied or not available.");
    }
  };

  startScanner();

  return () => {
    isMounted = false;
    codeReader.reset();
    if (stream) stream.getTracks().forEach((t) => t.stop());
  };
}, [showCamera]);


  // === Auto-fetch on manual typing ===
  const handleBarcodeChange = async (e) => {
    const barcode = e.target.value.trim();
    setNewBook((prev) => ({ ...prev, barcode }));
    if (barcode.length >= 10) {
      const info = await fetchBookInfoByBarcode(barcode);
      if (info) {
        setNewBook((prev) => ({
          ...prev,
          title: info.title || prev.title,
          author: info.author || prev.author,
        }));
      }
    }
  };

  // === UI ===
  return (
    <>
      <button className="btn btn-outline-primary" onClick={handleSignOut}>
        Sign Out
      </button>

      <div className="container mt-5">
        <h2 className="mb-4">📚 Library Dashboard</h2>

        {message && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setMessage("")}
            ></button>
          </div>
        )}

        {/* Tabs */}
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "books" ? "active" : ""}`}
              onClick={() => setActiveTab("books")}
            >
              Manage Books
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "borrowed" ? "active" : ""}`}
              onClick={() => setActiveTab("borrowed")}
            >
              Borrowed Books
            </button>
          </li>
        </ul>

        {/* === Books Tab === */}
        {activeTab === "books" && (
          <div>
            <button className="btn btn-success mb-3" onClick={() => setShowAddModal(true)}>
              + Add New Book
            </button>
            <h4>All Books</h4>
            <table className="table table-bordered mb-5">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Barcode</th>
                  <th>Total</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {books.length ? (
                  books.map((b) => (
                    <tr key={b._id}>
                      <td>{b.title}</td>
                      <td>{b.author}</td>
                      <td>{b.barcode}</td>
                      <td>{b.totalCopies}</td>
                      <td>{b.availableCopies}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No books found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
{/* === Borrowed Books Tab === */}
{/* {activeTab === "borrowed" && (
  <div>
    <h4 className="mt-4">Borrowed Books</h4>

    {borrowed.length === 0 ? (
      <div className="alert alert-secondary text-center mt-3">
        No borrowed books found.
      </div>
    ) : (
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Reader</th>
            <th>Teacher</th>
            <th>Grade</th>
            <th>Borrowed Date</th>
            <th>Due Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {borrowed.map((record) => (
            <tr key={record._id}>
              <td>{record.book?.title || "—"}</td>
              <td>
                {record.reader
                  ? `${record.reader.firstName} ${record.reader.lastName}`
                  : "—"}
              </td>
              <td>{record.reader?.teacher || "—"}</td>
              <td>{record.reader?.grade || "—"}</td>
              <td>{new Date(record.borrowedAt).toLocaleDateString()}</td>
              <td>
                {record.dueDate
                  ? new Date(record.dueDate).toLocaleDateString()
                  : "—"}
              </td>
              <td>
                {record.status === "borrowed" ? (
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleReturnBook(record._id)}
                  >
                    Return
                  </button>
                ) : (
                  <span className="text-success fw-semibold">Returned</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)} */}
{/* === Borrowed Books Tab === */}
{activeTab === "borrowed" && (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4>Borrowed Books</h4>
      <button
        className="btn btn-primary"
        onClick={() => setShowBorrowModal(true)}
      >
        + Borrow Book
      </button>
    </div>

    {borrowed.length === 0 ? (
      <div className="alert alert-secondary text-center">
        No borrowed books found.
      </div>
    ) : (
      <table className="table table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th>Book</th>
            <th>Reader</th>
            <th>Borrowed At</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {borrowed.map((record) => (
            <tr key={record._id}>
              <td>{record.book?.title || "—"}</td>
              <td>
                {record.reader
                  ? `${record.reader.firstName} ${record.reader.lastName}`
                  : "—"}
              </td>
              <td>{new Date(record.borrowedAt).toLocaleDateString()}</td>
              <td>
                {record.dueDate
                  ? new Date(record.dueDate).toLocaleDateString()
                  : "—"}
              </td>
              <td>
                {record.status === "borrowed" ? (
                  <span className="badge bg-warning text-dark">Borrowed</span>
                ) : (
                  <span className="badge bg-success">Returned</span>
                )}
              </td>
              <td>
                {record.status === "borrowed" && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleReturnBook(record._id)}
                  >
                    Return
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}


        {/* === Add Book Modal === */}
        {showAddModal && (
          <div className="modal fade show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={handleAddBook}>
                  <div className="modal-header">
                    <h5 className="modal-title">Add New Book</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
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
                      required
                    />
                    <div className="mb-3">
                      <label className="fw-bold">Barcode</label>
                      <div className="d-flex gap-2 mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter or scan barcode"
                          value={newBook.barcode}
                          onChange={handleBarcodeChange}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => setShowCamera(!showCamera)}
                        >
                          {showCamera ? "Close Camera" : "📷 Open Camera"}
                        </button>
                      </div>
                      {/* {showCamera && (
                        <div className="border rounded p-2">
                          <video
                            id="barcode-video"
                            style={{ width: "100%", height: "250px" }}
                            autoPlay
                            muted
                          ></video>
                        </div>
                      )} */}
                      {showCamera && (
  <div className="border rounded p-2">
    <video
      id="barcode-video"
      style={{ width: "100%", height: "250px", objectFit: "cover" }}
      autoPlay
      muted
      playsInline
    />
  </div>
)}

                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-success" type="submit">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* === Borrow Book Modal === */}
{showBorrowModal && (
  <div className="modal fade show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <form onSubmit={handleBorrowBook}>
          <div className="modal-header">
            <h5 className="modal-title">Borrow a Book</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowBorrowModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label fw-bold">Select Book</label>
              <select
                className="form-select"
                value={borrowData.bookId}
                onChange={(e) =>
                  setBorrowData({ ...borrowData, bookId: e.target.value })
                }
                required
              >
                <option value="">-- Choose a Book --</option>
                {books.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title} ({book.availableCopies} available)
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Select Reader</label>
              <select
                className="form-select"
                value={selectedReaderId}
                onChange={(e) => setSelectedReaderId(e.target.value)}
                required
              >
                <option value="">-- Choose Reader --</option>
                {readers.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.firstName} {r.lastName} ({r.grade || "?"})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Due Date</label>
              <input
                type="date"
                className="form-control"
                value={borrowData.dueDate}
                onChange={(e) =>
                  setBorrowData({ ...borrowData, dueDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn btn-success">
              Borrow
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowBorrowModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default AdminLibraryDashboard;
