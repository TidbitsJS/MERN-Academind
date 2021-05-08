const express = require("express");
const UserRouter = require("./users/routes/routes.config");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
UserRouter.routesConfig(app);

app.listen(port, () => console.log(`Server is running on port ${port}`));
