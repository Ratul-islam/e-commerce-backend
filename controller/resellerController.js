const Reseller = require("./../models/resellerModel");
// const walletController = require("./walletController");
const catchAsync = require("../utils/catchAsync");
const { uniqueCode } = require("./../utils/uniqueCode");
const { response } = require("../utils/response");

// get the list of all sellers
exports.getAllResellers = catchAsync(async (req, res) => {
  const reseller = await Reseller.find();
  response(res, 200, reseller);
});

// Creates a new seller with necessary validation and error handling.
exports.createReseller = catchAsync(async (req, res) => {
  const { email, phoneNumber, referredBy, ...resellerData } = req.body;
  // Validate and normalize email
  const normalizedEmail = email; // Assuming normalization logic
  if (email) {
    const existingReseller = await Reseller.findOne({ email: normalizedEmail });
    if (existingReseller) {
      return response(res, 409, {
        status: "conflict",
        message: "Email already exists in our database.",
      });
    }
  }
  // Validate and normalize phone number
  const normalizedPhoneNumber = phoneNumber; // Assuming normalization logic
  if (phoneNumber) {
    const existingResellerByPhone = await Reseller.findOne({
      phoneNumber: normalizedPhoneNumber,
    });
    if (existingResellerByPhone) {
      return response(res, 409, {
        status: "conflict",
        message: "Phone number already exists in our database.",
      });
    }
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

  try {
    req.body.referralCode = await uniqueCode();

    const reseller = await Reseller.create(req.body);
    if (referredBy) {
      try {
        // Add referral using the newly created reseller's ID
        await Reseller.addReferral(reseller._id, referredBy);
      } catch (err) {
        // Handle referral addition error appropriately, e.g., log, send notification
        console.error('Error adding referral:', err);
        // Consider returning a different status code or response body
      }
    }
    
    return response(res, 201, {
      status: "success",
      message: "Reseller created successfully",
      reseller,
    });
    // walletController.createWallet(vendor._id);
  } catch (error) {
    // Handle validation errors, database errors, etc.
    return res.status(400).send(error);
  }
});

// normalize email
function normalizeEmail(email) {
  // Lowercase the entire email address
  const normalizedEmail = email.toLowerCase();
  // Remove leading/trailing whitespace
  return normalizedEmail.trim();
}
//normalize phone number
function normalizePhoneNumber(phoneNumber) {
  return phoneNumber.trim();
}
