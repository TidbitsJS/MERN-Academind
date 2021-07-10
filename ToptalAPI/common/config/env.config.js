require("dotenv").config();

module.exports = {
  port: 7000,
  appEndpoint: "http://localhost:3600",
  apiEndpoint: "http://localhost:3600",
  databaseURI: process.env.MONGO_URI,
  jwt_secret: "guzelcicek!!hoscakal",
  jwt_expiration_in_seconds: 36000,
  environment: "dev",
  permissionLevlels: {
    NORMAL_USER: "1",
    PAID_USER: 4,
    ADMIN: 2048,
  },
};
