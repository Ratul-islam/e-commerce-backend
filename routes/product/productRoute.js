const express = require("express");
const productController = require("../../controller/product/productController");
const router = express.Router();
const {verifyToken, verifyAdminToken} = require('../../middlewares/verifyToken')

router.route("/").get(verifyToken, productController.getAllProducts)
router.route("/add-new-product").post(productController.addProduct)



module.exports = router;