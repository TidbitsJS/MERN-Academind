const HttpError = require("../models/http.error");
const { v4: uuidV4 } = require("uuid");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "John  Doe",
    email: "john@doe.com",
    password: "me@johnn",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    const error = new HttpError(
      "Could not create user, email already exists",
      422
    );
    return next(error);
  }

  const createdUser = {
    id: uuidV4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    const error = new HttpError(
      "Could not identify user, credentials seem to be wrong",
      401
    );
    return next(error);
  }

  res.json({ message: "Logged In!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
