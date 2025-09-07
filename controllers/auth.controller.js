const User = require("../models/users.model");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const sendToken = require("../utils/sendToken");
const util = require("util");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

const signup = asyncErrorHandler(async (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword) {
    const error = new CustomError("Password does'nt match", 403);
    return next(error);
  }
  const user = await User.create(req.body);
  sendToken(user, res, "User created successfully", 201);
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return next(new CustomError("Please enter your password and email", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("Password or Email incorrect", 401));
  }

  const matchPassword = await user.comparePasswordInDB(password, user.password);
  if (!matchPassword) {
    return next(new CustomError("Password or Email incorrect", 401));
  }
  sendToken(user, res, "Login was successful", 200);
});

const protectRoute = asyncErrorHandler(async (req, res, next) => {
  let token;
  const jwtToken = req.headers.authorization;
  // Check for token in Authorization header
  if (jwtToken && jwtToken.startsWith("Bearer ")) {
    token = jwtToken.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    // Check for token in cookies
    token = req.cookies.token;
  }
  if (!token) {
    return next(new CustomError("You are not logged in", 401));
  }

  let decodedToken;
  try {
    decodedToken = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );
  } catch (err) {
    return next(new CustomError("Invalid or malformed token", 401));
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  if (await user.isPasswordChange(decodedToken.iat)) {
    return next(
      new CustomError("Password was changed recently, Please login again", 401)
    );
  }
  req.user = user;
  next();
});

const restrictRoute = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new CustomError("You are not authorized", 403));
    }
    next();
  };
};

const forgotpassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  if (!user.email) {
    return next(new CustomError("User email not found", 400));
  }

  const resetToken = await user.resetPasswordTokenfunc();
  await user.save({ validateBeforeSave: false });

  const reseturl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/resetpassword/${resetToken}`;
  const message = `You requested a password reset. Please click the link below to reset your password:\n\n${reseturl}\n\nIf you did not request this, please ignore this email.`;

  try {
    console.log("Sending password reset to:", user.email); // Debug log
    await sendMail({
      email: user.email,
      subject: "Password change request",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Link have been sent to your email",
    });
    console.log(resetToken);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new CustomError(
        "There was an error sending mail, please try again later",
        500
      )
    );
  }
});

const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new CustomError("Token invalid or expired", 403);
    next(error);
  }
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    const error = new CustomError("Password does'nt match", 401);
    return next(error);
  }
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.resetPasswordToken = undefined;
  user.resetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();
  sendToken(user, res, "Logged in successfully", 200);
});

const checkAuth = asyncErrorHandler(async (req, res, next) => {
  if (!req.user) {
    const error = new CustomError("Authentication error", 401);
    console.log(error);

    return next(error);
  }
  res.status(200).json(req.user);
});

const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

module.exports = {
  signup,
  login,
  protectRoute,
  restrictRoute,
  forgotpassword,
  resetPassword,
  checkAuth,
  logout,
};
