// models/School.js
const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  accessCode: { type: String, required: true, unique: true },
  adminEmails: [{ type: String, lowercase: true }], // ✅ new field for admins
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("School", schoolSchema);
