const Events = require("../models/eventModel");
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
