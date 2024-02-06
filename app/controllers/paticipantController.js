const Participants = require("../models/participantsModel");

exports.getAllParticipants = async (req, res, next) => {
  try {
    const participants = await Participants.findAll({
      attributes: {
        exclude: ["participantId", "updatedAt", "createdAt"],
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        participants,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: `Failed to fetch participants, ${error}`,
    });
  }
};

exports.createParticipant = async (req, res, next) => {
  const { participantName, participationMode } = req.body;
  try {
    const newParticipant = await Participants.create({
      participantName,
      participationMode,
    });
    res.status(200).json({
      status: "success",
      data: {
        paricipant: newParticipant,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: `Failed to create participant, ${error}`,
    });
  }
};
