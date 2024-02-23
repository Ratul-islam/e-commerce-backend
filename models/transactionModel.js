const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Reseller', 
    index: true, // Enable efficient user-based lookups
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128, // Precise decimal representation
    required: true,
    scale: 2, // 2 decimal places for currency
  },
  currency: {
    type: String,
    required: true,
    default: "BDT",
  },
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdrawal', 'transfer', "payment", "sign-up-fee"], 
  },
  description: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', ], 
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true, // Enable efficient ordering and filtering by creation time
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  // metadata: {
  //   type: mongoose.Schema.Types.Mixed, // Flexible object for additional data
  //   optional: true,
  // },
},{timestamps: true});

// transactionSchema.pre('save', function (next) {
//   // Perform validation, data sanitization, or other pre-save tasks here
//   next();
// });

module.exports = mongoose.model('Transaction', transactionSchema);
