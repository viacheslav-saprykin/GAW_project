// components/TrackFileUpload.tsx
import React, { useState } from 'react';

type TrackFileUploadProps = {
  onFileUpload: (file: File) => void; // Функція, яка передає вибраний файл у батьківський компонент
};

const TrackFileUpload: React.FC<TrackFileUploadProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      // Перевірка типу файлу
      const validTypes = ['audio/mp3', 'audio/wav']; // Дозволені типи файлів
      if (!validTypes.includes(selectedFile.type)) {
        setErrorMessage('Invalid file type. Only .mp3 and .wav files are allowed.');
        setFile(null);
        return;
      }

      // Перевірка розміру файлу
      const maxSize = 10 * 1024 * 1024; // 10 МБ
      if (selectedFile.size > maxSize) {
        setErrorMessage('File size exceeds 10MB.');
        setFile(null);
        return;
      }

      // Якщо все в порядку, зберігаємо файл
      setFile(selectedFile);
      setErrorMessage(null);
      onFileUpload(selectedFile); // Викликаємо функцію на зовнішній компонент
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".mp3, .wav"
        onChange={handleFileChange}
        aria-label="Upload track file"
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {file && <p>File selected: {file.name}</p>}
    </div>
  );
};

export default TrackFileUpload;
