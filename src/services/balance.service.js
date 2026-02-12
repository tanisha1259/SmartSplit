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

const simplifyBalances = (balances) => {
  const creditors = [];
  const debtors = [];

  // Separate creditors and debtors
  Object.entries(balances).forEach(([userId, amount]) => {
    if (amount > 0) {
      creditors.push({ userId, amount });
    } else if (amount < 0) {
      debtors.push({ userId, amount: -amount }); // convert to positive
    }
  });

  const settlements = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const payment = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: payment,
    });

    debtor.amount -= payment;
    creditor.amount -= payment;

    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }

  return settlements;
};

module.exports = { calculateEventBalances, simplifyBalances };

