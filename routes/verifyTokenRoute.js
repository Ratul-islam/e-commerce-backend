const express = require("express");
const {verifyAllToken} = require("../middlewares/verifyToken");
const {verifyResellerToken} = require("../controller/tokenController");
const router = express.Router();


router.route("/").post(verifyResellerToken)



module.exports = router;