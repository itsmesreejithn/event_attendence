const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnection");
// const Participants = require("./participantsModel");

const date = new Date();

const Events = sequelize.define("evnets", {
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
});

Events.sync().then(() => console.log(`Events table created`));

module.exports = Events;
