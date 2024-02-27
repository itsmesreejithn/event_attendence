const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const errorHandler = require("./utils/errorHandler");
const AppError = require("./utils/appError");

const eventRouter = require("./routers/eventRouter");
const participantRouter = require("./routers/particaipantRouter");
const analyticsRouter = require("./routers/analyticsRouter");
const userRouter = require("./routers/userRouter");

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/events", eventRouter);
app.use("/api/v1/participants", participantRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
