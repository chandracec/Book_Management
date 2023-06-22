const express = require('express');
const router = express.Router();
const {createBook,getBooks,getBooksById,updateBook,deleteBookById} = require('../controller/bookControl');
const {registerUser,loginUser} = require('../controller/userControl')
const {createReview,updateReview,deleteReview}=require('../controller/reviewControl')
const { authentication, authorisation } = require('../utils/auth');

//===============================USER API=======================================
// Register a new user
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// Register a new book (protected route)
router.post('/books', authentication, createBook);

//===================================BOOKS -API====================================

// Get all books
router.get('/books', getBooks);

// Get a book by bookId
router.get('/books/:bookId', getBooksById);

// Update a book by bookId 
router.put('/books/:bookId', authentication, authorisation, updateBook);

// Delete a book by bookId 
router.delete('/books/:bookId', authentication, authorisation, deleteBookById);
//=============================================REVIEW API =====================================

router.post('/books/:bookId/review',createReview)
router.put('/books/:bookId/review/:reviewId',updateReview)
router.delete('/books/:bookId/review/:reviewId',deleteReview)
module.exports = router;
