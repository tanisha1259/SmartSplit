const Expense = require("../models/Expense.model");
const Event = require("../models/Event.model");

const addExpense = async (req, res) => {
  try {
    const { title, amount, paidBy, splitAmong, category } = req.body;
    const eventId = req.params.eventId;

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    // Optional safety check: ensure users belong to event
    if (
      !event.members.includes(paidBy) ||
      !splitAmong.every((id) => event.members.includes(id))
    ) {
      return res.status(400).json({ message: "Invalid event members" });
    }

    const expense = await Expense.create({
      eventId,
      title,
      amount,
      paidBy,
      splitAmong,
      category,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Failed to add expense" });
  }
};

const getEventExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      eventId: req.params.eventId,
    }).populate("paidBy splitAmong", "name");

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

module.exports = { addExpense, getEventExpenses };
