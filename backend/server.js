


// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protectedRoutes");
const readerRoutes = require("./routes/readerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const supportRoutes = require("./routes/supportRoutes");
const bookRoutes = require("./routes/bookRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const schoolRoutes = require("./routes/schoolRoutes");



// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware
// app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],   // ⬅️ add this
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);           // Register, login, verify, password, etc.
app.use("/api/protected", protectedRoutes); // Token checks, profile
app.use("/api/readers", readerRoutes);      // Parent + admin readers
app.use("/api/admin", adminRoutes);         // Admin-only reports & mgmt
app.use("/api/support", supportRoutes);     // Contact form
app.use("/api/books", bookRoutes);          // Library books
app.use("/api/borrow", borrowRoutes);       // Borrow/return
app.use("/api/schools", schoolRoutes);

// ✅ Fallback route (optional)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
