const express = require("express");
require("dotenv").config();

const placesRoutes = require("./routes/places.routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(placesRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
