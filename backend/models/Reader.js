const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    summary: String,
    pages: Number,
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const BadgeSchema = new mongoose.Schema(
  {
    level: { type: Number, required: true },        // 1 for 100 pages, 2 for 200, ...
    points: { type: Number, default: 10 },          // per-badge points (tweak as you like)
    icon:   { type: String, default: "medal" },     // key used by frontend to show icon
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: false } // badges don’t need separate _id unless you want to edit them individually
);

const ReaderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
   grade: { type: String, enum: ["1","2","3","4","5","6"], required: true },
    // ✅ New: link to school
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: false },

    teacher:   { type: String, required: true },
    // parent:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

    books:     [BookSchema],
    pagesRead: { type: Number, default: 0 },
    badges:    [BadgeSchema],                         // ✅ new
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reader", ReaderSchema);
