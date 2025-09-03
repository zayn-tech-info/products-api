const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    },
    password: {
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
    phone: String,
    passwordChangedAt: {
      type: Date,
    }
  },
  { timestamps: true }
);

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
  
  const passwordChangeTimeStamp = this.passwordChangedAt ? parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  ) : 0;

  return passwordChangeTimeStamp > jwtTimeStamp
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
