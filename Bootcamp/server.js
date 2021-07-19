const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const bootcamps = require("./routes/bootcamps");
// const logger = require("./middleware/logger");

// load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT || 9000;

// Mount logger middleware
// app.use(logger);

// Dev logging middleware morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  )
);
