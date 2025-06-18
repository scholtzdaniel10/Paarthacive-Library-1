const Book = require('../models/book');

// Get all books
exports.getAllBooks = async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
};

// Upload a new book
exports.uploadBook = async (req, res) => {
  const { title, author, description, genres, coverUrl } = req.body;
  const book = new Book({ title, author, description, genres, coverUrl });
  await book.save();
  res.status(201).json(book);
};

// Get most viewed books
exports.getMostViewedBooks = async (req, res) => {
  const books = await Book.find().sort({ views: -1 }).limit(10);
  res.json(books);
};