const catchAsync = require("../../utils/catchAsync")
const moment = require("moment")
const Products = require("../../models/product/productModel")
const { uniqueCode } = require("../../utils/uniqueCode");
const { response } = require("../../utils/response");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const {getCurrentDateTime} = require('../../utils/getCurrentDateTime')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv');
const UserOrder = require("../../models/order/userOrder");
const User = require("../../models/user/UserModel");


exports.placeOrder = catchAsync(async (req, res) => {
    const {
        products,
        shipping_fee,
        shippingInfo
    } = req.body
    const token = req.headers.token


    const data = jwt.verify(token,  process.env.SECRET)
    
    let authorOrderData = []
    let cardId = []
    const tempDate = moment(Date.now()).format('LLL')

    let sellers = []
    const price = await Promise.all(products?.map(async product => {
        const data = await Products.findOne({ _id: product });
        sellers.push(data.uploadedBy)
        return data.price;
      })).then(prices => prices.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
    try {
        const order = await UserOrder.create({
            userId: data.user,
            shippingInfo,
            products,
            sellerId: sellers,
            price: price + shipping_fee,
            delivery_status: 'pending',
            payment_status: 'unpaid',
            date: tempDate,
            deliveryStatus: "order pending"
        })
        
        // for (let k = 0; k < cardId.length; k++) {
        //     await cardModel.findByIdAndDelete(cardId[k])
        // }
        response(res, 201, {
            status: "SUCCESS" ,
            message: "order placed success",
            orderId: order.id
        })
    } catch (error) {
        response(res, 500, {status: "FAILED" , error})
    }
})

exports.getCustomerOrderData= catchAsync(async (req, res)=>{
    const userId = req.params.userId

    UserOrder.find({userId}).then(data=> response(res, 200, {
        status: "SUCCESS",
        data
    })).catch(err=> response(res, 500, {
        status: "FAILED",
        err
    }))
})
exports.OrderDetails= catchAsync(async (req, res)=>{
    const _id = req.params.orderId

    UserOrder.find({_id}).then(data=> response(res, 200, {
        status: "SUCCESS",
        data
    })).catch(err=> response(res, 500, {
        status: "FAILED",
        err
    }))
})
exports.getAllOrders = catchAsync(async (req, res)=>{
    UserOrder.find().then(data=> response(res, 200, {
        status: "SUCCESS",
        data
    })).catch(err=> response(res, 500, {
        status: "FAILED",
        err
    }))
})
exports.updateOrderStatus = catchAsync(async (req, res)=>{
    const _id = req.params.orderId
    const status = req.body.deliveryStatus
    UserOrder.findByIdAndUpdate(_id , {deliveryStatus: status}).then(data=> response(res, 200, {
        status: "SUCCESS",
        data
    })).catch(err=> response(res, 500, {
        status: "FAILED",
        err
    }))
})