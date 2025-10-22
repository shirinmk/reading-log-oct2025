


const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const subject = `Support request from ${name} (${email})`;
    const html = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // ✅ fallback works now
    const recipient = process.env.SUPPORT_EMAIL || "manoochehri@gmail.com";

    await sendEmail(recipient, subject, message, html);

    res.json({ message: "Your message has been sent. Support will contact you soon." });
  } catch (err) {
    console.error("CONTACT SUPPORT ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
