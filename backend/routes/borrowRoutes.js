


// routes/borrowRoutes.js
const express = require("express");
const router = express.Router();
const {
  borrowBook,
  returnBook,
  getAllBorrowed,
  getBorrowedByReader,
} = require("../controllers/borrowController");
const { authMiddleware } = require("../middleware/authMiddleware");

// ✅ All routes protected by token
router.post("/borrow", authMiddleware, borrowBook);
router.post("/return", authMiddleware, returnBook);
router.get("/", authMiddleware, getAllBorrowed);
router.get("/:id", authMiddleware, getBorrowedByReader);

module.exports = router;
