const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { createEvent, joinEvent } = require("../controllers/event.controller");
const Event = require("../models/Event.model");
const {
  calculateEventBalances,
  simplifyBalances,
} = require("../services/balance.service");

const router = express.Router();

// Create Event
router.post("/", auth, createEvent);

// Join Event
router.post("/join", auth, joinEvent);

// Get Single Event
router.get("/:eventId", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Raw Balances
router.get("/:eventId/balances", auth, async (req, res) => {
  try {
    const balances = await calculateEventBalances(req.params.eventId);
    res.json(balances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Simplified Settlements (Who Pays Whom)
router.get("/:eventId/settlements", auth, async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const balances = await calculateEventBalances(eventId);
    const settlements = simplifyBalances(balances);

    // Fetch event with members populated
    const event = await Event.findById(eventId).populate("members", "name");

    const userMap = {};
    event.members.forEach((member) => {
      userMap[member._id.toString()] = member.name;
    });

    const readableSettlements = settlements.map((s) => ({
      from: {
        id: s.from,
        name: userMap[s.from],
      },
      to: {
        id: s.to,
        name: userMap[s.to],
      },
      amount: s.amount,
    }));

    res.json(readableSettlements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
