const express = require("express");
const {
  registerUser,
  loginUser,
  userData,
  updateUser,
  verifyMail,
} = require("../controller/authController");
const authMiddleware = require("../config/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/userdata", authMiddleware, userData);
router.post("/update", updateUser);
router.post("/verify-mail", verifyMail);

module.exports = router;
