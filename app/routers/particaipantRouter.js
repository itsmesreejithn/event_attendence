const express = require("express");
const participantController = require("../controllers/paticipantController");

const router = express.Router();

router
  .route("/")
  .get(participantController.getAllParticipants)
  .post(participantController.createParticipant);

router
  .route("/:id")
  .get(participantController.getParticipant)
  .patch(participantController.updateParticipant)
  .delete(participantController.deleteParticipant);

module.exports = router;
