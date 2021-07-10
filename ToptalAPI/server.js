const express = require("express");

const AuthorizationRouter = require("./authorization/routes.config");
const UserRouter = require("./users/routes.config");
const port = require("./common/config/env.config").port;

const app = express();

app.use(express.json());
AuthorizationRouter.routesConfig(app);
UserRouter.routesConfig(app);

app.listen(port, () => console.log(`Server is running on port ${port}`));
