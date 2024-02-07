const express = require("express");
const app = express();
const errorHandler = require("./utils/errorHandler");
const AppError = require("./utils/appError");

const eventRouter = require("./routers/eventRouter");
const participantRouter = require("./routers/particaipantRouter");
const analyticsRouter = require("./routers/analyticsRouter");

app.use(express.json());

app.use("/api/v1/events", eventRouter);
app.use("/api/v1/participants", participantRouter);
app.use("/api/v1/analytics", analyticsRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
