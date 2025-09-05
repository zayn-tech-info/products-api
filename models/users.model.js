const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is a required field"],
    },
    email: {
      type: String,
      required: [true, "Email is a required field"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilepic: {
      type: String,
      default: "",
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    phoneNumber: {
      type: Number,
    },
    passwordChangedAt: {
      type: Date,
    },
    resetPasswordToken: String,
    resetTokenExpires: Date,
  },
  { timestamps: true }
);
// [6,6,7,9]

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
});

UserSchema.methods.comparePasswordInDB = async function (
  passord,
  passwordInDB
) {
  return await bcrypt.compare(passord, passwordInDB);
};
UserSchema.methods.generateJWt = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
};

UserSchema.methods.isPasswordChange = function (jwtTimeStamp) {
  if (!this.passwordChangedAt) return false;

  const passwordChangeTimeStamp = this.passwordChangedAt
    ? parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    : 0;

  return passwordChangeTimeStamp > jwtTimeStamp;
};

UserSchema.methods.resetPasswordTokenfunc = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetTokenExpires = Date.now() + 3 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
