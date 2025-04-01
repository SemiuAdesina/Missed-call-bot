require("dotenv").config();
const axios = require("axios");

(async () => {
  try {
    const res = await axios.get("https://api.cronofy.com/v1/calendars", {
      headers: {
        Authorization: `Bearer ${process.env.CRONOFY_ACCESS_TOKEN}`,
      },
    });

    console.log("Your Cronofy Calendars:");
    res.data.calendars.forEach((cal) => {
      console.log(`${cal.name} → calendar_id: ${cal.calendar_id}`);
    });
  } catch (err) {
    console.error("Failed to fetch calendars", err.response?.data || err.message);
  }
})();
