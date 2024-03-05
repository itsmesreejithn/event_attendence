const mogoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: `${__dirname}/../config.env`,
});

const DB = process.env.MONGO_DATABASE_NAME;
const HOST = process.env.MONGO_HOST;
const USERNAME = process.env.MONGO_USERNAME;
const PASSWORD = process.env.MONGO_PASSWORD;

const mongoURI = `mongodb://${USERNAME}:${PASSWORD}@${HOST}/${DB}`;

mogoose
  .connect(mongoURI)
  .then(() => console.log("Connection to MongoDB successful"))
  .catch((err) => console.log("Connection to MongoDB failed", err.message));

module.exports = mogoose;
