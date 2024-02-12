const { DataTypes, Sequelize } = require("sequelize");
const db = require("../utils/dbConnection");
const Events = require("./eventModel");
const Participants = require("./participantsModel");

const EventParticipantMapping = db.define(
  "eventparticipantmapping",
  {
    eventId: {
      type: DataTypes.INTEGER,
      references: {
        model: Events,
        key: "eventId",
      },
    },
    participantId: {
      type: DataTypes.INTEGER,
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
  },
  {
    timestamps: false,
  }
);

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

EventParticipantMapping.sync().then(() => console.log("Mapping table created"));

module.exports = EventParticipantMapping;
