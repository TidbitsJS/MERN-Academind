const VerifyUserMiddleware = require("./middlewares/verify.user.middleware");
const AuthorizationController = require("./controllers/authorization.controller");

exports.routesConfig = function (app) {
  app.post("/auth", [
    VerifyUserMiddleware.hasAuthValidFields,
    VerifyUserMiddleware.isPasswordAndUserMatch,
    AuthorizationController.login,
  ]);
};
