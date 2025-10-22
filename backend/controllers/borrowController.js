// 

// controllers/borrowController.js
const BorrowRecord = require("../models/BorrowRecord");
const Book = require("../models/Book");
const Reader = require("../models/Reader");

// 🏫 Borrow a book
exports.borrowBook = async (req, res) => {
  try {
    const { readerId, bookId, dueDate } = req.body;

    if (!req.user || !req.user.schoolId) {
      return res.status(401).json({ message: "Unauthorized: missing schoolId" });
    }

    if (!readerId || !bookId) {
      return res.status(400).json({ message: "Reader and book required" });
    }

    // Ensure reader belongs to same school
    const reader = await Reader.findOne({
      _id: readerId,
      schoolId: req.user.schoolId,
    });
    if (!reader) {
      return res.status(404).json({ message: "Reader not found for this school" });
    }

    // Ensure book belongs to same school
    const book = await Book.findOne({
      _id: bookId,
      schoolId: req.user.schoolId,
    });
    if (!book || book.availableCopies < 1) {
      return res.status(400).json({ message: "Book not available" });
    }

    // Reduce available copies
    book.availableCopies -= 1;
    await book.save();

    // Create borrow record
    const record = new BorrowRecord({
      reader: reader._id,
      book: book._id,
      schoolId: req.user.schoolId,
      dueDate,
      status: "borrowed",
      borrowedAt: new Date(),
    });
    await record.save();

    res.status(201).json({ message: "Book borrowed successfully", record });
  } catch (err) {
    console.error("BORROW ERROR:", err);
    res.status(500).json({ message: "Server error borrowing book" });
  }
};

// 🧾 Return book
exports.returnBook = async (req, res) => {
  try {
    const { recordId } = req.body;
    if (!req.user?.schoolId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const record = await BorrowRecord.findOne({
      _id: recordId,
      schoolId: req.user.schoolId,
    }).populate("book");

    if (!record) return res.status(404).json({ message: "Borrow record not found" });
    if (record.status === "returned") {
      return res.status(400).json({ message: "Already returned" });
    }

    record.status = "returned";
    record.returnedAt = new Date();
    await record.save();

    record.book.availableCopies += 1;
    await record.book.save();

    res.json({ message: "Book returned successfully", record });
  } catch (err) {
    console.error("RETURN ERROR:", err);
    res.status(500).json({ message: "Server error returning book" });
  }
};

// 📚 Get all borrowed records (for admin/library dashboard)
exports.getAllBorrowed = async (req, res) => {
  try {
    if (!req.user?.schoolId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const records = await BorrowRecord.find({
      schoolId: req.user.schoolId,
    })
      .populate("book", "title author")
      .populate("reader", "firstName lastName grade teacher");

    res.json(records);
  } catch (err) {
    console.error("GET BORROWED ERROR:", err);
    res.status(500).json({ message: "Server error loading borrowed records" });
  }
};

// 👤 Get borrowed books for one reader
exports.getBorrowedByReader = async (req, res) => {
  try {
    if (!req.user?.schoolId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const records = await BorrowRecord.find({
      reader: req.params.id,
      schoolId: req.user.schoolId,
      status: "borrowed",
    }).populate("book", "title author");

    res.json(records);
  } catch (err) {
    console.error("GET BORROWED BY READER ERROR:", err);
    res.status(500).json({ message: "Server error loading reader borrowed books" });
  }
};
