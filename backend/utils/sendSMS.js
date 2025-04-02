const getTelnyx = require("../config/telnyxConfig");

const sendSMS = async (to, message) => {
  if (process.env.NODE_ENV === "test") {
    console.log(`[TEST MODE] SMS to ${to}: ${message}`);
    return { message: "Test SMS skipped" };
  }

  try {
    const telnyx = await getTelnyx();

    // 👉 Log before sending
    console.log("👉 Sending SMS to:", to);
    console.log("👉 Message:", message);

    const response = await telnyx.messages
      .create({
        from: process.env.TELNYX_PHONE_NUMBER,
        to,
        text: message,
      })
      .then((res) => {
        console.log("Telnyx SMS sent successfully");
        return res;
      })
      .catch((error) => {
        console.error("Telnyx create() failed:", error.message || error);
        throw error;
      });

    return response;
  } catch (error) {
    console.error("Failed to send SMS:", error.message || error);
    throw error;
  }
};

module.exports = sendSMS;
