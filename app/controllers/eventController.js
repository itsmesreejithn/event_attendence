const Events = require("../models/eventModel");
const Participants = require("../models/participantsModel");
const Mapping = require("../models/eventParticipantsMappingModel");
const db = require("../utils/dbConnection");
const { Op } = require("sequelize");
exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Events.findAll({
      attributes: {
        exclude: ["eventId", "createdAt", "updatedAt"],
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        events,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: `Failed to fetch events, ${error}`,
    });
  }
};

exports.createEvent = async (req, res, next) => {
  const { eventName } = req.body;
  try {
    const newEvent = await Events.create({
      eventName: eventName,
    });
    res.status(201).json({
      status: "success",
      data: {
        event: newEvent,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: `Failed to create an event, ${error}`,
    });
  }
};

exports.createEventWithParticipant = async (req, res, next) => {
  const { eventName, participantName, participationMode } = req.body;
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
    const newParticipant = await Participants.create(
      {
        participantName,
        participationMode,
      },
      {
        transaction,
      }
    );
    console.log(newEvent);
    await Mapping.create(
      {
        eventId: newEvent.eventId,
        participantId: newParticipant.participantId,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    res.status(201).json({
      status: "success",
      data: {
        event: newEvent,
        participant: newParticipant,
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
