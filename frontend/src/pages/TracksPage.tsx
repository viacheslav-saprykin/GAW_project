import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './TracksPage.css';
import CreateTrackForm from '../components/CreateTrackForm';
import Modal from '../components/Modal';

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
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Дебаунс для пошуку
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<TracksResponse>(
        'http://localhost:8000/api/tracks',
        {
          params: {
            page: currentPage,
            limit: 10,
            _sort: sortField,
            _order: sortOrder,
            search: debouncedSearch,
            genre: filterGenre,
            artist: filterArtist,
          },
        }
      );
      setTracks(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    sortField,
    sortOrder,
    debouncedSearch,
    filterGenre,
    filterArtist,
  ]);

  const fetchGenres = useCallback(async () => {
    try {
      const res = await axios.get<string[]>('http://localhost:8000/api/genres');
      setGenresList(res.data);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const toggleSelectTrack = (id: string) => {
    const newSelectedTracks = new Set(selectedTracks);
    if (newSelectedTracks.has(id)) {
      newSelectedTracks.delete(id);
    } else {
      newSelectedTracks.add(id);
    }
    setSelectedTracks(newSelectedTracks);
  };

  const deleteTrack = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/tracks/${id}`);
      setTracks(tracks.filter((track) => track.id !== id));
    } catch (err) {
      console.error('Error deleting track:', err);
    }
  };

  const deleteSelectedTracks = async () => {
    try {
      const trackIds = Array.from(selectedTracks);
      await axios.post('http://localhost:8000/api/tracks/delete', {
        ids: trackIds,
      });
      setTracks(tracks.filter((track) => !selectedTracks.has(track.id)));
      setSelectedTracks(new Set());
    } catch (err) {
      console.error('Error deleting selected tracks:', err);
    }
  };

  const handleCreateSuccess = (newTrack: Track) => {
    setShowCreateModal(false);
    setTracks([newTrack, ...tracks]);
  };

  return (
    <div className="tracks-page">
      <h1>All Tracks</h1>

      <div className="create-track-button">
        <button onClick={() => setShowCreateModal(true)}>Create Track</button>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by title or artist"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="artist">Artist</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>

        <select
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genresList.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
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
          <div className="bulk-delete">
            <button
              onClick={deleteSelectedTracks}
              disabled={selectedTracks.size === 0}
            >
              Delete Selected
            </button>
          </div>

          <ul className="track-list">
            {tracks.map((track) => (
              <li key={track.id} className="track-item">
                <div className="track-info">
                  {track.coverImage && (
                    <img
                      src={track.coverImage}
                      alt={track.title}
                      className="cover-image"
                    />
                  )}
                  <div>
                    <h3>{track.title}</h3>
                    <p>Artist: {track.artist}</p>
                    {track.album && <p>Album: {track.album}</p>}
                    {track.genres && <p>Genres: {track.genres.join(', ')}</p>}
                  </div>
                </div>
                <div className="track-buttons">
                  <input
                    type="checkbox"
                    checked={selectedTracks.has(track.id)}
                    onChange={() => toggleSelectTrack(track.id)}
                  />
                  <button onClick={() => alert('Edit modal coming soon!')}>
                    Edit
                  </button>
                  <button onClick={() => deleteTrack(track.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <CreateTrackForm
            onSuccess={handleCreateSuccess}
            genresList={genresList}
            onClose={() => setShowCreateModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default TracksPage;
