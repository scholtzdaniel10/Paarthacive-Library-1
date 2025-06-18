import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import BookGrid from '../components/BookGrid';
import SectionHeader from '../components/SectionHeader';

const featured = [
  {
    title: 'The Great Gatsby',
    status: 'Completed',
    cover: '/covers/gatsby.jpg',
    description: 'A classic novel by F. Scott Fitzgerald set in the Roaring Twenties.',
    chapter: '9 Chapters',
    genres: ['Classic', 'Drama'],
  },
  {
    title: 'To Kill a Mockingbird',
    status: 'Completed',
    cover: '/covers/mockingbird.jpg',
    description: 'Harper Lee’s timeless story of justice and race in the Deep South.',
    chapter: '31 Chapters',
    genres: ['Classic', 'Historical'],
  },
  {
    title: '1984',
    status: 'Completed',
    cover: '/covers/1984.jpg',
    description: 'George Orwell’s dystopian masterpiece about totalitarianism.',
    chapter: '24 Chapters',
    genres: ['Dystopian', 'Science Fiction'],
  },
];

const mostViewed = [
  { title: 'Pride and Prejudice', cover: '/covers/pride.jpg' },
  { title: 'Moby Dick', cover: '/covers/mobydick.jpg' },
  { title: 'Jane Eyre', cover: '/covers/janeeyre.jpg' },
  { title: 'War and Peace', cover: '/covers/warpeace.jpg' },
  { title: 'The Hobbit', cover: '/covers/hobbit.jpg' },
  { title: 'Frankenstein', cover: '/covers/frankenstein.jpg' },
  { title: 'Dracula', cover: '/covers/dracula.jpg' },
];

export default function Home() {
  const [viewFilter, setViewFilter] = useState('Day');

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <Carousel items={featured} />
        <SectionHeader title="Most Viewed Books">
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
        </SectionHeader>
        <BookGrid books={mostViewed} />
      </div>
    </div>
  );
}