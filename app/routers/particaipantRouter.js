const express = require("express");
const participantController = require("../controllers/paticipantController");

const router = express.Router();

router
  .route("/")
  .get(participantController.getAllParticipants)
  .post(participantController.createParticipant);
