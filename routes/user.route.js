const express = require("express");
const {
  protectRoute,
} = require("../controllers/auth.controller");
const { updatePassword } = require("../controllers/user.controller");

const router = express.Router();

router.patch("/updatepassword", protectRoute, updatePassword);
module.exports = router;
