const express = require("express");
const { getCakePrice } = require("../controllers/stripeController");

const router = express.Router();
router.post("/estimate", getCakePrice);

module.exports = router;
