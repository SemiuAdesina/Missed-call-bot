require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/mongoConfig"); 


const zapierRoutes = require("./routes/zapierRoutes");
const chatRoutes = require("./routes/chatRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const calendarRoutes = require("./routes/calendarRoutes");

const app = express();
app.use(cors());
app.use(express.json());


// MongoDB connection
connectDB();

//  Route mounting
app.use("/zapier", zapierRoutes);
app.use("/chat", chatRoutes);
app.use("/price", stripeRoutes);
app.use("/calendar", calendarRoutes);

//  Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Health Check Route (for Render uptime monitoring)
app.get("/health", (req, res) => res.status(200).send("OK"));

//  Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
