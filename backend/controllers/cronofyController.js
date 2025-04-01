const cronofy = require("../config/cronofyConfig");
const smsDispatcher = require("../utils/smsDispatcher");
const notifyOwner = require("../utils/notifyOwner"); // 

exports.bookAppointment = async (req, res) => {
  const { from, message } = req.body;

  if (!message || !from) {
    return res.status(400).json({ error: "Missing 'from' or 'message' in request body." });
  }

  const date = message.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  const time = message.match(/\d{1,2}:\d{2}/)?.[0] || "10:00";

  if (!date) {
    return res.status(400).json({ error: "No valid date found in message." });
  }

  try {
    const calendarId = process.env.CRONOFY_CALENDAR_ID;
    const eventId = `cake-${Date.now()}`;
    const startTime = `${date}T${time}:00-04:00`;
    const endTime = `${date}T${time}:00-04:00`; // Adjust if needed

    //  Book the event via Cronofy
    await cronofy.post(`/v1/calendars/${calendarId}/events`, {
      event_id: eventId,
      summary: `Cake appointment for ${from}`,
      description: "Scheduled via missed call bot",
      start: startTime,
      end: endTime,
      tzid: "America/New_York",
    });

    // Send confirmation SMS to customer
    await smsDispatcher({
      type: "appointment_booked",
      to: from,
      data: { date, time },
    });

    //  Notify the business owner via email
    await notifyOwner({
      subject: " New Appointment Booked",
      text: `A customer booked an appointment:\n\nFrom: ${from}\nDate: ${date}\nTime: ${time}\n\nOriginal message:\n${message}`,
    });

    res.status(200).json({
      message: `Appointment booked for ${date} at ${time}`,
    });
  } catch (err) {
    console.error("Cronofy Booking Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to book appointment" });
  }
};
