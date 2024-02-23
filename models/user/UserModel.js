const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxlength: 30,
        minlength: 2,
        required: [true, 'First name is required and cannot be skipped'],
        trim: true
    },
    lastName: {
        type: String,
        maxlength: 30,
        trim: true
    },
    email :{
        emailAcc: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: [true, 'this email is already taken'],
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, 'Please provide a valid email']
        },
        isEmailVerified: {
            default: false,
            type: Boolean
        }
        
    },
    phoneNumber: {
        phoneAcc: {
        type: Number,
        required: [true, 'please provide an phone number'],
        unique: [true, 'your phone number is already taken'],
        minlength: 11
        },
        isPhoneVerified:{
            default: false,
            type: Boolean
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8, 
        select: false

    },
    role: {
      type: String,
      default: "user"
    },
    wishLists: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: []
    },
    status: {type: String,
      enum: ['Active', 'De-active', 'Pending', 'Paid-pending'],
      required: true,
      trim: true,
      default: "Active"
    },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})


// Instance method for generating a random reset token
userSchema.methods.generateResetPasswordToken = function () {
    const crypto = require('crypto');
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordTokenExpires = Date.now() + 3600000; // Expires in 1 hour
  };
  
  // Instance method to clear the reset token after resetting password
userSchema.methods.clearResetPasswordToken = function () {
    this.resetPasswordToken = null;
    this.resetPasswordTokenExpires = null;
  };

const User = mongoose.model("User", userSchema);
module.exports = User