require("dotenv").config();
const colors = require("colors");

module.exports = {
  port: 5000,
  databaseURI: process.env.MONGO_URI,
  NODE_ENV: "development",
  yellowBold: colors.yellow.bold,
  red: colors.red,
  cyanBold: colors.cyan.bold,
};
