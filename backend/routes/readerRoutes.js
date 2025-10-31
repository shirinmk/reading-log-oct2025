

const express = require("express");
const {
  addReader,
  adminAddReader,
  getReaders,
  getReaderById,
  updateReader,
  deleteReader,
  logReading,
  getTopReaders,
  updateBook,
  deleteBook,
  getBadges,
  getTeachers,
  getGrades
} = require("../controllers/readerController");  // ✅ make sure all exist
console.log({ addReader, adminAddReader, logReading });

// const authMiddleware = require("../middleware/authMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");



const router = express.Router();




// Public: top readers
router.get("/top", getTopReaders);

// teachers & grades
router.get("/teachers", getTeachers);
router.get("/grades", getGrades);

// ====================
// 👨‍👩 Parent routes
// ====================
router.post("/", authMiddleware, addReader);      // parent adds their child
router.get("/", authMiddleware, getReaders);      // parent = only their kids, admin = all

// ====================
// 📚 Admin routes
// ====================
router.post("/admin", authMiddleware, adminAddReader);   // librarian/admin adds readers explicitly

// ====================
// Shared routes
// ====================
router.get("/:id", authMiddleware, getReaderById);
router.put("/:id", authMiddleware, updateReader);
router.delete("/:id", authMiddleware, deleteReader);

router.post("/:id/books", authMiddleware, logReading);
router.put("/:readerId/books/:bookId", authMiddleware, updateBook);
router.delete("/:readerId/books/:bookId", authMiddleware, deleteBook);

router.get("/:id/badges", authMiddleware, getBadges);

// showing borrowed book in reader
const { getBorrowedBooksForReader } = require("../controllers/readerController");

router.get("/:id/borrowed", authMiddleware, getBorrowedBooksForReader);

module.exports = router;
