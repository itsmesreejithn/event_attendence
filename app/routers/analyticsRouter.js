const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router
  .route("/")
  .get(analyticsController.getAllEventsWithParticipants)
  .post(analyticsController.createEventWithParticipant);

module.exports = router;
