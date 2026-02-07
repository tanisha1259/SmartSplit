const Event = require("../models/Event.model");
const crypto = require("crypto");

const createEvent = async (req, res) => {
  try {
    const joinCode = crypto.randomBytes(4).toString("hex");

    const event = await Event.create({
      name: req.body.name,
      createdBy: req.userId,
      members: [req.userId],
      joinCode,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Event creation failed" });
  }
};

const joinEvent = async (req, res) => {
  try {
    const { joinCode } = req.body;

    const event = await Event.findOne({ joinCode });
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (!event.members.includes(req.userId)) {
      event.members.push(req.userId);
      await event.save();
    }

    res.json({ message: "Joined event successfully" });
  } catch (err) {
    res.status(500).json({ message: "Join failed" });
  }
};

module.exports = { createEvent, joinEvent };
