// seed/schools.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const School = require("../models/School");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Clear existing to avoid duplicates (optional)
    await School.deleteMany({});

    await School.create([
      { 
        name: "Morning Creek Elementary", 
        accessCode: "MC2025", 
        adminEmails: ["admin1@example.com"]   // ✅ School-specific admin
      },
      { 
        name: "Iranian School San Diego", 
        accessCode: "ISSD2025", 
        adminEmails: ["admin2@example.com"]   // ✅ School-specific admin
      }
    ]);

    console.log("✅ Schools with admins inserted");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ Error seeding schools:", err);
    mongoose.disconnect();
  });
