const { DataTypes } = require("sequelize");
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
  },
  {
    timestamps: false,
  }
);

Participants.sync().then(() => console.log(`Paricipants table created`));
Events.sync().then(() => console.log(`Events table created`));

Events.belongsToMany(Participants, {
  through: EventParticipantMapping,
  foreignKey: "eventId",
});
Participants.belongsToMany(Events, {
  through: EventParticipantMapping,
  foreignKey: "participantId",
});
EventParticipantMapping.sync().then(() => console.log("Mapping table created"));

module.exports = EventParticipantMapping;
