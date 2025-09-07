const sendToken = (user, res, message, statusCode) => {
  const token = user.generateJWT();

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
 

  res.status(statusCode).json({
    status: "success",
    message,
    token,
    user,
  });
};

module.exports = sendToken;
