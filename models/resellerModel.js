const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const resellerSchema = new mongoose.Schema({
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
        isEmailVesrified:{
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
    referralCode: {
        type: String,
        unique: true
    },
    referredBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reseller"
    } ,
    hasReferred:{
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reseller" }],
      default: []
    },
    role: {
      type: String,
      required: true,
      default: "reseller"
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
// function to add all the users a user has referred to his id
resellerSchema.statics.addReferral = async function(newSellerId, referringSellerId) {
    try {
        const referringSeller = await Reseller.findOne({referralCode: referringSellerId});
        if (!referringSeller) {
            throw new Error("Referring Reseller not found");
        }
        referringSeller.hasReferred.push(newSellerId);
        const stat = await referringSeller.save();
    } catch (error) {
        console.error("Error adding referral:", error);
        throw error;
    }
  };
// Hash password before saving
// resellerSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//       this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

// Instance method for generating a random reset token
resellerSchema.methods.generateResetPasswordToken = function () {
    const crypto = require('crypto');
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordTokenExpires = Date.now() + 3600000; // Expires in 1 hour
  };
  
  // Instance method to clear the reset token after resetting password
  resellerSchema.methods.clearResetPasswordToken = function () {
    this.resetPasswordToken = null;
    this.resetPasswordTokenExpires = null;
  };

const Reseller = mongoose.model("Reseller", resellerSchema);
module.exports = Reseller