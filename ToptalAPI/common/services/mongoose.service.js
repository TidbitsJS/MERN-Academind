const mongoose = require("mongoose");
const MONGO_URI = require("../config/env.config").databaseURI;

let count = 0;

const options = {
  autoIndex: false,
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectWithRetry = () => {
  console.log("Connecting to MongoDB Server...");
  mongoose
    .connect(MONGO_URI, options)
    .then(() => console.log("Successfully connected to mongod"))
    .catch((err) => {
      console.error(
        "Oops an error connecting to MongoDB, retry after 5 seconds",
        ++count
      );
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
exports.mongoose = mongoose;
