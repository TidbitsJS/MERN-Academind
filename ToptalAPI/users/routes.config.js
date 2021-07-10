const UsersController = require("./controllers/users.controller");
const PermissionMiddleware = require("../common/middleware/auth.permission.middleware");
const ValidationMiddleware = require("../common/middleware/auth.validation.middleware");
const config = require("../common/config/env.config");

const ADMIN = config.permissionLevlels.ADMIN;
const PAID = config.permissionLevlels.PAID_USER;
const FREE = config.permissionLevlels.NORMAL_USER;

exports.routesConfig = function (app) {
  app.post("/users", [UsersController.insert]);
  app.get("/users", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(PAID),
    UsersController.list,
  ]);
  app.get("/users/:userId", [UsersController.getById]);
  app.patch("/users/:userId", [UsersController.patchById]);
  app.delete("/users/:userId", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.removeById,
  ]);
};
