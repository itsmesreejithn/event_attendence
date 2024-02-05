exports.getAllParticipants = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      participants: "all participnats",
    },
  });
};

exports.createParticipant = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      participant: "new participant created",
    },
  });
};
