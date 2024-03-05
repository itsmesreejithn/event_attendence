const mongoose = require("../utils/mongoDbConnection");
const { v4: uuidv4 } = require("uuid");

const trackerDataSchema = mongoose.Schema(
  {
    participantId: {
      type: Number,
      required: [true, "A tracker or blocker must have an participantId"],
    },
    trackers: {
      type: String,
    },
    blockers: {
      type: String,
    },
    blockerId: {
      type: String,
    },
    isBlockerSolved: {
      type: Boolean,
      default: true,
    },
    isSameBlocker: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

trackerDataSchema.pre("save", async function (next) {
  if (this.isModified("blockers")) {
    this.blockerId = uuidv4();
  }
  next();
});

trackerDataSchema.pre("save", async function (next) {
  if (this.isModified("isSameBlocker") && this.isSameBlocker) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdaysEntery = await this.constructor
      .findOne({
        date: { $lt: yesterday },
      })
      .sort({ date: -1 });
    this.blockerId = yesterdaysEntery.blockerId;
  }
  next();
});

trackerDataSchema.pre("save", async function (next) {
  if (this.isModified("isBlockerSolved") && this.isBlockerSolved) {
    await this.constructor.updateMany(
      { blockerId: this.blockerId },
      { $set: { isBlockerSolved: true } }
    );
  }
  next();
});

trackerDataSchema.pre(/^find/, function (next) {
  this.find({}).select("-_id -__v -createdAt -updatedAt");
  next();
});
const TrackerData = mongoose.model("TrackerData", trackerDataSchema);

module.exports = TrackerData;
