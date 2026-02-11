const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { createEvent, joinEvent } = require("../controllers/event.controller");
const Event = require("../models/Event.model"); // 👈 ADD THIS LINE
const { calculateEventBalances } = require("../services/balance.service");

const router = express.Router();

router.post("/", auth, createEvent);
router.post("/join", auth, joinEvent);

router.get("/:eventId", auth, async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  res.json(event);
});

router.get("/:eventId/balances", auth, async (req, res) => {
  try {
    const balances = await calculateEventBalances(req.params.eventId);
    res.json(balances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
