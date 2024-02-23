const express = require("express");
const {placeOrder, getCustomerOrderData,OrderDetails, getAllOrders, updateOrderStatus} = require("../../controller/order/orderController");
const router = express.Router();
const {adminOnlyToken} = require('../../middlewares/adminTokenVerify');
const { userToken } = require("../../middlewares/verifyUserToken");

// ---- customer
router.post('/place-order', userToken, placeOrder)
router.get('/get-all-order-details/:userId', userToken, getCustomerOrderData)
router.get('/get-order-details/:orderId', userToken, OrderDetails)
// router.post('/order/create-payment', orderController.create_payment)
// router.get('/order/confirm/:orderId', orderController.order_confirm)

// // --- admin
router.get('/admin', adminOnlyToken, getAllOrders)
// router.get('/admin/order/:orderId', orderController.get_admin_order)
router.patch('/update-order-details/:orderId', adminOnlyToken, updateOrderStatus)

// // ---seller

// router.get('/reseller/orders/:sellerId', orderController.get_seller_orders)
// router.get('/reseller/order/:orderId', orderController.get_seller_order)
// router.put('/reseller/order-status/update/:orderId', orderController.seller_order_status_update)

module.exports = router