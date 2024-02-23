const express = require("express");
const {regAdmin, adminLogin, getAllProductsAdmin,getPendingSeller, getAllSeller, changeResellerStatus,changeSellerStatus} = require("../../controller/admin/adminController");
const router = express.Router();
const {adminOnlyToken} = require('../../middlewares/adminTokenVerify')

router.route("/").get(adminOnlyToken, getAllProductsAdmin)
// router.route("/reg").post(regAdmin)
router.route("/login").post(adminLogin)
router.route("/get-pending-seller").get(adminOnlyToken, getPendingSeller)
router.route("/get-All-seller").get(adminOnlyToken, getAllSeller)
router.route("/change-seller-status/:sellerId").patch(adminOnlyToken, changeSellerStatus)
router.route("/change-reseller-status/:sellerId").patch(adminOnlyToken, changeResellerStatus)


module.exports = router;