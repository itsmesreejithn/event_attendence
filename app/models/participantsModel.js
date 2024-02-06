const { DataTypes } = require("sequelize");
const db = require("../utils/dbConnection");

const Participants = db.define("participants", {
  participantId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  participantName: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  //   GETTING LOCATION : FROM WHERE THE PARTICIPANT IS ATTENDING (WFH, WFO, NOT ATTENDING)
  participationMode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Participants;
