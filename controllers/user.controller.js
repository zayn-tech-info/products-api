const User = require("../models/users.model");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    const error = new CustomError("User not found", 404);
    return next(error);
  }

  const matchPassword = await user.comparePasswordInDB(
    req.body.currentPassword,
    user.password
  );
  if (!matchPassword) {
    const error = new CustomError("Current password is incorrect", 401);
    return next(error);
  }

  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    const error = new CustomError("Password does'nt match", 401);
    return next(error);
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  sendToken(user, res, "Password changed successfully, user logged in", 200);
});

module.exports = { updatePassword };
