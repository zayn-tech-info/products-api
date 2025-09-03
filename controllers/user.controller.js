const User = require("../models/users.model");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const sendToken = require("../utils/sendToken");

const signup = asyncErrorHandler(async (req, res) => {
  const user = await User.create(req.body);

  sendToken(user, res, "User created successfully");
});

module.exports = { signup };
