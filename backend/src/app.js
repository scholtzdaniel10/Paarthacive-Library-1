const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookRoutes = require('./routes/bookRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected!');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.use('/api/books', bookRoutes);
app.use('/uploads', express.static(require('path').join(__dirname, '../../uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));