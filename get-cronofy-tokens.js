const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 3000;

const AUTH_URL = `https://app.cronofy.com/oauth/authorize?response_type=code&client_id=${process.env.CRONOFY_CLIENT_ID}&redirect_uri=${process.env.CRONOFY_REDIRECT_URI}&scope=read_write&state=secure_state`;

app.get("/", (req, res) => {
  res.send(`<a href="${AUTH_URL}">🔗 Connect Cronofy Calendar</a>`);
});

app.get("/cronofy/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post("https://api.cronofy.com/oauth/token", {
      client_id: process.env.CRONOFY_CLIENT_ID,
      client_secret: process.env.CRONOFY_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.CRONOFY_REDIRECT_URI,
    });

    console.log("ACCESS TOKEN:", response.data.access_token);
    console.log("REFRESH TOKEN:", response.data.refresh_token);
    console.log("PROFILE ID:", response.data.profile_id);

    res.send("Tokens fetched! Check terminal and update your .env file.");
  } catch (err) {
    console.error("Failed to get Cronofy tokens:", err.message);
    res.send("Error fetching tokens");
  }
});

app.listen(PORT, () => {
  console.log(`Visit http://localhost:${PORT} to generate Cronofy tokens`);
});
