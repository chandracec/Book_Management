const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel');

const ObjectIdCheck = (Id) => {
    return mongoose.Types.ObjectId.isValid(Id)
}
 
const validEmail = function (email) {
  return /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const validMobile = function (mob) {
  const trimmedMobile = mob.replace(/\s/g, '');
  return /^[0-9]{10}$/.test(trimmedMobile);
};

const titleCheck = (str)=>{
    let arr = ["Mr", "Mrs", "Miss"]
    if(arr.includes(str)) return true
    return false
}

const passwordCheck = (str)=>{
    if(str.length < 8 || str.length > 15) return false
    return true
}

const ratingRange = (rating)=>{
    rating = JSON.stringify(Number(rating))
    if(rating < 1 || rating > 5) return false
    return true
}

module.exports = {
    ObjectIdCheck,
    validEmail,validMobile,
    titleCheck,
    passwordCheck,
    ratingRange
}
