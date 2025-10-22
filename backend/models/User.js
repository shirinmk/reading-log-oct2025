// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  username:  { type: String, required: true, unique: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String },
  password:  { type: String, required: true },
  role:      { type: String, enum: ["parent", "admin"], default: "parent" },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },


  // ✅ New fields
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpires: { type: Date },
  resetPasswordToken: { type: String },
resetPasswordExpires: { type: Date },

  
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
