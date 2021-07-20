const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const config = require("./config/config");

const bootcamps = require("./routes/bootcamps");
// const logger = require("./middleware/logger");

// load env vars
// dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();

const app = express();
const PORT = config.port || 9000;

// Mount logger middleware
// app.use(logger);

// Dev logging middleware morgan
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const server = app.listen(
  PORT,
  console.log(
    config.yellowBold(
      `Server running in ${config.NODE_ENV} mode on port ${config.port}`
    )
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(config.red(`Error: ${err.message}`));

  // close server & exit process
  server.close(() => process.exit(1));
});
