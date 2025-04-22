import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TracksPage.css';

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
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genresList, setGenresList] = useState<string[]>([]);
  const [filterGenre, setFilterGenre] = useState('');
  const [filterArtist, setFilterArtist] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    axios
      .get<string[]>('http://localhost:8000/api/genres')
      .then((res) => setGenresList(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        const res = await axios.get<TracksResponse>('http://localhost:8000/api/tracks', {
          params: {
            page: currentPage,
            limit: 10,
            _sort: sortField,
            _order: sortOrder,
            search: debouncedSearch,
            genre: filterGenre,
            artist: filterArtist,
          },
        });
        setTracks(res.data.data);
        setTotalPages(res.data.meta.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [currentPage, sortField, sortOrder, debouncedSearch, filterGenre, filterArtist]);

  const deleteTrack = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/tracks/${id}`);
      setTracks(tracks.filter((track) => track.id !== id));
    } catch (err) {
      console.error('Error deleting track:', err);
    }
  };

  return (
    <div className="tracks-page">
      <h1>All Tracks</h1>

      <div className="create-track-button">
        <Link to="/create">
          <button>Create Track</button>
        </Link>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="album">Album</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
        <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}>
          <option value="">All Genres</option>
          {genresList.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by artist"
          value={filterArtist}
          onChange={(e) => setFilterArtist(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading tracks...</p>
      ) : (
        <>
          <ul className="track-list">
            {tracks.map((track) => (
              <li key={track.id} className="track-item">
                <div className="track-info">
                  {track.coverImage && (
                    <img src={track.coverImage} alt={track.title} className="cover-image" />
                  )}
                  <div>
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

          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TracksPage;
