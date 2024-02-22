
const Products = require("../../models/product/productModel")
const catchAsync = require("../../utils/catchAsync");
const { uniqueCode } = require("../../utils/uniqueCode");
const { response } = require("../../utils/response");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

// // get the list of all products
exports.getAllProducts = catchAsync(async (req, res) => {
    const products = await Products.find();
    return response(res, 200, products);
  });
  
exports.addProduct = catchAsync(async (req, res) => {
    const {name, desc, price, stock} = req.body
    try{
        const product = await Products.create({
            name: name,
            description: desc,
            price: price,
            stock: stock
        })
        return response(res, 201, {
            status: "SUCCESS",
            message: "product added successfully"
        })
    }catch(err){
        return response(res, 409, {
            message: "couldn't add product"
        })
    }
});