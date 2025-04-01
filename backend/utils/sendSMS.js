const getTelnyx = require("../config/telnyxConfig");

const sendSMS = async (to, message) => {
  if (process.env.NODE_ENV === "test") {
    console.log(`[TEST MODE] SMS to ${to}: ${message}`);
    return { message: "Test SMS skipped" };
  }

  try {
    const telnyx = await getTelnyx(); // ✅ fix: get the actual Telnyx client

    const response = await telnyx.messages.create({
      from: process.env.TELNYX_PHONE_NUMBER,
      to,
      text: message,
    });

    console.log(`SMS sent to ${to}: ${message}`);
    return response;
  } catch (error) {
    console.error("Failed to send SMS:", error.message || error);
    throw error;
  }
};

module.exports = sendSMS;
