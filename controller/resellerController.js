const Reseller = require("./../models/resellerModel");
const {createToken} = require('../utils/createToken')
const catchAsync = require("../utils/catchAsync");
const { uniqueCode } = require("./../utils/uniqueCode");
const { response } = require("../utils/response");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

dotenv.config('../.env')

// // get the list of all sellers
exports.getAllResellers = catchAsync(async (req, res) => {
  const reseller = await Reseller.find();
  response(res, 200, reseller);
});

// Creates a new seller with necessary validation and error handling.
exports.registerReseller = catchAsync(async (req, res) => {
  const { email, phoneNumber, referredBy, password ,...resellerData } = req.body;
  
  if (email) {
    const existingReseller = await Reseller.findOne({ email: email });
    if (existingReseller) {
      return response(res, 409, {
        status: "conflict",
        message: "Email already exists in our database.",
      });
    }
  }
  
  if (phoneNumber) {
    const existingResellerByPhone = await Reseller.findOne({
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
}
  if (req.body.referredBy) {
    const referrer = await Reseller.findOne({
      referralCode: req.body.referredBy,
    });
    if (!referrer) {
      response(res, 404, {
        status: "not found",
        message: `user with this refer code doesn't exists`,
      });
    }
    req.body.referredBy = referrer._id;
  }

    referralCode = await uniqueCode();

    const reseller = await Reseller.create({
      email: email,
      phoneNumber: phoneNumber,
      password: await bcrypt.hash(password, 10),
      referralCode: referralCode,
      ...resellerData
    });
    
    const payload = {user: reseller._id,role:reseller.role}
    const token = await createToken(payload)

    if (referredBy) {
      try {
        // Add referral using the newly created reseller's ID
        await Reseller.addReferral(reseller._id, referredBy);
      } catch (err) {
        console.error('Error adding referral:', err);
      }
    }


    // console.log(token)
    return response(res, 201, {
      status: "SUCCESS",
      message: "Reseller account created successfully",
      data: reseller,
      token: token,
    });
});
// login reseller
exports.loginReseller = catchAsync(async(req, res) => {
  const { emailAcc, password } = req.body
        try {
            const reseller = await Reseller.findOne({"email.emailAcc": emailAcc}).select('password').select("role")

            if (!reseller) {
              return response(res, 404, { error: "Email not found" })
            }
            const match = await bcrypt.compare(password, reseller.password)

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

// find a single reseller by id
exports.getResellerById = catchAsync(async(req, res)=>{
  const resellerId = req.params.resellerId

  if (!mongoose.Types.ObjectId.isValid(resellerId)) {
    return response(res, 400 , {
      status: "FAILED",
      message: 'Invalid reseller ID format'
  })
  }
  try{
    const reseller = await Reseller.find({_id: resellerId})
    if(reseller.length === 0){
      return res.status(404).json({
        status: "NOT_FOUND",
        message: 'Reseller with that Id not found'})
    }
    return response(res, 200, {
      status: "SUCCESS",
      message: "Reseller found!",
      data: reseller
    })
  }catch(err){
    return response(res, 403, err)
  }
  })

