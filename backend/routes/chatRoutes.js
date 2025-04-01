const express = require("express");
const { handleChatResponse } = require("../controllers/chatController");

const router = express.Router();
router.post("/chat", handleChatResponse);

module.exports = router;
