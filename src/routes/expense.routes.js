const express = require("express");
const auth = require("../middlewares/auth.middleware");
const {
  addExpense,
  getEventExpenses,
} = require("../controllers/expense.controller");

const router = express.Router();

router.post("/:eventId/expenses", auth, addExpense);
router.get("/:eventId/expenses", auth, getEventExpenses);

module.exports = router;
