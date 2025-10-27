


const mongoose = require("mongoose");
const Reader = require("../models/Reader");
const Book = require("../models/Book");

// ✅ Helper to safely cast schoolId
function getSchoolObjectId(req) {
  if (!req.user.schoolId) return null;
  try {
    return new mongoose.Types.ObjectId(req.user.schoolId);
  } catch (err) {
    console.error("Invalid schoolId format:", req.user.schoolId);
    return null;
  }
}

/**
 * Add a reader (parents only)
 */
const addReader = async (req, res) => {
  const { firstName, lastName, teacher, grade } = req.body;

  if (req.user.role !== "parent") {
    return res.status(403).json({ message: "Only parents can add readers" });
  }
  if (!firstName || !lastName || !teacher || !grade) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const schoolObjectId = getSchoolObjectId(req);
    if (!schoolObjectId) return res.status(400).json({ message: "Invalid schoolId" });

    const reader = new Reader({
      parent: req.user.id || req.user.userId, // make sure parent is linked
      firstName,
      lastName,
      teacher,
      grade,
      schoolId: schoolObjectId, // ✅ tie to parent’s school
    });

    await reader.save();
    res.status(201).json({ reader, message: "Reader added successfully" });
  } catch (err) {
    console.error("ADD READER ERROR:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

/**
 * Get readers for the logged-in parent or admin
 */
const getReaders = async (req, res) => {
  try {
    const schoolObjectId = getSchoolObjectId(req);
    if (!schoolObjectId) return res.status(400).json({ message: "Invalid schoolId" });

    let readers;
    if (req.user.role === "admin") {
      readers = await Reader.find({ schoolId: schoolObjectId })
        .populate("parent", "firstName lastName email");
    } else {
      readers = await Reader.find({
        parent: req.user.id || req.user.userId,
        schoolId: schoolObjectId,
      });
    }
    res.json({ readers });
  } catch (err) {
    console.error("GET READERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get a single reader by ID (scoped by school)
 */
const getReaderById = async (req, res) => {
  try {
    const schoolObjectId = getSchoolObjectId(req);
    const reader = await Reader.findOne({
      _id: req.params.id,
      schoolId: schoolObjectId,
    });
    if (!reader) return res.status(404).json({ message: "Reader not found" });
    return res.status(200).json({ reader });
  } catch (err) {
    console.error("GET READER BY ID ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Update reader
 */
const updateReader = async (req, res) => {
  const { firstName, lastName, teacher, grade } = req.body;
  try {
    const schoolObjectId = getSchoolObjectId(req);
    const reader = await Reader.findOneAndUpdate(
      { _id: req.params.id, schoolId: schoolObjectId },
      { firstName, lastName, teacher, grade },
      { new: true }
    );
    if (!reader) return res.status(404).json({ message: "Reader not found" });
    return res.json({ reader });
  } catch (error) {
    console.error("UPDATE READER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Delete reader
 */
const deleteReader = async (req, res) => {
  try {
    const schoolObjectId = getSchoolObjectId(req);
    const reader = await Reader.findOneAndDelete({
      _id: req.params.id,
      schoolId: schoolObjectId,
    });
    if (!reader) return res.status(404).json({ message: "Reader not found" });
    return res.json({ message: "Reader deleted successfully" });
  } catch (error) {
    console.error("DELETE READER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Log reading (new or borrowed book)
 */
const ICON_BY_LEVEL = (level) => {
  const icons = ["medal", "trophy", "star", "crown", "rocket"];
  return icons[(level - 1) % icons.length];
};

const logReading = async (req, res) => {
  try {
    const { id } = req.params; // readerId
    const { bookId, title, author, pages, summary, completedAt } = req.body;

    const reader = await Reader.findById(id);
    if (!reader) return res.status(404).json({ message: "Reader not found" });

    let bookData = {};
    if (bookId) {
      const borrowedBook = await Book.findById(bookId);
      if (!borrowedBook) return res.status(404).json({ message: "Book not found" });
      bookData = {
        title: borrowedBook.title,
        author: borrowedBook.author,
        pages: Number(pages) || 0,
        summary: summary || "",
        completedAt: completedAt ? new Date(completedAt) : new Date(),
      };
    } else {
      bookData = {
        title: title || "Untitled",
        author: author || "Unknown",
        pages: Number(pages) || 0,
        summary: summary || "",
        completedAt: completedAt ? new Date(completedAt) : new Date(),
      };
    }

    const before = reader.pagesRead || 0;
    const add = Number(bookData.pages) || 0;

    reader.books.push({
      ...bookData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    reader.pagesRead = before + add;

    // ✅ Badge calculation
    const prevMilestones = Math.floor(before / 100);
    const newMilestones = Math.floor(reader.pagesRead / 100);
    if (newMilestones > prevMilestones) {
      for (let level = prevMilestones + 1; level <= newMilestones; level++) {
        reader.badges.push({
          level,
          points: 10,
          icon: ICON_BY_LEVEL(level),
          earnedAt: new Date(),
        });
      }
    }

    const updatedReader = await reader.save();
    return res.json({ reader: updatedReader });
  } catch (err) {
    console.error("LOG READING ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get badges
 */
const getBadges = async (req, res) => {
  try {
    const reader = await Reader.findById(req.params.id).select(
      "firstName lastName badges pagesRead"
    );
    if (!reader) return res.status(404).json({ message: "Reader not found" });
    res.json({
      readerId: reader._id,
      name: `${reader.firstName} ${reader.lastName}`,
      pagesRead: reader.pagesRead,
      badges: reader.badges || [],
    });
  } catch (err) {
    console.error("GET BADGES ERROR:", err);
    res.status(500).json({ message: "Server error loading badges" });
  }
};

/**
 * Top readers (with optional school filter)
 */
// const getTopReaders = async (req, res) => {
//   try {
//     const { schoolId } = req.query;
//     const filter = schoolId ? { schoolId } : {};
//     const readers = await Reader.find(filter)
//       .sort({ pagesRead: -1 })
//       .limit(10)
//       .select("firstName lastName grade teacher pagesRead");
//     res.json({ readers });
//   } catch (err) {
//     console.error("GET TOP READERS ERROR:", err);
//     res.status(500).json({ message: "Failed to load top readers" });
//   }
// };
// ✅ Get top readers (sorted by pages read)
// const getTopReaders = async (req, res) => {
//   try {
//     const schoolId = req.query.schoolId;
//     const filter = schoolId ? { school: schoolId } : {};

//     console.log("🎯 Fetching top readers for:", schoolId || "All Schools");

//     const readers = await Reader.find(filter)
//       .sort({ pagesRead: -1 })
//       .limit(5);

//     res.json({ readers });
//   } catch (err) {
//     console.error("❌ getTopReaders error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// ✅ Get top readers (sorted by pages read)
const getTopReaders = async (req, res) => {
  try {
    const schoolId = req.query.schoolId;
    const filter = schoolId ? { schoolId } : {}; // ✅ correct field name

    console.log("🎯 Fetching top readers for:", schoolId || "All Schools");

    const readers = await Reader.find(filter)
      .sort({ pagesRead: -1 })
      .limit(5)
      .select("firstName lastName grade teacher pagesRead"); // optional fields to return

    res.json({ readers });
  } catch (err) {
    console.error("❌ getTopReaders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update book in a reader’s list
 */
const updateBook = async (req, res) => {
  try {
    const { readerId, bookId } = req.params;
    const { title, author, pages, summary, completedAt } = req.body;

    const reader = await Reader.findById(readerId);
    if (!reader) return res.status(404).json({ message: "Reader not found" });

    const book = reader.books.id(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const oldPages = Number(book.pages) || 0;
    const newPages = pages != null ? Number(pages) : oldPages;
    const diff = newPages - oldPages;

    if (title != null) book.title = title;
    if (author != null) book.author = author;
    if (pages != null) book.pages = newPages;
    if (summary != null) book.summary = summary;
    if (completedAt != null) book.completedAt = new Date(completedAt);

    reader.pagesRead += diff;
    reader.markModified("books");

    const updatedReader = await reader.save();
    return res.json({ reader: updatedReader });
  } catch (err) {
    console.error("UPDATE BOOK ERROR:", err);
    return res.status(500).json({ message: "Server error updating book" });
  }
};

/**
 * Delete book
 */
const deleteBook = async (req, res) => {
  try {
    const { readerId, bookId } = req.params;
    const reader = await Reader.findById(readerId);
    if (!reader) return res.status(404).json({ message: "Reader not found" });

    if (
      String(reader.parent) !== String(req.user.id || req.user.userId) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const book = reader.books.id(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const pagesToSubtract = Number(book.pages) || 0;
    await book.deleteOne();
    reader.pagesRead = Math.max(0, (reader.pagesRead || 0) - pagesToSubtract);

    const updatedReader = await reader.save();
    return res.json({ reader: updatedReader });
  } catch (err) {
    console.error("DELETE BOOK ERROR:", err);
    return res.status(500).json({ message: "Server error deleting book" });
  }
};

/**
 * Distinct fields (scoped to school)
 */
const getTeachers = async (req, res) => {
  try {
    const schoolObjectId = getSchoolObjectId(req);
    const teachers = await Reader.distinct("teacher", { schoolId: schoolObjectId });
    res.json({ teachers });
  } catch (err) {
    console.error("GET TEACHERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getGrades = async (req, res) => {
  try {
    const schoolObjectId = getSchoolObjectId(req);
    const grades = await Reader.distinct("grade", { schoolId: schoolObjectId });
    res.json({ grades });
  } catch (err) {
    console.error("GET GRADES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Admin-only functions
 */
const getAllReaders = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admins can view all readers" });
  }
  try {
    const schoolObjectId = getSchoolObjectId(req);
    const readers = await Reader.find({ schoolId: schoolObjectId })
      .populate("parent", "email")
      .lean();
    return res.json(readers);
  } catch (err) {
    console.error("GET ALL READERS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const adminAddReader = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admins can add readers" });
  }

  const { firstName, lastName, grade, teacher, parentId } = req.body;
  if (!firstName || !lastName || !teacher || !grade) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const schoolObjectId = getSchoolObjectId(req);
    const reader = new Reader({
      parent: parentId || null,
      firstName,
      lastName,
      teacher,
      grade,
      schoolId: schoolObjectId,
    });

    await reader.save();
    res.status(201).json(reader);
  } catch (err) {
    console.error("ADMIN ADD READER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addReader,
  getReaders,
  getReaderById,
  updateReader,
  deleteReader,
  logReading,
  getTopReaders,
  updateBook,
  deleteBook,
  getBadges,
  getTeachers,
  getGrades,
  getAllReaders,
  adminAddReader,
};
