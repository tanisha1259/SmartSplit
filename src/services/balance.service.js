const Expense = require("../models/Expense.model");
const Lent = require("../models/Lent.model");
const Event = require("../models/Event.model");

const calculateEventBalances = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const members = event.members;

  const balances = {};

  // Initialize all balances to 0
  members.forEach((member) => {
    balances[member.toString()] = 0;
  });

  // Process Expenses
  const expenses = await Expense.find({ eventId });

  expenses.forEach((expense) => {
    const share = expense.amount / expense.splitAmong.length;

    // PaidBy gets full amount
    balances[expense.paidBy.toString()] += expense.amount;

    // Each member pays their share
    expense.splitAmong.forEach((member) => {
      balances[member.toString()] -= share;
    });
  });

  // Process Lent
  const lentRecords = await Lent.find({ eventId });

  lentRecords.forEach((lent) => {
    const remaining = lent.amountLent - lent.amountSettled;

    balances[lent.lender.toString()] += remaining;
    balances[lent.borrower.toString()] -= remaining;
  });

  return balances;
};

module.exports = { calculateEventBalances };
