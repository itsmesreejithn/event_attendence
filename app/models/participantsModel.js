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
    //   GETTING LOCATION : FROM WHERE THE PARTICIPANT IS ATTENDING (WFH, WFO, NOT ATTENDING)
    participationMode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isIn: [[1, 2, 3]],
      },
    },
  },
  {
    freezTableName: true,
    timestamps: false,
  }
);

module.exports = Participants;
