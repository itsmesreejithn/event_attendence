const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnection");
// const Events = require("./eventModel");

const Participants = sequelize.define("participants", {
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

Participants.sync().then(() => console.log(`Paricipants table created`));

module.exports = Participants;
