const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    enum: ['Mr', 'Mrs', 'Miss']
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 8,
    maxlength: 15
  },
  address: {
    street: {
      trim: true,
      type: String
    },
    city: {
      trim: true,
      type: String
    },
    pincode: {
      type: String,
      trim: true
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('UserCollection', userSchema);
