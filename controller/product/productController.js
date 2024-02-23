
const Products = require("../../models/product/productModel")
const catchAsync = require("../../utils/catchAsync");
const { uniqueCode } = require("../../utils/uniqueCode");
const { response } = require("../../utils/response");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const {getCurrentDateTime} = require('../../utils/getCurrentDateTime')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

// // get the list of all products
exports.getAllProducts = catchAsync(async (req, res) => {
    const products = await Products.find();
    return response(res, 200, products);
  });
  
  
exports.addProduct = catchAsync(async (req, res) => {
    const {name, description, price, stock} = req.body
    const data = req.headers.token
    const {user} = jwt.verify(data,  process.env.SECRET)
    
    try{
         const product = await Products.create({
            name: name,
            description: description,
            price: price,
            stock: stock,
            uploadedBy: user,
            isActive: false
        }).catch(err=>{
            return res.send(err)
        })
        if(product){
            return response(res, 201, {
                status: "SUCCESS",
                message: "product added successfully"
            })
        }
    }catch(err){
        return response(res, 409, {
            message: "couldn't add product"
        })
    }
});
// update product by id 
exports.updateProduct = catchAsync(async (req, res)=>{

     const productId = req.params.productId
     const {name, description , category, brand, image, price, stock} = req.body
     const updatedAt = getCurrentDateTime()

    try {
        const updatedProduct = await Products.findByIdAndUpdate(productId,  {name, description , category, brand, image, price, stock, updatedAt}, { new: true });
    
        if (!updatedProduct) {
          return res.status(404).send('Product not found');
        }
    
        return response(res, 200, {
            status: "SUCCESS",
            message: "Product Updated Successfully"
        })
      } catch (err) {
        console.error(err);
        return response(res,500,{
            status: "FAILED",
            message: err
        })
      }
})
// delete product by id
exports.deleteProduct = catchAsync(async (req, res)=>{
    const id = req.params.productId
    try{
        const data = await Products.findOneAndDelete({_id: id})
        if (!data) response(res, 404, {status: "FAILED", message: "no product found with the product Id"})

        return response(res, 200, {
            status: "SUCCESS",
            message: "Product Deleted Successfully"
        })
    }catch(err) {
        return response(res,500,{
            status: "FAILED",
            message: err
        })
    }
})