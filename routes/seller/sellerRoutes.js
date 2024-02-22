const express = require("express");
const {getSellerDetails, getSellerProducts, addProductSeller,updateProductSeller, deleteProductSeller, regSeller} = require("../../controller/seller/sellerController");
const router = express.Router();
const {verifySellerToken, verifySellerProductToken} = require('../../middlewares/verifyToken')

router.route("/get-seller-info/:sellerId").get(verifySellerToken, getSellerDetails)
router.route("/new/register").post(regSeller)
router.route("/add-new-product").post(verifySellerToken, addProductSeller)
router.route("/product/:sellerId").get(verifySellerToken, getSellerProducts).put(verifySellerProductToken, updateProductSeller).delete(verifySellerProductToken, deleteProductSeller)
// router.route("/:productId").put(adminOnlyToken, updateProductAdmin).delete(adminOnlyToken, deleteProductAdmin)



module.exports = router;