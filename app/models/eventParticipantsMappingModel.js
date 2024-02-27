const { DataTypes, Sequelize, col } = require("sequelize");
const db = require("../utils/dbConnection");
const Events = require("./eventModel");
const Participants = require("./participantsModel");
const User = require("./userModel");

const EventParticipantMapping = db.define(
  "eventparticipantmapping",
  {
    eventId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Events,
        key: "eventId",
      },
    },
    participantId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Participants,
        key: "participantId",
      },
    },
    //   GETTING LOCATION : FROM WHERE THE PARTICIPANT IS ATTENDING (WFO = 1, WFH = 2, NOT ATTENDING = 3)
    participationMode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isIn: [[1, 2, 3]],
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      primaryKey: true,
    },
    time: {
      type: DataTypes.TIME,
      defaultValue: Sequelize.literal("CURRENT_TIME"),
    },
  },
  {
    timestamps: false,
  }
);

User.sync().then(() => console.log("User table created"));

Participants.belongsToMany(Events, {
  through: EventParticipantMapping,
  foreignKey: "participantId",
});
Participants.sync().then(() => console.log(`Paricipants table created`));

Events.belongsToMany(Participants, {
  through: EventParticipantMapping,
  foreignKey: "eventId",
});
Events.sync().then(() => console.log(`Events table created`));

Events.hasMany(EventParticipantMapping, {
  foreignKey: "eventId",
});
EventParticipantMapping.belongsTo(Events, {
  foreignKey: "eventId",
});

Participants.hasMany(EventParticipantMapping, {
  foreignKey: "participantId",
});
EventParticipantMapping.belongsTo(Participants, {
  foreignKey: "participantId",
});

EventParticipantMapping.sync().then(() => console.log("Mapping table created"));

module.exports = EventParticipantMapping;
