import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import BookGrid from '../components/BookGrid';
import SectionHeader from '../components/SectionHeader';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [viewFilter, setViewFilter] = useState('Day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all books for featured
    fetch('http://localhost:5000/api/books')
      .then((res) => res.json())
      .then((data) => {
        console.log('Books:', data); // <-- Add this
        setFeatured(data.slice(0, 3)); // First 3 as featured
        setLoading(false);
      });

    // Fetch most viewed books
    fetch('http://localhost:5000/api/books/most-viewed')
      .then((res) => res.json())
      .then((data) => {
        console.log('Most Viewed:', data); // <-- Add this
        setMostViewed(data);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#232323',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <div
        style={{
          marginTop: 60,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Carousel items={featured} />
        {/* FLEX ROW FOR HEADER AND FILTER BUTTONS */}
        <div
          style={{
            width: '100vw', // full viewport width
            maxWidth: '100%', // prevent overflow
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px', // or '0 2rem'
            marginBottom: 24,
            boxSizing: 'border-box',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: '1.5rem',
              color: '#fff',
            }}
          >
            Most Viewed Books
          </h2>
          <div className="buttons has-addons">
            {['Day', 'Week', 'Month'].map((filter) => (
              <button
                key={filter}
                className={`button${
                  viewFilter === filter ? ' is-link is-selected' : ''
                }`}
                onClick={() => setViewFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <BookGrid books={mostViewed} />
      </div>
    </div>
  );
}