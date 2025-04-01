require("dotenv").config();
const axios = require("axios");
const refreshAccessToken = require("../utils/cronofyAuth");

let cronofy = axios.create({
  baseURL: "https://api.cronofy.com",
  headers: {
    Authorization: `Bearer ${process.env.CRONOFY_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// Auto-refresh and retry logic
cronofy.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    // Only try once (prevent infinite loop)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      console.log("Token expired. Refreshing...");

      originalRequest._retry = true;
      const newToken = await refreshAccessToken();

      // Recreate client with new token
      cronofy = axios.create({
        baseURL: "https://api.cronofy.com",
        headers: {
          Authorization: `Bearer ${newToken}`,
          "Content-Type": "application/json",
        },
      });

      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return cronofy(originalRequest);
    }

    return Promise.reject(error);
  }
);

module.exports = cronofy;
