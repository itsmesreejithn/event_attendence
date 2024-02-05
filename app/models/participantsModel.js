const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnection");
const Events = require("./eventModel");

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
  participationMode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Participants.hasMany(Events);

module.exports = Participants;
