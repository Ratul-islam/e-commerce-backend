const User = require("../../models/user/UserModel");
const { createToken } = require("../../utils/createToken");
const catchAsync = require("../../utils/catchAsync");
const { uniqueCode } = require("../../utils/uniqueCode");
const { response } = require("../../utils/response");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config("../.env");

// // get the list of all sellers
// exports.getAllUsers = catchAsync(async (req, res) => {
//   const User = await User.find();
//   response(res, 200, User);
// });

// Creates a new seller with necessary validation and error handling.
exports.registerUser = catchAsync(async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } =
    req.body;


  if (email) {
    const existingUser = await User.findOne({ "email.emailAcc": email });
    if (existingUser) {
      return response(res, 409, {
        status: "conflict",
        message: "Email already exists in our database.",
      });
    }
  }

  if (phoneNumber) {
    const existingUserByPhone = await User.findOne({
      "phoneNumber.phone.Acc": phoneNumber,
    });
    if (existingUserByPhone) {
      return response(res, 409, {
        status: "conflict",
        message: "Phone number already exists in our database.",
      });
    }
  }
  if (password.length < 8) {
    return response(res, 403, {
      status: "FAILED",
      message: "password must be minimum 8 characters long",
    });
  }
User.create({
    firstName: firstName,
    lastName: lastName || "",
    email: {
      emailAcc: email,
      isEmailVerified: false,
    },
    phoneNumber: {
      phoneAcc: phoneNumber,
      isPhoneVerified: false,
    },
    password: await bcrypt.hash(password, 10),
    role: "user",
    status: "Active",
  }).then(async(data)=>{

    const payload = { user: User._id, role: User.role };
    const token = await createToken(payload);
    
    return response(res, 201, {
      status: "SUCCESS",
      message: "User account created successfully",
      data: User,
      token: token,
    });
  }).catch(err=> response(res,500, {status: "FAILED", message: "Internal server Error" , err}))
});


// login User
exports.loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ "email.emailAcc": email})
      .select("password")
      .select("role");
      
      if (!user) {
        return response(res, 404, { error: "Email not found" });
      }
      const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return response(res, 404, { error: "email and password does not match" });
    }
    if (match) {
      const payload = { user: user._id, role: user.role };
      const token = await createToken(payload);
      return response(res, 201, {
        status: "SUCCESS",
        token: token,
      });
    }
  } catch (error) {
    return response(res, 500, { error: error.message });
  }
});

// find a single User by id
exports.getUserById = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return response(res, 400, {
      status: "FAILED",
      message: "Invalid User ID format",
    });
  }
   User.find({ _id: userId }).then(data=> {
    if (data.length === 0) {
      return res.status(404).json({
        status: "NOT_FOUND",
        message: "User with that Id not found",
      });
    }
    return response(res, 200, {
      status: "SUCCESS",
      message: "User found!",
      data: data,
    });
   })
   .catch(err=>{
      return response(res, 403, err);
   })
});
