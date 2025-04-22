import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

type Track = {
  id: string; // Використовуємо string, як у відповіді API
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  genres?: string[];
};

const TracksPage: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/tracks');
        
        // Тепер звертаємось до поля `data` для отримання масиву треків
        if (Array.isArray(response.data.data)) {
          setTracks(response.data.data); // Відповідно зберігаємо дані з поля `data`
        } else {
          console.error('Received data is not an array:', response.data);
        }
        
        console.log('Loaded tracks:', response.data);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const deleteTrack = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/tracks/${id}`);
      setTracks(tracks.filter((track) => track.id !== id));
    } catch (error) {
      console.error('Error deleting track:', error);
    }
  };

  return (
    <div className="tracks-page">
      <h1 data-testid="tracks-header">All Tracks</h1>

      <div className="create-track-button">
        <Link to="/create" data-testid="create-track-button">
          <button>Create Track</button>
        </Link>
      </div>

      {loading ? (
        <div data-testid="loading-tracks">Loading tracks...</div>
      ) : (
        <>
          <ul>
            {Array.isArray(tracks) && tracks.map((track) => (
              <li
                key={track.id}
                data-testid={`track-item-${track.id}`}
                className="track-item"
              >
                <div className="track-info">
                  {track.coverImage && (
                    <img src={track.coverImage} alt={track.title} width={100} height={100} />
                  )}
                  <div className="track-details">
                    <h3>{track.title}</h3>
                    <p>Artist: {track.artist}</p>
                    {track.album && <p>Album: {track.album}</p>}
                    {track.genres && <p>Genres: {track.genres.join(', ')}</p>}
                  </div>
                </div>
                <div className="track-buttons">
                  <Link to={`/edit/${track.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => deleteTrack(track.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>

          <div data-testid="pagination" className="pagination">
            <button data-testid="pagination-prev">Previous</button>
            <button data-testid="pagination-next">Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TracksPage;
