const jwt = require("jsonwebtoken");
const scret = require("../config/env.config").jwt_secret;

const ADMIN_PERMISSION = 4096;

exports.minimumPermissionLevelRequired = (required_permission_level) => {
  return (req, res, next) => {
    let user_permission_level = parseInt(req.jwt.permissionLevel);
    let userId = req.jwt.userId;
    if (user_permission_level & required_permission_level) {
      return next();
    } else {
      return res.status(403).send();
    }
  };
};
