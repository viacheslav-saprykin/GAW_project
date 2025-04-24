import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Track } from '../pages/TracksPage';
import './EditTrackForm.css';

type Props = {
  trackId: string;
  genresList: string[];
  onSuccess: (updatedTrack: Track) => void;
  onClose: () => void;
};

const EditTrackForm: React.FC<Props> = ({
  trackId,
  genresList,
  onSuccess,
  onClose,
}) => {
  const [form, setForm] = useState<Partial<Track>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await axios.get<Track>(
          `http://localhost:8000/api/tracks/${trackId}`
        );
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrack();
  }, [trackId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
      const selectedValues = Array.from(
        e.target.selectedOptions,
        (opt) => opt.value
      );
      setForm((prev) => ({ ...prev, [name]: selectedValues }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Submitting form:', form); // <- сюди

    try {
      const res = await axios.patch<Track>(
        `http://localhost:8000/api/tracks/${trackId}`,
        form
      );
      onSuccess(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-track-form">
      <h2>Edit Track</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title || ''}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="artist"
        placeholder="Artist"
        value={form.artist || ''}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="album"
        placeholder="Album"
        value={form.album || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="coverImage"
        placeholder="Cover Image URL"
        value={form.coverImage || ''}
        onChange={handleChange}
      />
      <select
        name="genres"
        multiple
        value={form.genres || []}
        onChange={handleChange}
      >
        {genresList.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default EditTrackForm;
