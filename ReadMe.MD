# Paarthacive Library

Paarthacive Library is a full-stack application for managing and sharing books. It includes a backend built with Node.js and Express, and a frontend built with React and Vite.

## Features

**Backend**
- REST API for managing books
- File upload functionality for book covers
- MongoDB integration for storing book data
- Middleware for handling file uploads

**Frontend**
- React-based UI with routing
- Book carousel and grid for displaying featured and most viewed books
- Upload form for adding new books with cover images
- Responsive design

## Project Structure

```
Paarthacive-Library/
│
├── backend/
│   ├── .env
│   ├── downloadSampleImages.js
│   ├── package.json
│   ├── seedBooks.js
│   └── src/
│       ├── app.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       └── routes/
│
├── frontend/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       ├── components/
│       └── pages/
│
├── uploads/
│   ├── sample1.jpg
│   ├── sample2.jpg
│   ├── sample3.jpg
│   ├── sample4.jpg
│   └── sample5.jpg
│
├── .gitignore
├── package.json
└── README.md
```

## Installation

### Backend

1. Navigate to the backend directory:
    ```sh
    cd backend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file in the backend directory:
    ```
    PORT=5000
    MONGODB_URI=<your_mongodb_connection>
    JWT_SECRET=<your_jwt_secret>
    ```
4. Seed the database with sample books:
    ```sh
    node seedBooks.js
    ```

### Frontend

1. Navigate to the frontend directory:
    ```sh
    cd frontend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the development server:
    ```sh
    npm run dev
    ```

## Usage

- Start the backend server:
    ```sh
    node src/app.js
    ```
- The backend runs on `http://localhost:5000`
- The frontend runs on `http://localhost:5173`

## API Endpoints

- `GET /api/books` — Fetch all books
- `GET /api/books/:id` — Fetch a book by ID
- `GET /api/books/most-viewed` — Fetch the most viewed books
- `POST /api/books/upload` — Upload a new book with a cover image



