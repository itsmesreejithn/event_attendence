const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({
  path: "../config.env",
});

const DB = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const port = process.env.DATABSE_PORT;

const sequelize = new Sequelize(DB, username, password, {
  host: host,
  dialect: "postgres",
  port: port,
});

module.exports = sequelize;
