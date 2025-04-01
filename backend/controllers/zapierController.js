const getTelnyx = require("../config/telnyxConfig");
const openai = require("../config/openaiConfig");
const generatePrompt = require("../config/faqPrompt");
const axios = require("axios"); 

exports.handleTelnyxWebhook = async (req, res) => {
  try {
    console.log("Webhook HIT - Raw Body:", req.body);

    const { from_number } = req.body;
    const replies = [];

    for (const key in req.body) {
      if (key.startsWith("text")) {
        const userMessage = req.body[key];
        const prompt = generatePrompt(userMessage);

        let reply = "Test reply"; // default in test

        if (process.env.NODE_ENV !== "test") {
          const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
          });

          reply = response.choices[0].message.content?.trim();

          const telnyx = await getTelnyx();

          await telnyx.messages.create({
            from: process.env.TELNYX_PHONE_NUMBER,
            to: from_number,
            messaging_profile_id: process.env.TELNYX_MESSAGING_PROFILE_ID,
            text: reply,
          });

          //  Check for appointment keywords and trigger Cronofy route
          if (
            userMessage.toLowerCase().includes("schedule") ||
            userMessage.toLowerCase().includes("pickup") ||
            userMessage.toLowerCase().includes("appointment")
          ) {
            try {
              const cronofyResponse = await axios.post(
                "http://localhost:3000/calendar/book",
                {
                  from: from_number,
                  message: userMessage,
                }
              );
              console.log("Cronofy Booking:", cronofyResponse.data);
            } catch (err) {
              console.error("Cronofy Booking Error:", err.response?.data || err.message);
            }
          }
        }

        replies.push({ question: userMessage, answer: reply });
        console.log(`AI Reply to ${key}: ${reply}`);
      }
    }

    res.status(200).json({ message: "All AI replies sent via Telnyx", replies });
  } catch (error) {
    console.error("Telnyx/ChatGPT Error:", error?.response?.data || error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
