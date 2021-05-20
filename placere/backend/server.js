const express = require("express");
require("dotenv").config();

const placesRoutes = require("./routes/places.routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/places", placesRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "Unknow error occured!" });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
