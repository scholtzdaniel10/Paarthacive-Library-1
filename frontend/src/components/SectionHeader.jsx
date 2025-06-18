import React from 'react';

export default function SectionHeader({ title, children, style }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
        ...style,
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      {children}
    </div>
  );
}