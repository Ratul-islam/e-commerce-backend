const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 255, 
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1, 
    maxlength: 1000 
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Category"
  },
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true,
    validate: {
      validator: (url) => {
        return /^(?:https?:\/\/)?[\da-z\.-]+[\w\.-\/:\?]+\.(?:jpg|jpeg|png|gif)$/.test(url);
      },
      message: (props) => `${props.value} is not a valid image URL`
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: (value) => Number.isFinite(value),
      message: (props) => `${props.value} is not a valid price`
    }
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: (value) => Number.isInteger(value),
      message: (props) => `${props.value} is not a valid stock quantity`
    }
  },
  // Additional fields as needed (e.g., ratings, reviews, discounts)
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});


module.exports = mongoose.model('Products', productSchema);