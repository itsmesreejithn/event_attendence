const sequelize = require("./utils/dbConnection");
const app = require("./app");

let db;

const checkDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

checkDbConnection();
app.listen(3000, () => console.log("Server running on port 3000"));
module.exports = db;
