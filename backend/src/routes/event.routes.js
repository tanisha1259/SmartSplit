const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { createEvent, joinEvent } = require("../controllers/event.controller");

const router = express.Router();

router.post("/", auth, createEvent);
router.post("/join", auth, joinEvent);

module.exports = router;
