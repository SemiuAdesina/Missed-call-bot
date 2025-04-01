require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function refreshAccessToken() {
  try {
    const res = await axios.post("https://api.cronofy.com/oauth/token", {
      client_id: process.env.CRONOFY_CLIENT_ID,
      client_secret: process.env.CRONOFY_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: process.env.CRONOFY_REFRESH_TOKEN,
    });

    const newToken = res.data.access_token;

    // Update .env file
    const envPath = path.resolve(__dirname, "../.env");
    let envContent = fs.readFileSync(envPath, "utf8");
    envContent = envContent.replace(/CRONOFY_ACCESS_TOKEN=.*/g, `CRONOFY_ACCESS_TOKEN=${newToken}`);
    fs.writeFileSync(envPath, envContent);

    console.log("Cronofy access token refreshed");
    return newToken;
  } catch (err) {
    console.error("Failed to refresh Cronofy token", err.response?.data || err.message);
    throw err;
  }
}

module.exports = refreshAccessToken;
