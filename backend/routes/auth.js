


// // routes/auth.js
// const express = require("express");
// const router = express.Router();

// const {
//   register,
//   login,
//   verifyEmail,
//   forgotPassword,
//   resetPassword,
//   forgotUsername,
//   resendVerification,
// } = require("../controllers/authController");

// // ✅ Parent-only register (gated by access code + email verification)
// router.post("/register", register);

// // ✅ Login for all users (parents + admin)
// router.post("/login", login);

// // ✅ Verify email link
// router.get("/verify/:token", verifyEmail);

// // ✅ Forgot + Reset password
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// // ✅ Forgot username
// router.post("/forgot-username", forgotUsername);

// // ✅ Resend verification email
// router.post("/resend-verification", resendVerification);

// module.exports = router;


// routes/auth.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware"); // ✅ import this

const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  forgotUsername,
  resendVerification,
} = require("../controllers/authController");

// ✅ Parent-only register (gated by access code + email verification)
router.post("/register", register);

// ✅ Login for all users (parents + admin)
router.post("/login", login);

// ✅ Verify email link
router.get("/verify/:token", verifyEmail);

// ✅ Forgot + Reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ✅ Forgot username
router.post("/forgot-username", forgotUsername);

// ✅ Resend verification email
router.post("/resend-verification", resendVerification);

// ✅ NEW: Quick token validity check route
router.get("/check", verifyToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user,
  });
});

module.exports = router;
