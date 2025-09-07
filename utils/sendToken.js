const sendToken = (user, res, message, statusCode) => {
  const token = user.generateJWt();

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".https://temu-clone-zayn.vercel.app",
    path: "/",
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
