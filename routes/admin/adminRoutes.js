const express = require("express");
const {getAllProductsAdmin, addProductAdmin,updateProductAdmin, deleteProductAdmin, regAdmin} = require("../../controller/admin/adminController");
const router = express.Router();
const {adminOnlyToken} = require('../../middlewares/adminTokenVerify')

router.route("/").get(adminOnlyToken, getAllProductsAdmin)
router.route("/reg").post(regAdmin)
router.route("/add-new-product").post(adminOnlyToken, addProductAdmin)
router.route("/:productId").put(adminOnlyToken, updateProductAdmin).delete(adminOnlyToken, deleteProductAdmin)



module.exports = router;