// backend-node/controllers/schoolController.js
const School = require("../models/School");

// GET /schools/by-code/:code
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
