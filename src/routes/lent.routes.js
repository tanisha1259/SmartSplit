const express = require("express");
const auth = require("../middlewares/auth.middleware");
const {
  addLent,
  settleLent,
  getEventLent,
} = require("../controllers/lent.controller");

const router = express.Router();

router.post("/:eventId/lent", auth, addLent);
router.patch("/lent/:lentId/settle", auth, settleLent);
router.get("/:eventId/lent", auth, getEventLent);

module.exports = router;
