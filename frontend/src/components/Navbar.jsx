import React from 'react';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item has-text-weight-bold is-size-4" href="/">
          Book<span className="has-text-primary">Share</span>.io
        </a>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item">Genres</a>
          <a className="navbar-item">Newest</a>
          <a className="navbar-item">Updated</a>
          <a className="navbar-item">Upload</a>
          <a className="navbar-item">Random</a>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <input className="input is-rounded" type="text" placeholder="Search books..." />
          </div>
          <div className="navbar-item">
            <button className="button is-info is-light">Filter</button>
          </div>
          <div className="navbar-item">
            <button className="button is-primary">Login</button>
          </div>
        </div>
      </div>
    </nav>
  );
}