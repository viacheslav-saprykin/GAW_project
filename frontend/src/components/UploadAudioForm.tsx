import React, { useState } from 'react';
import axios from 'axios';
import { Track } from '../pages/TracksPage'; // Імпортуємо Track
import './UploadAudioForm.css';

type Props = {
  trackId: string;
  onClose: () => void;
  onSuccess?: (updatedTrack: Track) => void; // Використовуємо Track як тип для onSuccess
};

const UploadAudioForm: React.FC<Props> = ({ trackId, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('audio', file);

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/tracks/${trackId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Викликаємо onSuccess, якщо він переданий
      if (onSuccess) {
        onSuccess(response.data); // передаємо оновлений трек
      }
      onClose(); // закрити модалку
    } catch (err) {
      setError('Upload failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleRemoveFile = () => {
    setFile(null); // Видаляємо файл
  };

  return (
    <form onSubmit={handleSubmit} className="upload-audio-form">
      <h2>Upload Audio</h2>
      <div className="upload-file-container">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
        />
        <span className="upload-text">
          {file ? file.name : 'Файл не вибрано'}
        </span>
        {file && (
          <button type="button" onClick={handleRemoveFile} className="remove-file-button">
            Видалити файл
          </button>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="upload-button-container">
        <button type="submit" disabled={loading} className="upload-button">
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
      </div>
    </form>
  );
};

export default UploadAudioForm;
