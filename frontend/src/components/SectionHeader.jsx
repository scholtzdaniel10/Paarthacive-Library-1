import React from 'react';
import './SectionHeader.css';

export default function SectionHeader({ title, children }) {
  return (
    <div className="level mb-3">
      <div className="level-left">
        <h2 className="title is-4">{title}</h2>
      </div>
      <div className="level-right">{children}</div>
    </div>
  );
}