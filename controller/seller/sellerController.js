
const Seller = require("../../models/seller/sellerModel")
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
exports.regSeller= catchAsync(async(req, res)=>{
    const { firstName,lastName, email, phoneNumber, password  } = req.body;
  
  if (email) {
    const existingReseller = await Seller.findOne({ email: email });
    if (existingReseller) {
      return response(res, 409, {
        status: "conflict",
        message: "Email already exists in our database.",
      });
    }
  }
  
  if (phoneNumber) {
    const existingResellerByPhone = await Seller.findOne({
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

    const seller = await Seller.create({
      firstName: firstName,
      lastName: lastName,
      email:{
        emailAcc: email,
        isEmailVerified: false
    },
      phoneNumber: {
        phoneAcc: phoneNumber,
        isPhoneVerified: false
    },
      password: await bcrypt.hash(password, 10),
      role: 'seller'
    });
    
    const payload = {user: seller._id, role:seller.role}
    const token = await createToken(payload)


    // console.log(token)
    return response(res, 201, {
      status: "SUCCESS",
      message: "seller account created successfully",
      data: seller,
      token: token,
    });
})

exports.getSellerDetails= catchAsync(async(req, res)=>{

  const id = req.params.sellerId

  try {
    const seller = await Seller.findOne({_id: id})
    if(!seller) response(res, 404 , {status: "NOT_FOUND", message: "seller not found"})
    return response(res, 200, {
      status: "SUCCESS",
      data: seller
    })
  }catch(err){
    console.log(err)
    return response(res,500, {error: err})
  }
})
// add products as a seller
exports.addProductSeller = catchAsync(async (req, res) => {
    const {name, desc, price, stock} = req.body
    const data = req.headers.token
    const {user,role} = jwt.verify(data,  process.env.SECRET)
    try{
        const product = await Products.create({
            name: name,
            description: desc,
            price: price,
            stock: stock,
            uploadedBy: user,
            role: role,
            isActive: false
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

// get all product uploaded by seller 
exports.getSellerProducts = catchAsync(async (req, res)=>{
  const uploadedBy= req.params.sellerId
  try {
    const data = await Products.find({uploadedBy})
    if(data.length<1) response(res, 404, {status:"NOT_FOUND", message: "you haven't uploaded any products yet"})
    
    if(data.length>0) {
      return response(res, 200, {
        status: "SUCCESS",
        data: data
      })
    }
    
  }catch(err){
    return response(res, 500, {
      status: "FAILED",
      message: "wrong seller ID",
      data: err
    })
  }
})
// update product by id 
exports.updateProductSeller = catchAsync(async (req, res)=>{

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
exports.deleteProductSeller = catchAsync(async (req, res)=>{
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