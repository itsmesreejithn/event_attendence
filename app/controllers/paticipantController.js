const Events = require("../models/eventModel");
const Mapping = require("../models/eventParticipantsMappingModel");
const Participants = require("../models/participantsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllParticipants = catchAsync(async (req, res, next) => {
  const participants = await Participants.findAll();
  res.status(200).json({
    status: "success",
    data: {
      participants,
    },
  });
});

exports.createParticipant = catchAsync(async (req, res, next) => {
  const { participantId, participantName } = req.body;

  const newParticipant = await Participants.create({
    participantId,
    participantName,
  });
  res.status(200).json({
    status: "success",
    data: {
      participant: newParticipant,
    },
  });
});

exports.getParticipant = catchAsync(async (req, res, next) => {
  const participantId = req.params.id;
  if (!participantId)
    return next(new AppError("The participantId must be specified", 404));

  const participant = await Participants.findByPk(participantId, {
    include: {
      model: Mapping,
    },
  });
  const participantResponse = {
    participantId: participant.participantId,
    participantName: participant.participantName,
    events: [],
  };
  const eventMap = {};
  participant.eventparticipantmappings.forEach((mapping) => {
    const eventId = mapping.eventId;
    if (eventMap[eventId]) {
      eventMap[eventId].dates.push({
        date: mapping.date,
        participationMode: mapping.participationMode,
      });
    } else {
      eventMap[eventId] = {
        eventId: eventId,
        time: mapping.time,
        dates: [
          {
            date: mapping.date,
            participationMode: mapping.participationMode,
          },
        ],
      };
    }
  });

  participantResponse.events = Object.values(eventMap);
  res.status(200).json({
    status: "success",
    data: {
      participant: participantResponse,
    },
  });
});

exports.updateParticipant = catchAsync(async (req, res, next) => {
  const participantId = req.params.id;
  const { participantName } = req.body;
  if (!participantId)
    return next(new AppError("The participantId must be spacified", 404));

  const updateParticipant = await Participants.findByPk(participantId);
  if (!updateParticipant)
    return next(new AppError("The given participantId is not present", 404));

  const updateParticipantObj = {};
  if (participantName) updateParticipantObj.participantName = participantName;

  const updatedParticipant = await Participants.update(updateParticipantObj, {
    where: {
      participantId,
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      participant: updatedParticipant,
    },
  });
});

exports.deleteParticipant = catchAsync(async (req, res, next) => {
  const participantId = req.params.id;
  if (!participantId)
    return next(new AppError("The participantId must be spacified", 404));
  const deleteParticipant = await Participants.findByPk(participantId);
  if (!deleteParticipant)
    return next(new AppError("The given participantId is not presetn", 404));

  const deletedParticipant = await Participants.destroy({
    where: {
      participantId,
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      deletedParticipant,
    },
  });
});
