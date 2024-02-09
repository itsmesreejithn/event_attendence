const { DataTypes } = require("sequelize");
const db = require("../utils/dbConnection");

const Participants = db.define(
  "participants",
  {
    participantId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    participantName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezTableName: true,
    timestamps: false,
  }
);

module.exports = Participants;
