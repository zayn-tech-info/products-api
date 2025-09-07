const express = require("express");
const {
  signup,
  login,
  forgotpassword,
  resetPassword,
  updatePassword,
  protectRoute,
  checkAuth
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotpassword", forgotpassword);
router.patch("/resetpassword/:token", resetPassword);

router.get("/check", protectRoute, checkAuth);



module.exports = router;
