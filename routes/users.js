var express = require("express");
const { getUserById, getUserByQuery } = require("../controllers/user");
var router = express.Router();

/* GET users listing. */
router.get("/:id", getUserById);
router.get("/", getUserByQuery);

module.exports = router;

