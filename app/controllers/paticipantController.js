const Events = require("../models/eventModel");
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
      model: Events,
      through: { attributes: ["participationMode", "date", "time"] },
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      participant,
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
