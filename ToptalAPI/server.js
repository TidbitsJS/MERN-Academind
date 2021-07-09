const express = require("express");

const UserRouter = require("./users/routes/routes.config");
const port = require("./common/config/env.config").port;

const app = express();

app.use(express.json());
UserRouter.routesConfig(app);

app.listen(port, () => console.log(`Server is running on port ${port}`));
