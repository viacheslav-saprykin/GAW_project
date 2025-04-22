import React, { useEffect, useState } from 'react';
import { getGenres } from '../api/api';

const GenresPage: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await getGenres();
        setGenres(genresData);
      } catch (error) {
        console.error('Failed to fetch genres', error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div>
      <h1>Genres</h1>
      <ul>
        {genres.length > 0 ? (
          genres.map((genre, index) => <li key={index}>{genre}</li>)
        ) : (
          <p>Loading genres...</p>
        )}
      </ul>
    </div>
  );
};

export default GenresPage;
