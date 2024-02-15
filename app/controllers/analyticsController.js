const Participants = require("../models/participantsModel");
const Mapping = require("../models/eventParticipantsMappingModel");
const db = require("../utils/dbConnection");
const { Op, where } = require("sequelize");
const Events = require("../models/eventModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createEventWithParticipant = catchAsync(async (req, res, next) => {
  const { eventId, participants, date, time } = req.body;
  console.log(eventId);
  const mappingRecords = participants.map((participant) => {
    return {
      eventId: eventId,
      participantId: participant.participantId,
      date,
      time,
    };
  });

  await Mapping.bulkCreate(mappingRecords);

  res.status(201).json({
    status: "success",
    data: {
      event: mappingRecords,
    },
  });

  next(error);
});

exports.getAllEventsWithParticipants = catchAsync(async (req, res, next) => {
  const { page, limit, sortBy, sortOrder, filterBy, filterValue } = req.query;

  const features = new ApiFeatures(Mapping, {
    page,
    limit,
    sortBy,
    sortOrder,
    filterBy,
    filterValue,
  })
    .paginate()
    .sort()
    .filter();

  const mappings = await features.execute();

  const eventsByDate = {};
  mappings.forEach((mapping) => {
    const eventDate = mapping.date;
    if (!eventsByDate[eventDate]) {
      eventsByDate[eventDate] = [];
    }
    eventsByDate[eventDate].push(mapping);
  });

  const eventsWithParticipantsByDate = await Promise.all(
    Object.entries(eventsByDate).map(async ([date, mappings]) => {
      const eventsWithParticipants = {};
      await Promise.all(
        mappings.map(async (mapping) => {
          const event = await Events.findByPk(mapping.eventId);
          const participant = await Participants.findByPk(
            mapping.participantId
          );
          if (!eventsWithParticipants[event.eventId]) {
            eventsWithParticipants[event.eventId] = {
              eventId: event.eventId,
              eventName: event.eventName,
              category: event.category,
              participants: [],
            };
          }
          eventsWithParticipants[event.eventId].participants.push({
            participantId: participant.participantId,
            participantName: participant.participantName,
            participationMode: mapping.participationMode,
          });
        })
      );
      return { date, events: eventsWithParticipants };
    })
  );
  res.status(200).json({
    status: "success",
    data: {
      eventsWithParticipantsByDate,
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
        through: { attributes: ["participationMode", "date", "time"] },
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

  const { participationMode, participantId, date } = req.body;

  if (!eventId || !participantId)
    return next(
      new AppError("The eventId and participantId must be provided", 404)
    );

  const eventParticipantMapping = await Mapping.findOne({
    where: {
      eventId: eventId,
      participantId: participantId,
      date: date,
    },
  });
  if (!eventParticipantMapping)
    return next(
      new AppError("No event with this prticipant and date found", 404)
    );

  if (participationMode) {
    eventParticipantMapping.participationMode = participationMode;
    await eventParticipantMapping.save();
  }
  res.status(200).json({
    status: "success",
    data: {
      event: eventParticipantMapping,
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
