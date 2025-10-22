// backend/models/Borrow.js
const mongoose = require("mongoose");

const BorrowSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reader",
      required: true,
    },
    borrowedAt: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    returnedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Borrow", BorrowSchema);
