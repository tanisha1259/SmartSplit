const Lent = require("../models/Lent.model");
const Event = require("../models/Event.model");

const addLent = async (req, res) => {
  try {
    const { lender, borrower, amountLent } = req.body;
    const eventId = req.params.eventId;

    if (lender === borrower) {
      return res
        .status(400)
        .json({ message: "Lender and borrower cannot be same" });
    }

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (
      !event.members.includes(lender) ||
      !event.members.includes(borrower)
    ) {
      return res.status(400).json({ message: "Invalid event members" });
    }

    const lent = await Lent.create({
      eventId,
      lender,
      borrower,
      amountLent,
    });

    res.status(201).json(lent);
  } catch (err) {
    res.status(500).json({ message: "Failed to add lent record" });
  }
};

const settleLent = async (req, res) => {
  try {
    const { amount } = req.body;
    const lent = await Lent.findById(req.params.lentId);

    if (!lent)
      return res.status(404).json({ message: "Lent record not found" });

    lent.amountSettled += amount;

    if (lent.amountSettled >= lent.amountLent) {
      lent.amountSettled = lent.amountLent;
      lent.status = "settled";
    }

    await lent.save();

    res.json(lent);
  } catch (err) {
    res.status(500).json({ message: "Failed to settle lent amount" });
  }
};

const getEventLent = async (req, res) => {
  try {
    const lentRecords = await Lent.find({
      eventId: req.params.eventId,
    }).populate("lender borrower", "name");

    res.json(lentRecords);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch lent records" });
  }
};

module.exports = { addLent, settleLent, getEventLent };
