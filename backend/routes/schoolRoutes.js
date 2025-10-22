// // backend-node/routes/schoolRoutes.js
// const express = require("express");
// const router = express.Router();
// const { getSchoolByCode } = require("../controllers/schoolController");

// router.get("/by-code/:code", getSchoolByCode);

// module.exports = router;


// backend-node/routes/schoolRoutes.js
const express = require("express");
const router = express.Router();
const { verifySchool, getSchoolByCode } = require("../controllers/schoolController");

// POST /api/schools/verify  (used by frontend when selecting school)
router.post("/verify", verifySchool);

// Optional GET route (for testing or admin use)
router.get("/by-code/:code", getSchoolByCode);

module.exports = router;
