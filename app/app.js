const express = require("express");
const app = express();

const eventRouter = require("./routers/eventRouter");

app.use(express.json());

app.use("/api/v1/events", eventRouter);

module.exports = app;
