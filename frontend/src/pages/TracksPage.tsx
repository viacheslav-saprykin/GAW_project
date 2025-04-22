import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

type Track = {
  id: number;
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
        const response = await axios.get('http://localhost:3000/api/tracks');
        setTracks(response.data.data);
        console.log('Loaded tracks:', response.data);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const deleteTrack = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/tracks/${id}`);
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
            {tracks.map((track) => (
              <li
                key={track.id}
                data-testid={`track-item-${track.id}`}
                className="track-item"
              >
                <span>{track.title}</span> – <span>{track.artist}</span>
                <div className="track-buttons">
                  {/* Додано посилання для редагування */}
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
