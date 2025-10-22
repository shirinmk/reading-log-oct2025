


const mongoose = require("mongoose");
const Reader = require("../models/Reader");

// Helper to cast schoolId safely
function getSchoolObjectId(req) {
  if (!req.user.schoolId) return null;
  try {
    return new mongoose.Types.ObjectId(req.user.schoolId);
  } catch (err) {
    console.error("Invalid schoolId format:", req.user.schoolId);
    return null;
  }
}

// 📋 List all readers for this admin's school
exports.listReaders = async (req, res) => {
  try {
    const schoolObjectId = getSchoolObjectId(req);
    if (!schoolObjectId) {
      return res.status(400).json({ message: "Invalid schoolId" });
    }

    const readers = await Reader.find({ schoolId: schoolObjectId })
      .populate("parent", "firstName lastName email")
      .sort({ pagesRead: -1 }); // highest pages first

    res.json(readers);
  } catch (err) {
    console.error("ADMIN listReaders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📊 Summary by teacher
exports.summaryByTeacher = async (req, res) => {
  try {
    const schoolObjectId = getSchoolObjectId(req);
    if (!schoolObjectId) {
      return res.status(400).json({ message: "Invalid schoolId" });
    }

    const summary = await Reader.aggregate([
      { $match: { schoolId: schoolObjectId, teacher: { $ne: null, $ne: "" } } },
      {
        $group: {
          _id: "$teacher",
          totalPages: { $sum: "$pagesRead" },
          students: { $sum: 1 },
          avgPages: { $avg: "$pagesRead" },
        },
      },
      { $sort: { totalPages: -1 } },
    ]);

    const results = await Promise.all(
      summary.map(async (s) => {
        const topReader = await Reader.findOne({
          teacher: s._id,
          schoolId: schoolObjectId,
        })
          .sort({ pagesRead: -1 })
          .select("firstName lastName pagesRead")
          .lean();

        return {
          teacher: s._id || "—",
          totalPages: s.totalPages,
          students: s.students,
          avgPages: Math.round(s.avgPages || 0),
          topReader: topReader
            ? {
                firstName: topReader.firstName,
                lastName: topReader.lastName,
                pagesRead: topReader.pagesRead,
              }
            : null,
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("ADMIN summaryByTeacher error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📊 Summary by grade
exports.summaryByGrade = async (req, res) => {
  try {
    const schoolObjectId = getSchoolObjectId(req);
    if (!schoolObjectId) {
      return res.status(400).json({ message: "Invalid schoolId" });
    }

    const summary = await Reader.aggregate([
      { $match: { schoolId: schoolObjectId, grade: { $ne: null, $ne: "" } } },
      {
        $group: {
          _id: "$grade",
          totalPages: { $sum: "$pagesRead" },
          students: { $sum: 1 },
          avgPages: { $avg: "$pagesRead" },
        },
      },
      { $sort: { totalPages: -1 } },
    ]);

    const results = await Promise.all(
      summary.map(async (s) => {
        const topReader = await Reader.findOne({
          grade: s._id,
          schoolId: schoolObjectId,
        })
          .sort({ pagesRead: -1 })
          .select("firstName lastName pagesRead")
          .lean();

        return {
          grade: s._id || "—",
          totalPages: s.totalPages,
          students: s.students,
          avgPages: Math.round(s.avgPages || 0),
          topReader: topReader
            ? {
                firstName: topReader.firstName,
                lastName: topReader.lastName,
                pagesRead: topReader.pagesRead,
              }
            : null,
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("ADMIN summaryByGrade error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
