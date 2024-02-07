const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router
  .route("/")
  .get(analyticsController.getAllEventsWithParticipants)
  .post(analyticsController.createEventWithParticipant);

router
  .route("/:id")
  .get(analyticsController.getEventsWithParticipnats)
  .patch(analyticsController.updateEventPraticipant)
  .delete(analyticsController.deleteEventParticipant);

module.exports = router;
