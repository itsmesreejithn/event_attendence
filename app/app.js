const express = require("express");
const app = express();

const eventRouter = require("./routers/eventRouter");
const participantRouter = require("./routers/particaipantRouter");

app.use(express.json());

app.use("/api/v1/events", eventRouter);
app.use("api/v1/participants", participantRouter);

module.exports = app;
