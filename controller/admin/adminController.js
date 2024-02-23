
const Admin = require("../../models/admin/adminModel")
const Products = require("../../models/product/productModel")
const Reseller = require("../../models/resellerModel")
const Seller = require("../../models/seller/sellerModel")
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


// register admin temporary 
exports.adminLogin = catchAsync(async(req, res)=>{
  const { email, password } = req.body
        try {
            const admin = await Admin.findOne({email: email}).select('password').select("role")

            if (!admin) {
              return response(res, 404, { error: "Email not found" })
            }
            const match = await bcrypt.compare(password, admin.password)

                if (!match) {
                  return response(res, 404, { error: "email and password does not match" })
                }
                if(match){
                  const payload = {user: reseller._id,role:reseller.role}
                  const token = await createToken(payload)
               return response(res, 201, {
                status: "SUCCESS",
                token: token
               })
             }
        } catch (error) {
           return response(res, 500, { error: error.message })
        }
})
// // get the list of all products
exports.getAllProductsAdmin = catchAsync(async (req, res) => {
    const products = await Products.find();
    return response(res, 200, products);
  });
  
exports.getPendingSeller = catchAsync(async (req, res)=>{
  const pending = await Seller.find({"status": "Pending"})
  Seller.find({"status": "Pending"}).then(data=> response(res, 200, {
    status: "SUCCESS",
    data: data
  })).catch(err=> response(res, 500, {
    status: "FAILED",
    err
  }))
})
exports.getAllSeller = catchAsync(async (req, res)=>{
  Seller.find().then(data=> response(res, 200, {
    status: "SUCCESS",
    data: data
  })).catch(err=> response(res, 500, {
    status: "FAILED",
    err
  }))
  
})

exports.changeSellerStatus = catchAsync(async(req, res)=>{
  const seller = req.params.sellerId
  const {status} = req.body

  Seller.findByIdAndUpdate(seller, {status}).then((data)=> response(res,200, {
    status: "SUCCESS",
    message: "Seller has been activated"
  })).catch(err=> response(res, 500, err))
})

exports.changeResellerStatus = catchAsync(async(req, res)=>{
  const reseller = req.params.sellerId
  const {status} = req.body

  Reseller.findByIdAndUpdate(reseller, {status}).then((data)=> response(res,200, {
    status: "SUCCESS",
    message: "Reseller has been activated"
  })).catch(err=> response(res, 500 , err))
})