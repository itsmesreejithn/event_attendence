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
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "all",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Events;
