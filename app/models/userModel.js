const { DataTypes } = require("sequelize");
const db = require("../utils/dbConnection");

const User = db.define(
  "users",
  {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [8, Infinity],
      },
    },
    role: {
      type: DataTypes.ENUM("user", "ops"),
    },
    ibu: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = User;
