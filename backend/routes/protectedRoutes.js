


// backend/routes/protectedRoutes.js
const express = require("express");
const { authMiddleware, verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Example protected dashboard route
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.role}` });
});

// ✅ Profile route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ id: req.user.id, role: req.user.role });
});

// ✅ Token validation route
// router.get("/check", verifyToken, (req, res) => {
//   res.json({
//     valid: true,
//     user: {
//       id: req.user.id,      // 🔑 must match frontend AuthContext
//       role: req.user.role,
//     },
//   });
// });
router.get("/check", verifyToken, (req, res) => {
  res.set("Cache-Control", "no-store");   // 🚀 disable caching
  res.status(200).json({ valid: true, user: req.user });
});


module.exports = router;
