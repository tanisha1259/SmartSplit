const mongoose = require("mongoose");

const lentSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    lender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amountLent: {
      type: Number,
      required: true,
      min: 0,
    },
    amountSettled: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["open", "settled"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lent", lentSchema);
