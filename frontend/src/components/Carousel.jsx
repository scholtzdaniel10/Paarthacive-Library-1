import React, { useState } from 'react';
import './Carousel.css';

export default function Carousel({ items }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((current - 1 + items.length) % items.length);
  const next = () => setCurrent((current + 1) % items.length);

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-vcentered is-mobile">
          <div className="column is-narrow">
            <button className="button is-dark" onClick={prev}>&lt;</button>
          </div>
          <div className="column has-text-centered">
            <figure className="image is-3by2" style={{ maxWidth: 300, margin: '0 auto' }}>
              <img src={items[current].cover} alt={items[current].title} style={{ objectFit: 'cover', borderRadius: '8px' }} />
            </figure>
            <div className="mt-3">
              <span className="tag is-info is-light">{items[current].status}</span>
              <h3 className="title is-4 mt-2">{items[current].title}</h3>
              <p className="subtitle is-6">{items[current].description}</p>
              <div>
                <span className="tag is-light mr-2">{items[current].chapter}</span>
                {items[current].genres.map((g, i) => (
                  <span key={i} className="tag is-link is-light mr-1">{g}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="column is-narrow">
            <button className="button is-dark" onClick={next}>&gt;</button>
          </div>
        </div>
      </div>
    </section>
  );
}