const Participants = require("../models/participantsModel");
const Mapping = require("../models/eventParticipantsMappingModel");
const db = require("../utils/dbConnection");
const { Op } = require("sequelize");
const Events = require("../models/eventModel");

exports.createEventWithParticipant = async (req, res, next) => {
  const { eventName, participants } = req.body;
  const transaction = await db.transaction();

  try {
    const newEvent = await Events.create(
      {
        eventName,
      },
      {
        transaction,
      }
    );
    const newParticipants = await Participants.bulkCreate(participants, {
      transaction,
    });
    const mappingRecords = newParticipants.map((participant) => {
      return {
        eventId: newEvent.eventId,
        participantId: participant.participantId,
      };
    });
    await Mapping.bulkCreate(mappingRecords, {
      transaction,
    });

    await transaction.commit();

    res.status(201).json({
      status: "success",
      data: {
        event: newEvent,
        participant: newParticipants,
      },
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      status: "failed",
      message: "Failed to create event and participant",
      error: error.message,
    });
  }
};

exports.getAllEventsWithParticipants = async (req, res, next) => {
  try {
    const eventsPrticipants = await Events.findAll({
      include: [
        {
          model: Participants,
          through: {
            model: Mapping,
          },
        },
      ],
    });
    res.status(200).json({
      status: "success",
      data: {
        events: eventsPrticipants,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};
