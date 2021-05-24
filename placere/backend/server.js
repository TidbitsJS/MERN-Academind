const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const placesRoutes = require("./routes/places.routes");
const usersRoutes = require("./routes/users.routes");
const HttpError = require("./models/http.error");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  next(error);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "Unknow error occured!" });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => console.log(`Server is running on port ${port}`));
    console.log("connected to mongo database");
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });
