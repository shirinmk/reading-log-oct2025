// models/Book.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String },
    isbn: { type: String },
    barcode: { type: String, unique: true, required: true },
    totalCopies: { type: Number, default: 1 },
    availableCopies: { type: Number, default: 1 },

    // ✅ Each book belongs to one school
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
