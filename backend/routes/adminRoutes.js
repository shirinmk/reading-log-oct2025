const express = require("express");
const { authMiddleware, verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

const {
  listReaders,
  summaryByTeacher,
  summaryByGrade,
} = require("../controllers/adminReportController");
const { getAllReaders, adminAddReader } = require("../controllers/readerController");

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

// Reports
router.get("/reports/readers", authMiddleware, requireAdmin, listReaders);
router.get("/reports/by-teacher", authMiddleware, requireAdmin, summaryByTeacher);
router.get("/reports/by-grade", authMiddleware, requireAdmin, summaryByGrade);

// Reader management (librarian panel)
router.get("/readers", authMiddleware, requireAdmin, getAllReaders);
router.post("/readers", authMiddleware, requireAdmin, adminAddReader);

// ✅ Token validation route
router.get("/check", verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
