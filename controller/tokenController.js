const Reseller = require("./../models/resellerModel");
const { createToken } = require("../utils/createToken");
const catchAsync = require("../utils/catchAsync");
const { uniqueCode } = require("./../utils/uniqueCode");
const { response } = require("../utils/response");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config("../.env");

//verify token
exports.verifyResellerToken = catchAsync(async (req, res) => {
  const token = req.body.token
      try {
          const data = jwt.verify(token,  process.env.SECRET)
          if(data){
            const user = await Reseller.find({ _id: data.user })
            if(user){
                return response(res, 200 ,{status: "SUCCESS", res: true})
            }
            return response(res, 404 ,{status: "NOT_FOUND", res: false})
          }
          
          return response(res, 401 ,{status: "NOT_VALID", res: false})
          
      } catch (error) {
          return response(res, 409 ,error)
      }
});
