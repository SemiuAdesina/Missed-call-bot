require("dotenv").config();

let telnyxInstance = null;

const getTelnyx = async () => {
  if (!telnyxInstance) {
    const { default: telnyx } = await import("telnyx");
    telnyxInstance = telnyx(process.env.TELNYX_API_KEY);

    
  }
  return telnyxInstance;
};

module.exports = getTelnyx;
