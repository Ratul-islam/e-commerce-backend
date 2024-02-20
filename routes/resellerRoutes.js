const express = require("express");
const resellerController = require("../controller/resellerController");
const router = express.Router();

router.route("/").get(resellerController.getAllResellers).post(resellerController.createReseller)



module.exports = router;