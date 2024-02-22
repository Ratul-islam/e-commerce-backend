const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
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
        minlength: 2,
        trim: true
    },
    email :{
        type: String,
        required: [true, 'Please provide an email'],
        unique: [true, 'this email is already taken'],
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, 'Please provide a valid email']
        
    },
    phoneNumber: {
        type: Number,
        required: [true, 'please provide an phone number'],
        unique: [true, 'your phone number is already taken'],
        minlength: 4
    },
    password: {
        type: String,
        required: true,
        minlength: 8, 
        select: false

    },
    role: {
      type: String,
      required: true,
      default: "admin"
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
// Hash password before saving
// resellerSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//       this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

// Instance method for generating a random reset token
adminSchema.methods.generateResetPasswordToken = function () {
    const crypto = require('crypto');
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordTokenExpires = Date.now() + 3600000; // Expires in 1 hour
  };
  
  // Instance method to clear the reset token after resetting password
  adminSchema.methods.clearResetPasswordToken = function () {
    this.resetPasswordToken = null;
    this.resetPasswordTokenExpires = null;
  };

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin