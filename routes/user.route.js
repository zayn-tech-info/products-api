const express = require("express");
const { protectRoute } = require("../controllers/auth.controller");
const {
  updatePassword,
  updateMe,
  deleteMe,
} = require("../controllers/user.controller");

const router = express.Router();

router.patch("/updatepassword", protectRoute, updatePassword);
router.patch("/updateMe", protectRoute, updateMe);
router.patch("/deleteMe", protectRoute, deleteMe);
module.exports = router;
