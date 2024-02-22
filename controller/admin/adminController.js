
const Admin = require("../../models/admin/adminModel")
const Products = require("../../models/product/productModel")
const {createToken} = require('../../utils/createToken')
const catchAsync = require("../../utils/catchAsync");
const { uniqueCode } = require("../../utils/uniqueCode");
const { response } = require("../../utils/response");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')



// register admin temporary 
exports.regAdmin = catchAsync(async(req, res)=>{
    const { firstName,lastName, email, phoneNumber, password  } = req.body;
  
  if (email) {
    const existingReseller = await Admin.findOne({ email: email });
    if (existingReseller) {
      return response(res, 409, {
        status: "conflict",
        message: "Email already exists in our database.",
      });
    }
  }
  
  if (phoneNumber) {
    const existingResellerByPhone = await Admin.findOne({
      phoneNumber: phoneNumber,
    });
    if (existingResellerByPhone) {
      return response(res, 409, {
        status: "conflict",
        message: "Phone number already exists in our database.",
      });
    }
  }
if(password.length < 8){
  return response(res, 403, {
    status: "FAILED",
    message: "password must be minimum 8 characters long"
  })
};

    const admin = await Admin.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      password: await bcrypt.hash(password, 10),
      role: 'admin'
    });
    
    const payload = {user: admin._id, role:admin.role}
    const token = await createToken(payload)


    // console.log(token)
    return response(res, 201, {
      status: "SUCCESS",
      message: "admin account created successfully",
      data: admin,
      token: token,
    });
})
// // get the list of all products
exports.getAllProductsAdmin = catchAsync(async (req, res) => {
    const products = await Products.find();
    return response(res, 200, products);
  });
  
  
exports.addProductAdmin = catchAsync(async (req, res) => {
    const {name, desc, price, stock} = req.body
    const data = req.headers.token
    const {user} = jwt.verify(data,  process.env.SECRET)
    try{
        const product = await Products.create({
            name: name,
            description: desc,
            price: price,
            stock: stock,
            uploadedBy: user,
            isActive: true
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
exports.updateProductAdmin = catchAsync(async (req, res)=>{

     const productId = req.params.productId
     const updatedData = req.body
    try {
        const updatedProduct = await Products.findByIdAndUpdate(productId, updatedData, { new: true });
    
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
exports.deleteProductAdmin = catchAsync(async (req, res)=>{
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