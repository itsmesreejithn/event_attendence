const Events = require("../models/eventModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Mapping = require("../models/eventParticipantsMappingModel");

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const events = await Events.findAll();
  res.status(200).json({
    status: "success",
    data: {
      events,
    },
  });
});

exports.createEvent = catchAsync(async (req, res, next) => {
  const { eventName, category } = req.body;
  if (!eventName) return next(new AppError("There mus be an event name", 404));

  // category = category.toLowerCase();
  // eventName = eventName.toLowerCase();

  const newEvent = await Events.create({
    eventName: eventName,
    category: category,
  });
  res.status(201).json({
    status: "success",
    data: {
      event: newEvent,
    },
  });
});

exports.getEvent = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;
  if (!eventId) return next(new AppError("The eventId must be specified", 404));

  const event = await Events.findByPk(eventId);
  res.status(200).json({
    status: "success",
    data: {
      event,
    },
  });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;
  const { eventName, category } = req.body;
  if (!eventId) return next(new AppError("The eventId must be spacified", 404));

  const updateEvent = await Events.findByPk(eventId);
  if (!updateEvent)
    return next(new AppError("The given eventId is not present", 404));

  const updateEventObj = {};
  if (eventName) updateEventObj.eventName = eventName;
  if (category) updateEventObj.category = category;

  const updatedEvent = await Events.update(updateEventObj, {
    where: {
      eventId,
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      event: updatedEvent,
    },
  });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;
  if (!eventId) return next(new AppError("The eventId must be specified", 404));
  const deleteEvent = await Events.findByPk(eventId);
  if (!deleteEvent)
    return next(new AppError("The given eventId is not presetn", 404));

  const deletedEvent = await Events.destroy({
    where: {
      eventId,
    },
  });
  res.status(200).json({
    status: "success",
    message: "Data Deleted",
    data: {
      deletedEvent,
    },
  });
});
