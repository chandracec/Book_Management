const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel")
const validation = require('../utils/validation')

const createReview = async (req, res) => {
  try {
      const bookId = req.params.bookId
      const { rating, review, reviewedBy } = req.body;
       
      if (!validation.ObjectIdCheck(bookId)) {
          return res.status(400).json({ status: false, message: "book Id is invalid" })
      }
      if (!rating || !reviewedBy || !review) {
        return res.status(400).json({ status: false, message: "Some details are missing. Please provide all required information." });
    }

      if (!validation.ratingRange(rating)) {
          return res.status(400).json({ status: false, message: "rating is invalid" })
      }
      const reviewDetails = {reviewedAt:Date.now(),bookId,...req.body}
       
      const reviewsCreate = await reviewModel.create(reviewDetails);

      const book = await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } }, { new: true });
      
      const reviewData = await reviewModel.find({bookId:bookId})

    const data = book._doc
    data['reviewsData'] =reviewData
      res.status(201).json({ status: true, message: "Review added successfully", data:data});
  } catch (error) {
      if (error.message.includes('validation')) {
          return res.status(400).send({ status: false, message: error.message })
      } else if (error.message.includes('duplicate')) {
          return res.status(400).send({ status: false, message: error.message })
      } else {
          res.status(500).json({ status: false, message: error.message })
      }
  }
}

const updateReview = async (req, res) => {
  try {
      const reviewId = req.params.reviewId;
      const bookId = req.params.bookId;
      const { rating, review, reviewedBy } = req.body;

      if (!validation.ObjectIdCheck(bookId)) {
        return res.status(400).json({ status: false, message: "book Id is invalid" })
    }
    if (!validation.ObjectIdCheck(reviewId)) {
        return res.status(400).json({ status: false, message: "review Id is invalid" })
    }
    if(req.body=={}) return res.status(400).send({status:false,message:"enter value to update"})

    if(rating){
    if (!validation.ratingRange(rating)) {
        return res.status(400).json({ status: false, message: "rating is invalid" })
    }
    }

     const checkId = await reviewModel.findOne({_id:reviewId})
     if(!checkId) return res.status(400).send({status: false, message: "reviewId is incorrect"})

      const updatedReview = await reviewModel.findByIdAndUpdate(reviewId, req.body, { new: true });
      const book = await bookModel.findByIdAndUpdate(bookId)

      const reviewData = await reviewModel.find({bookId:bookId})

      const data = book._doc
      data['reviewsData'] =reviewData
        res.status(201).json({ status: true, message: "Review updated successfully", data:data});
  } catch (error) {
      if (error.message.includes('validation')) {
          return res.status(400).send({ status: false, message: error.message })
      } else if (error.message.includes('duplicate')) {
          return res.status(400).send({ status: false, message: error.message })
      } else {
          res.status(500).json({ status: false, message: error.message })
      }
  }
}




const deleteReview = async (req, res) => {
  try {
      const reviewId = req.params.reviewId;
      const bookId = req.params.bookId;
      if (!reviewId || !bookId) {
          return res.status(404).json({ status: false, message: "review Id or book Id not found in params" })
      }
      if (!validation.ObjectIdCheck(bookId) && !validation.ObjectIdCheck(reviewId)) {
          return res.status(400).json({ status: false, message: "Object Id Is Invalid" });
      }

      const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
      if (!book) {
          return res.status(404).json({ status: false, message: "book not found" })
      } 

      const review = await reviewModel.findOne({ _id: reviewId, isDeleted: false });
      if (!review) {
          return res.status(404).json({ status: false, message: "review not found" })
      } 
      
      const bookUpdated = await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: -1 } }, { new: true });
      const reviewUpdated = await reviewModel.findByIdAndUpdate(reviewId, { $set: { isDeleted: true } }, { new: true });
      res.status(200).json({ status: true, message: "Review deleted successfully" });
  } catch (error) {
      res.status(500).json({ status: false, message: error.message })
  }
}

module.exports = {
  createReview,
  updateReview,
  deleteReview
}