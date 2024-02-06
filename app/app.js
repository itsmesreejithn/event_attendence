const express = require("express");
const app = express();

const eventRouter = require("./routers/eventRouter");
const participantRouter = require("./routers/particaipantRouter");
const analyticsRouter = require("./routers/analyticsRouter");

app.use(express.json());

app.use("/api/v1/events", eventRouter);
app.use("/api/v1/participants", participantRouter);
app.use("/api/v1/analytics", analyticsRouter);

module.exports = app;
