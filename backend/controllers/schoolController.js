// // backend-node/controllers/schoolController.js
// const School = require("../models/School");

// // GET /schools/by-code/:code
// exports.getSchoolByCode = async (req, res) => {
//   try {
//     const school = await School.findOne({ accessCode: req.params.code });
//     if (!school) return res.status(404).json(null);
//     res.json(school);
//   } catch (err) {
//     console.error("GET SCHOOL ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// backend-node/controllers/schoolController.js
const School = require("../models/School");

// ✅ POST /api/schools/verify
exports.verifySchool = async (req, res) => {
  try {
    const { code } = req.body;
    console.log("🔍 Received school code:", code);

    if (!code) {
      return res.status(400).json({ success: false, message: "School code is required" });
    }

    const school = await School.findOne({ accessCode: code.trim().toUpperCase() });

    if (!school) {
      return res.status(404).json({ success: false, message: "Invalid or unknown school code" });
    }

    res.json({ success: true, school });
  } catch (err) {
    console.error("❌ VERIFY SCHOOL ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Optional existing route for GET /api/schools/by-code/:code
exports.getSchoolByCode = async (req, res) => {
  try {
    const school = await School.findOne({ accessCode: req.params.code });
    if (!school) return res.status(404).json(null);
    res.json(school);
  } catch (err) {
    console.error("GET SCHOOL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
