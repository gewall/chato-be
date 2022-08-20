var express = require("express");
const { setChat, getChat } = require("../controllers/chat");
var router = express.Router();

/* GET users listing. */
// router.get("/:id", setChat);
router.post("/:id", getChat);

module.exports = router;
