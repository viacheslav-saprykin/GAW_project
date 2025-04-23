import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Track } from '../types';

type CreateTrackFormProps = {
  onSuccess: (newTrack: Track) => void;
  genresList: string[];
  onClose: () => void;
};

const CreateTrackForm: React.FC<CreateTrackFormProps> = ({
  onSuccess,
  genresList,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenres = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setGenres(selectedGenres);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/tracks', {
        title,
        artist,
        album,
        coverImage: coverImageUrl,
        genres,
      });

      alert('Track created successfully: ' + response.data.title);

      // Очистка форми
      setTitle('');
      setArtist('');
      setAlbum('');
      setCoverImageUrl('');
      setGenres([]);

      onSuccess(response.data);
      onClose(); // Закриваємо модалку
    } catch (error) {
      console.error('Error creating track:', error);
      setError('Error creating track. Please try again.');
    }
  };

  useEffect(() => {
    // Заборона прокручування сторінки при відкритій модалці
    document.body.style.overflow = 'hidden';

    // Відновлення прокручування при закритті
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div style={modalBackdropStyle}>
      <div style={modalStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <h2>Create New Track</h2>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={fieldStyle}>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label>Artist:</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label>Album:</label>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label>Cover Image URL:</label>
            <input
              type="text"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label>Genres:</label>
            <select multiple value={genres} onChange={handleGenreChange}>
              {genresList.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div style={buttonGroupStyle}>
            <button type="submit">Create Track</button>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Стилі для модалки
const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Напівпрозорий фон
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '100%',
  position: 'relative',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '15px',
  display: 'flex',
  flexDirection: 'column',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '10px',
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: '#e0e0e0',
  color: '#000',
  padding: '8px 12px',
  border: '1px solid #aaa',
  borderRadius: '4px',
  cursor: 'pointer',
};


export default CreateTrackForm;
