// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

/**
 * ✅ Verifies token and attaches decoded user info to req.user
 */
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Always attach consistent structure
    req.user = {
      id: decoded.id,
      role: decoded.role,
      schoolId: decoded.schoolId, // string ObjectId
    };

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * ✅ Lightweight version for token validity checks (used by /check route)
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
      schoolId: decoded.schoolId,
    };

    next();
  } catch (err) {
    console.error("TOKEN VERIFY ERROR:", err);
    return res
      .status(401)
      .json({ valid: false, message: "Token invalid or expired" });
  }
};

module.exports = { authMiddleware, verifyToken };
