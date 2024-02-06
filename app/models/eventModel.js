const { DataTypes } = require("sequelize");
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
      type: DataTypes.DATE,
      defaultValue: `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDay()}`,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Events;
