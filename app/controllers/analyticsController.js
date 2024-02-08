const Participants = require("../models/participantsModel");
const Mapping = require("../models/eventParticipantsMappingModel");
const db = require("../utils/dbConnection");
const { Op } = require("sequelize");
const Events = require("../models/eventModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createEventWithParticipant = catchAsync(async (req, res, next) => {
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
    const mappingRecords = participants.map((participant) => {
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
      },
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

exports.getAllEventsWithParticipants = catchAsync(async (req, res, next) => {
  const eventsPrticipants = await Events.findAll({
    include: [
      {
        model: Participants,
        through: { attributes: [] },
      },
    ],
  });
  res.status(200).json({
    status: "success",
    data: {
      events: eventsPrticipants,
    },
  });
});

exports.getEventsWithParticipnats = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;
  if (!eventId) return next(new AppError("The eventId must be provided", 404));
  const eventParticipant = await Events.findByPk(eventId, {
    include: [
      {
        model: Participants,
        through: { attributes: [] },
      },
    ],
  });
  res.status(200).json({
    status: "success",
    data: {
      event: eventParticipant,
    },
  });
});

exports.updateEventPraticipant = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;
  const { participants, eventName, time, date } = req.body;
  if (!eventId) return next(new AppError("The eventId must be provided", 404));
  const findEventParticipant = await Events.findByPk(eventId, {
    include: {
      model: Participants,
    },
  });
  if (!findEventParticipant)
    return next(new AppError("No event present with this eventId", 404));

  if (eventName) findEventParticipant.eventName = eventName;
  if (time) findEventParticipant.time = time;
  if (date) findEventParticipant.date = date;
  if (participants && participants.length > 0) {
    const updatedmappingRecords = participants.map((participant) => {
      return {
        eventId: eventId,
        participantId: participant.participantId,
      };
    });
    console.log(updatedmappingRecords);

    await Mapping.bulkCreate(updatedmappingRecords);
  }

  await findEventParticipant.save();

  res.status(200).json({
    status: "success",
    data: {
      event: findEventParticipant,
    },
  });
});

exports.deleteEventParticipant = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;
  if (!eventId) return next(new AppError("The eventId must be provided", 404));
  const findEventParticipant = await Events.findByPk(eventId, {
    include: {
      model: Participants,
    },
  });
  if (!findEventParticipant)
    return next(new AppError("No event present with this eventId", 404));
  await db.transaction(async (transaction) => {
    await findEventParticipant.destroy(transaction);

    await Mapping.destroy({
      where: { eventId },
      transaction,
    });
  });
  res.status(200).json({
    status: "success",
    message: "Event and associated data deleted successfully",
  });
});
