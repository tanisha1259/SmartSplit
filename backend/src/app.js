const express = require("express");
const cors = require("cors");

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

module.exports = app;
