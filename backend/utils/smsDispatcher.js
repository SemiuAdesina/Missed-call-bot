const sendSMS = require("./sendSMS");
const SMSLog = require("../models/SMSLog");
const templates = require("../config/smsTemplates");

const smsDispatcher = async ({ type, to, data }) => {
  if (!templates[type]) throw new Error("Invalid SMS type");

  const message = templates[type](data);

  // ✅ In test mode, skip actual sending and DB writes
  if (process.env.NODE_ENV === "test") {
    console.log("[TEST MODE] Skipping SMS & DB:", { to, message, type });
    return { success: true, test: true };
  }

  try {
    await sendSMS(to, message);

    await SMSLog.create({
      to,
      message,
      status: "SENT",
      type,
    });

    return { success: true };
  } catch (err) {
    await SMSLog.create({
      to,
      message,
      status: "FAILED",
      type,
    });

    throw err;
  }
};

module.exports = smsDispatcher;
