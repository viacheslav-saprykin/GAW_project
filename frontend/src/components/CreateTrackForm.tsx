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
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null); // Тепер сповіщення з типом

  const handleGenreAdd = (genre: string) => {
    if (!genres.includes(genre)) {
      setGenres((prevGenres) => [...prevGenres, genre]);
    }
  };

  const handleGenreRemove = (genre: string) => {
    setGenres((prevGenres) => prevGenres.filter((g) => g !== genre));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/tracks', {
        title,
        artist,
        album,
        coverImage: coverImageUrl,
        genres,
      });

      // Покажемо сповіщення
      setNotification({
        message: `Track "${response.data.title}" created successfully!`,
        type: 'success',
      });

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
      setNotification({
        message: 'Error creating track. Please try again.',
        type: 'error',
      }); // Сповіщення про помилку
    }
  };

  // Логіка для автоматичного приховування сповіщення
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000); // Сповіщення зникає через 3 секунди

      return () => clearTimeout(timer); // Очищаємо таймер при скасуванні
    }
  }, [notification]);

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

          {/* Сповіщення */}
          {notification && (
            <div
              style={{
                ...notificationStyle,
                backgroundColor: notification.type === 'error' ? '#f44336' : '#4CAF50', // Червоний для помилки, зелений для успіху
              }}
            >
              {notification.message}
            </div>
          )}

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
            <div style={tagContainerStyle}>
              {/* Виведення вибраних жанрів як тегів */}
              {genres.map((genre) => (
                <div key={genre} style={tagStyle}>
                  {genre}
                  <span
                    onClick={() => handleGenreRemove(genre)}
                    style={removeTagStyle}
                  >
                    x
                  </span>
                </div>
              ))}
              {/* Додавання жанрів */}
              <select
                onChange={(e) => handleGenreAdd(e.target.value)}
                value=""
                style={addTagStyle}
              >
                <option value="" disabled>Select a genre</option>
                {genresList.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
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

// Стиль для сповіщення
const notificationStyle: React.CSSProperties = {
  position: 'absolute',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '10px 20px',
  color: 'white',
  borderRadius: '5px',
  zIndex: 1001,
};

// Стилі для тегів жанрів
const tagContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
};

const tagStyle: React.CSSProperties = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '5px 10px',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
};

const removeTagStyle: React.CSSProperties = {
  marginLeft: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
};

const addTagStyle: React.CSSProperties = {
  marginTop: '10px',
  padding: '5px',
  borderRadius: '4px',
};

export default CreateTrackForm;
