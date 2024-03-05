const sequelize = require("./utils/dbConnection");
const app = require("./app");
const mongoose = require("./utils/mongoDbConnection");
const errorHandler = require("./utils/errorHandler");
// const mongoose = require("mongoose");

const checkDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

const checkMongoDbConnection = async () => {
  try {
    mongoose.connection;
    // console.log("MongoDB connection has been established successfully");
  } catch (err) {
    console.log("Unable to connect to MongDb: ", err.message);
  }
};

checkDbConnection();
checkMongoDbConnection();
// mongoose
//   .connect(`mongodb://root:toor@tracker_db:27017/tracker_data`)
//   .then(() => console.log("mongo connection successfull"))
//   .catch((err) => console.error("mongo message", err.message));
app.listen(3000, () => console.log("Server running on port 3000"));
