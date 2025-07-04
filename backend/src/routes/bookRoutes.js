const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { getAllBooks, getBookById, uploadBook, getMostViewedBooks } = require('../controllers/bookController');

// Most viewed books
router.get('/most-viewed', getMostViewedBooks);

// Upload book with cover image
router.post('/upload', upload.single('cover'), uploadBook);

// Get all books
router.get('/', getAllBooks);

// Get book by ID
router.get('/:id', getBookById);

module.exports = router;