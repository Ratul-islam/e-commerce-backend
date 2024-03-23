const express = require("express");
const resellerController = require("../controller/resellerController");
const router = express.Router();
const {verifyToken, verifyAdminToken} = require('../middlewares/verifyToken')

// router.route("/").get(verifyAdminToken, resellerController.getAllResellers)
router.route("/").get( resellerController.getAllResellers)
router.route("/register").post(resellerController.registerReseller)
router.route("/login").post(resellerController.loginReseller)
router.route('/:resellerId').get(resellerController.getResellerById)



module.exports = router;