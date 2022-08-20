var express = require("express");
const {
  getKontak,
  getKontakWithDetails,
  addKontak,
} = require("../controllers/kontak");
var router = express.Router();

router.post("/", getKontak);
router.post("/add", addKontak);
router.post("/detail", getKontakWithDetails);

module.exports = router;
