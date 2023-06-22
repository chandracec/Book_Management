const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    required: true,
    ref: "BookCollection"
  },
  reviewedBy: {
    type: String,
    required: true,
    default: 'Guest'
  },
  reviewedAt: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  review: {
    trim: true,
    type: String
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("ReviewsCollection", reviewSchema);
