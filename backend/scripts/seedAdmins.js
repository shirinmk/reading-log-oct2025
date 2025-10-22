// seed/seedAdmins.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const School = require("../models/School");
const User = require("../models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    const admins = [
      {
        email: process.env.ADMIN1_EMAIL,
        password: process.env.ADMIN1_PASS,
        schoolCode: process.env.ADMIN1_SCHOOL
      },
      {
        email: process.env.ADMIN2_EMAIL,
        password: process.env.ADMIN2_PASS,
        schoolCode: process.env.ADMIN2_SCHOOL
      }
    ];

    for (const admin of admins) {
      if (!admin.email || !admin.password || !admin.schoolCode) {
        console.warn("Skipping incomplete admin entry:", admin);
        continue;
      }

      const school = await School.findOne({ accessCode: admin.schoolCode });
      if (!school) {
        console.error(`❌ School not found for code ${admin.schoolCode}`);
        continue;
      }

      const existing = await User.findOne({ email: admin.email });
      if (existing) {
        console.log(`ℹ️ Admin already exists: ${admin.email}`);
        continue;
      }

      const hashed = await bcrypt.hash(admin.password, 12);

      await User.create({
        firstName: "Admin",
        lastName: school.name,
        username: admin.email.split("@")[0],
        email: admin.email,
        password: hashed,
        role: "admin",
        schoolId: school._id,
        isVerified: true // skip email verification for admins
      });

      console.log(`✅ Created admin: ${admin.email} for ${school.name}`);
    }

    mongoose.disconnect();
  })
  .catch(err => console.error(err));
