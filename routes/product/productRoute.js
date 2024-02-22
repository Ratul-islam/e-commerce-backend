const express = require("express");
const {getAllProducts, addProduct,updateProduct, deleteProduct} = require("../../controller/product/productController");
const router = express.Router();
const {verifyAdminSellerToken, verifyAdminToken, verifyAllToken,verifySellerProductToken} = require('../../middlewares/verifyToken')

router.route("/").get(verifyAllToken, getAllProducts)
router.route("/add-new-product").post(verifyAdminSellerToken, addProduct)
router.route("/:productId").put(verifyAdminSellerToken, updateProduct).delete(verifySellerProductToken, deleteProduct)



module.exports = router;