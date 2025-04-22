import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

type Track = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  genres?: string[];
};

type TracksResponse = {
  data: Track[];
  meta: {
    currentPage: number;
    totalPages: number;
  };
};

const TracksPage: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        const response = await axios.get<TracksResponse>('http://localhost:8000/api/tracks', {
          params: {
            page: currentPage,
            limit: 10,
          },
        });

        // Зберігаємо треки та інформацію про сторінки
        if (Array.isArray(response.data.data)) {
          setTracks(response.data.data);
          setTotalPages(response.data.meta.totalPages);
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
  }, [currentPage]);

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

          {/* Пагінація */}
          <div data-testid="pagination" className="pagination">
            <button
              data-testid="pagination-prev"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              data-testid="pagination-next"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TracksPage;
