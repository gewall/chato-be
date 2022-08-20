var express = require("express");
const {
  login,
  register,
  refreshToken,
  authUser,
} = require("../controllers/auth");
var router = express.Router();

router.post("/", authUser);
router.post("/login", login);
router.post("/register", register);
router.post("/refresh-token", refreshToken);

module.exports = router;
