const bookModel = require('../models/bookModel');
const { ObjectIdCheck, userCheck, bookCheck } = require('../utils/validation');
const reviewModel = require('../models/reviewModel');
const userModel = require('../models/userModel');


const createBook = async (req, res) => {
    try {
        const { title, excerpt, releasedAt, userId, subcategory, category, ISBN } = req.body
        if (!title || !excerpt || !userId || !subcategory || !category || !ISBN || !releasedAt) {
            return res.status(400).json({ status: false, message: 'All fields are required' });
        }
        if (!ObjectIdCheck(userId)) {
            return res.status(400).json({ status: false, message: 'User Id is invalid' });
        }
        const titleBook = await bookModel.findOne({ title: title });
        if (titleBook) {
            return res.status(400).json({ status: false, message: 'Title already exists' });
        }
        const user = await userModel.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ status: false, message: 'User does not exist' });
        }
        else {
            const IsbnBook = await bookModel.findOne({ ISBN: ISBN });
            if (IsbnBook) {
                return res.status(400).json({ status: false, message: 'ISBN already exists' });
            }
            else {
                const book = await bookModel.create(req.body)
                const {__v,deletedAt,...data} = book._doc
                res.status(201).json({ status: true, data: data});
            }
        }
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

const getBooks = async (req, res) => {
  try {
      const value = req.query;
      const books = await bookModel.find({ ...value, isDeleted: false },{__v:0,subcategory:0,isDeleted:0,deletedAt:0,createdAt:0,updatedAt:0,ISBN:0}).sort({ name: 1 });
      if (books.length == 0) {
          return res.status(404).json({ status: false, message: 'No books found' });
      }
      res.status(200).json({ status: true, message: 'Books list', data: books });
  } catch (error) {
      res.status(500).json({ status: false, message: error.message });
  }
}

const getBooksById = async (req, res) => {
  try {
      const bookId = req.params.bookId;
      if (!ObjectIdCheck(bookId)) {
          return res.status(400).json({ status: false, message: 'Book Id is invalid' });
      }
      const book = await bookModel.findById(bookId).select({ __v: 0, deletedAt: 0, ISBN: 0 });
      if (!book) {
          return res.status(404).json({ status: false, message: 'Book does not exist' });
      }
      const Data = await reviewModel.find({ bookId: bookId, isDeleted: false });
      const data = {book,reviewsData:Data}
      
      res.status(200).json({ status: true, data: data });
  } catch (error) {
      res.status(500).json({ status: false, message: error.message });
  }
};


const updateBook = async (req, res) => {
    try {
        const bookId = req.params.bookId;
    
        const updateBookData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, req.body, { new: true });
        if(updateBookData)
        res.status(200).json({ status: true, data :updateBookData});

    } catch (error) {
            res.status(500).json({ status: false, message: error.message })
    }
}


const deleteBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId;
         
        const deleteBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() }, { new: true });
        
        res.status(200).json({ status: true, message: "Delete book Successfully" });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ status: false, message: error.message });
        }
        res.status(500).json({ status: false, message: error.message });
    }
}
module.exports = {
    createBook,
    getBooks,
    getBooksById,
    updateBook,
    deleteBookById
}