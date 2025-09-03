const sendToken = (user, res, message) => {
  const token = user.generateJWt();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: "success",
    message,
    token,
    user
  });
};

module.exports = sendToken