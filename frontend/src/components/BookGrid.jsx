import React from 'react';

export default function BookGrid({ books }) {
  return (
    <div className="columns is-multiline">
      {books.map((book, idx) => (
        <div className="column is-one-fifth" key={idx}>
          <div className="card">
            <div className="card-image">
              <figure className="image is-3by4">
                <img src={book.cover} alt={book.title} style={{ objectFit: 'cover' }} />
              </figure>
            </div>
            <div className="card-content">
              <p className="title is-6">{book.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}