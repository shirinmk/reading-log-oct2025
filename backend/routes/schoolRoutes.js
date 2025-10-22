// backend-node/routes/schoolRoutes.js
const express = require("express");
const router = express.Router();
const { getSchoolByCode } = require("../controllers/schoolController");

router.get("/by-code/:code", getSchoolByCode);

module.exports = router;
