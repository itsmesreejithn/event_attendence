exports.getAllEvents = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      events: "all events",
    },
  });
};

exports.createEvents = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      event: "event creatd",
    },
  });
};