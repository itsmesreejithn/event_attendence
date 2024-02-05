const sequelize = require("./utils/dbConnection");
const app = require("./app");

app.listen(3000, () => console.log("Server running on port 3000"));
