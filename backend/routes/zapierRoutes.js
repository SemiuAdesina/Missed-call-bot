const express = require("express");
const { handleTelnyxWebhook } = require("../controllers/zapierController");

const router = express.Router();
router.post("/telnyx-hook", handleTelnyxWebhook);

module.exports = router;
