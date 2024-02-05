const express = require("express");
const eventController = require("../controllers/eventController");
const Events = require("../models/eventModel");
const Participants = require("../models/participantsModel");

const router = express.Router();

router
  .route("/")
  .get(eventController.getAllEvents)
  .post(eventController.createEvents);

module.exports = router;
