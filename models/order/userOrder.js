const mongoose = require('mongoose')

const userOrderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    products : {
        type : [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        required : true
    },
    sellerId : {
        type : [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        ref: "User",
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    payment_status : {
        type : String,
        required : true
    },
    shippingInfo : {
        type : Object,
        required : true
    },
    deliveryStatus : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
},{timestamps : true})

const UserOrder = mongoose.model("UserOrder", userOrderSchema);
module.exports = UserOrder