// utils/sendEmail.js
require("dotenv").config();
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// Debug logs
console.log("==== Email Config Debug (AWS SES) ====");
console.log("AWS_REGION:", process.env.AWS_REGION || "❌ MISSING");
console.log("SUPPORT_EMAIL:", process.env.SUPPORT_EMAIL || "❌ MISSING");
console.log("======================================");

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function sendEmail(to, subject, text, html) {
  try {
    console.log("📤 Sending email via AWS SES →", to);

    const params = {
      Destination: { ToAddresses: [to] },
      Message: {
        Body: {
          Text: { Data: text },
          Html: { Data: html },
        },
        Subject: { Data: subject },
      },
      Source: process.env.SUPPORT_EMAIL, // must be verified in SES
    };

    const command = new SendEmailCommand(params);
    const response = await ses.send(command);

    console.log("✅ Email sent via AWS SES:", response.MessageId);
    return response;
  } catch (error) {
    console.error("❌ AWS SES send error:", error.message);
    console.log("📨 Email not sent. Payload preview:", { to, subject });
    throw error;
  }
}

module.exports = sendEmail;
