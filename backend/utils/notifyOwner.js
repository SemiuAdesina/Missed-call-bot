// backend/utils/notifyOwner.js
const transporter = require("../config/emailConfig");

const notifyOwner = async ({ subject, text }) => {
  await transporter.sendMail({
    from: `"Sydney's Cakes Bot" <${process.env.SMTP_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject,
    text,
  });

  console.log("📧 Notification sent to owner!");
};

module.exports = notifyOwner;
