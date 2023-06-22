const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    excerpt: {
        type: String,
        trim: true,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'UserCollection'
    },
    ISBN: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: String,
        required: true,
        trim: true
    },
    reviews: {
        type: Number,
        default: 0,
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('BookCollection', bookSchema);

