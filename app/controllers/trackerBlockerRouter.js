const TrackerData = require("../models/trackerBlokcerModel");
const Participants = require("../models/participantsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/mongoApiFeatures");

exports.createTrackerBlocker = catchAsync(async (req, res, next) => {
  const { participantId } = req.body;
  if (!participantId) {
    return next(new AppError("The participant Id is not provided", 404));
  }
  const newTrackerBlocker = await TrackerData.create(req.body);

  res.status(201).json({
    status: "succes",
    date: {
      newTrackerBlocker,
    },
  });
});

exports.getAllTrackerBlocker = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(TrackerData, req.query).filter();
  const trackerBlockers = await features.query;
  const trackerBlockersResponse = await Promise.all(
    trackerBlockers.map(async (response) => {
      const participant = await Participants.findByPk(response.participantId);
      if (participant.participantId) {
        let participantName = participant.participantName;
        return {
          participantId: response.participantId,
          participantName,
          trackers: response.trackers,
          blockers: response.blockers,
          date: response.date,
          isSameBlocker: response.isSameBlocker,
          isBlockerSolved: response.isBlockerSolved,
        };
      }
    })
  );

  res.status(200).json({
    status: "success",
    data: {
      trackerBlockersResponse,
    },
  });
});

exports.getTrackerBlocker = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const trackerBlocker = await TrackerData.findById(id);
  if (!trackerBlocker) {
    return next(new AppError("There is no tracker with this id", 404));
  }
  const participant = await Participants.findByPk(trackerBlocker.participantId);
  let trackerBlockerResponse = {};
  if (participant) {
    trackerBlockerResponse = {
      participantId: trackerBlocker.participantId,
      participantName: participant.participantName,
      trackers: trackerBlocker.trackers,
      blockers: trackerBlocker.blockers,
      date: trackerBlocker.date,
      isSameBlocker: trackerBlocker.isSameBlocker,
      isBlockerSolved: trackerBlocker.isBlockerSolved,
    };
  }
  res.status(200).json({
    status: "success",
    data: {
      trackerBlockerResponse,
    },
  });
});

exports.updateTrackerBlocker = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("The id must be provided to update", 404));
  }
  const updatedTrackerBlocker = await TrackerData.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: false,
    }
  );

  if (!updatedTrackerBlocker) {
    return next(new AppError("No document found by this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      updatedTrackerBlocker,
    },
  });
});

exports.deleteTrackerBlocker = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new AppError("The id must be provided to update", 404));
  const deletedTrackerBlocker = await TrackerData.findOneAndDelete(id);
  if (!deletedTrackerBlocker)
    return next(new AppError("No document found by this ID", 404));
  res.status(200).json({
    status: "success",
    message: "Data deleted successfully",
  });
});
