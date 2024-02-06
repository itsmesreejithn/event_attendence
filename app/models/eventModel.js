const { DataTypes, Sequelize } = require("sequelize");
const db = require("../utils/dbConnection");

const date = new Date();

const Events = db.define(
  "events",
  {
    eventId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    time: {
      type: DataTypes.TIME,
      defaultValue: Sequelize.literal("CURRENT_TIME"),
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Events;
