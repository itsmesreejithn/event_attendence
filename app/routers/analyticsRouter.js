const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const auth = require("../controllers/authController");

router
  .route("/")
  .get(auth.protect, analyticsController.getAllEventsWithParticipants)
  .post(auth.protect, analyticsController.createEventWithParticipant);

router
  .route("/:id")
  .get(analyticsController.getEventsWithParticipnats)
  .patch(analyticsController.updateEventPraticipant)
  .delete(analyticsController.deleteEventParticipant);

module.exports = router;
