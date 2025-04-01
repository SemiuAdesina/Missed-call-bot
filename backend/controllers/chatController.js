const openai = require("../config/openaiConfig");
const smsDispatcher = require("../utils/smsDispatcher");
const generatePrompt = require("../config/faqPrompt");
const notifyOwner = require("../utils/notifyOwner");

exports.handleChatResponse = async (req, res) => {
  const { from, message } = req.body;

  const prompt = generatePrompt(message);

  try {
    let reply = "Test mode reply";

    if (process.env.NODE_ENV !== "test") {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      });

      reply = response.choices[0].message.content;

      //Send SMS to customer
      await smsDispatcher({
        type: "chat_reply",
        to: from,
        data: { reply },
      });

      //Send email to business owner
      await notifyOwner({
        subject: "New Customer Chat via Missed Call Bot",
        text: `A new message was received:\n\nFrom: ${from}\nMessage: ${message}\n\nBot Reply:\n${reply}`,
      });
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error("ChatGPT error:", err);
    res.status(500).json({ error: "ChatGPT failed" });
  }
};
