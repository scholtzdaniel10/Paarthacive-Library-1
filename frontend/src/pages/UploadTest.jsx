import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Add this at the top if using react-router

export default function UploadTest() {
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    genres: '',
    coverUrl: ''
  });
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null); // New state for file
  const [coverFile, setCoverFile] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]); // Update file state on file selection
  };

  function handleCoverFileChange(e) {
    setCoverFile(e.target.files[0]);
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('author', form.author);
    formData.append('genres', form.genres.split(',').map(g => g.trim()));
    formData.append('description', form.description);
    if (coverFile) {
      formData.append('cover', coverFile);
    }

    const res = await fetch('http://localhost:5000/api/books/upload', {
      method: 'POST',
      body: formData
    });
    if (res.ok) setMessage('Upload successful!');
    else setMessage('Upload failed.');
  };

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#232323',
        boxSizing: 'border-box',
        padding: '0 5vw',
      }}
    >
      <div style={{ width: '100%', maxWidth: 480 }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: 24, color: '#00e6c3', textDecoration: 'none', fontWeight: 600 }}>
          &larr; Back to Home
        </Link>
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            background: 'transparent',
          }}
        >
          <input className="input" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input className="input" name="author" placeholder="Author" value={form.author} onChange={handleChange} />
          <input className="input" name="genres" placeholder="Genres (comma separated)" value={form.genres} onChange={handleChange} />
          
          <textarea className="textarea" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => setCoverFile(e.target.files[0])}
          />
          <button className="button is-primary mt-2" type="submit">Upload</button>
          <div>{message}</div>
        </form>
      </div>
    </div>
  );
}