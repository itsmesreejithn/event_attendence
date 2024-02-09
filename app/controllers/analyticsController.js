const Participants = require("../models/participantsModel");
const Mapping = require("../models/eventParticipantsMappingModel");
const db = require("../utils/dbConnection");
const { Op } = require("sequelize");
const Events = require("../models/eventModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");

const includeParticipants = {
  mode: Participants,
  through: { attributes: [] },
};

exports.createEventWithParticipant = catchAsync(async (req, res, next) => {
  const { eventId, participants } = req.body;
  // const transaction = await db.transaction();

  try {
    // const newEvent = await Events.create(
    //   {
    //     eventName,
    //   },
    //   {
    //     transaction,
    //   }
    // );
    const mappingRecords = participants.map((participant) => {
      return {
        eventId: eventId,
        participantId: participant.participantId,
      };
    });

    await Mapping.bulkCreate(mappingRecords);

    // await transaction.commit();

    res.status(201).json({
      status: "success",
      data: {
        event: mappingRecords,
      },
    });
  } catch (error) {
    // await transaction.rollback();
    next(error);
  }
});

exports.getAllEventsWithParticipants = catchAsync(async (req, res, next) => {
  const { page, limit, sortBy, sortOrder, filterBy, filterValue } = req.query;

  const features = new ApiFeatures(Events, {
    page,
    limit,
    sortBy,
    sortOrder,
    filterBy,
    filterValue,
  })
    .paginate()
    .sort()
    .filter()
    .includeModel(Participants);

  const events = await features.execute();

  res.status(200).json({
    status: "success",
    data: {
      events,
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
  const { participantId, time, date } = req.query;

  const { participationMode } = req.body;

  if (!eventId || !participantId)
    return next(
      new AppError("The eventId and participantId must be provided", 404)
    );

  const eventParticipantMapping = await Mapping.findOne({
    where: {
      eventId: eventId,
      participantId: participantId,
    },
  });
  if (!eventParticipantMapping)
    return next(new AppError("No event with this prticipant found", 404));

  if (time) eventParticipantMapping.time = time;
  if (date) eventParticipantMapping.date = date;

  await eventParticipantMapping.save();

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
