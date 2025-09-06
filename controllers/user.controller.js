const User = require("../models/users.model");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");

const filterReqObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

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

const updateMe = asyncErrorHandler(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    const error = new CustomError(
      "You can not update these fields through this end point",
      401
    );
    return next(error);
  }

  const filterObj = filterReqObj(req.body, "name", "phoneNumber", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterObj, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe = asyncErrorHandler(async (req, res, next) => {
  const userToDelete = await User.findOneAndUpdate(req.user._id, {
    active: false,
  });

  if (!userToDelete) {
    const error = new CustomError("User not found", 404);
    return next(error);
  }

  res.status(204).json({
    success: "success",
    data: {
      user: userToDelete,
    },
  });
});
module.exports = { updatePassword, updateMe, deleteMe };
