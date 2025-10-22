// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const { addBook, getBooks } = require("../controllers/bookController");
const { authMiddleware } = require("../middleware/authMiddleware");

// ✅ All routes protected by JWT middleware
router.post("/", authMiddleware, addBook);
router.get("/", authMiddleware, getBooks);

module.exports = router;
