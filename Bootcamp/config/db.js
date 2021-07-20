const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log(config.cyanBold(`MongoDB Connected: ${conn.connection.host}`));
  } catch (err) {
    console.log(config.red("Failed to connect database. "), err);
  }
};

module.exports = connectDB;
