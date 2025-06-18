const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById, uploadBook, getMostViewedBooks } = require('../controllers/bookController');

// Get all books
router.get('/', getAllBooks);

// Get a single book by ID
router.get('/:id', getBookById);

// Upload a new book
router.post('/upload', uploadBook);

// Get most viewed books
router.get('/most-viewed', getMostViewedBooks);

module.exports = router;