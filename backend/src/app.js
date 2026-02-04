const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running 🚀",
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

module.exports = app;
