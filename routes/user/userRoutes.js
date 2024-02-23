const express = require("express");
const {registerUser, loginUser, getUserById} = require("../../controller/user/userController");
const router = express.Router();
const {verifyToken, verifyAdminToken} = require('../../middlewares/verifyToken')

// router.route("/").get(verifyAdminToken, resellerController.getAllResellers)
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route('/get-user/:userId').get(getUserById)



module.exports = router;