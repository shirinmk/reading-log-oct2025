// controllers/bookController.js
const mongoose = require("mongoose");
const Book = require("../models/Book");

/**
 * ✅ Add a new book for the logged-in admin’s school
 */
exports.addBook = async (req, res) => {
  try {
    const { title, author, barcode, totalCopies } = req.body;

    if (!req.user || !req.user.schoolId) {
      return res.status(400).json({ message: "Missing schoolId in token" });
    }
    if (!title || !barcode) {
      return res.status(400).json({ message: "Title and barcode required" });
    }

    // Check for duplicates in same school
    const existing = await Book.findOne({
      barcode,
      schoolId: req.user.schoolId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Barcode already exists in this school" });
    }

    const book = new Book({
      title,
      author,
      barcode,
      totalCopies: totalCopies || 1,
      availableCopies: totalCopies || 1,
      schoolId: req.user.schoolId, // ✅ tie to admin’s school
    });

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.error("BOOK ADD ERROR:", err);
    res.status(500).json({ message: "Server error while adding book" });
  }
};

/**
 * ✅ Get all books for the logged-in admin’s school
 */
exports.getBooks = async (req, res) => {
  try {
    if (!req.user || !req.user.schoolId) {
      return res.status(400).json({ message: "Missing schoolId in token" });
    }

    const books = await Book.find({ schoolId: req.user.schoolId }).sort({
      title: 1,
    });

    res.json(books);
  } catch (err) {
    console.error("BOOK FETCH ERROR:", err);
    res.status(500).json({ message: "Server error while loading books" });
  }
};
