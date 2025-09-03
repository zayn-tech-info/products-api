const User = require("../models/users.model");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const sendToken = require("../utils/sendToken");
const util = require("util");
const jwt = require("jsonwebtoken");

const signup = asyncErrorHandler(async (req, res) => {
  const user = await User.create(req.body);

  sendToken(user, res, "User created successfully", 201);
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { password, email } = req.body;

  if (!password || !email) {
    const error = new CustomError("Please enter your passord and email", 400);
    return next(error);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new CustomError("Password or Email incorrect", 401);
    return next(error);
  }

  const matchPassword = await user.comparePasswordInDB(password, user.password);
  if (!matchPassword) {
    const error = new CustomError("Password or Email incorrect", 401);
    next(error);
  }
  sendToken(user, res, "Login was successful", 200);
});

const protectRoute = asyncErrorHandler(async (req, res, next) => {
  const jwtToken = req.headers.authorization;
  let token;
  if (jwtToken.startsWith("Bearer")) {
    token = jwtToken.split(" ")[1];
  }
  if (!token) {
    return next(new CustomError("You are not logged in", 401));
  }

  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  const user = await User.findById(decodedToken.id);
  if (!user) {
    const error = new CustomError("User not found", 404);
    next(error);
  }

  if (await user.isPasswordChange(decodedToken.iat)) {
    const error = new CustomError(
      "Password was changed recently, Please login again",
      401
    );
    next(error);
  }
  req.user = user;
  next();
});

module.exports = { signup, login, protectRoute };
