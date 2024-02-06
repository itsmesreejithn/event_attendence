const express = require("express");
const eventController = require("../controllers/eventController");
const mappingModel = require("../models/eventParticipantsMappingModel");
const router = express.Router();

router
  .route("/")
  .get(eventController.getAllEvents)
  .post(eventController.createEvent);

module.exports = router;
