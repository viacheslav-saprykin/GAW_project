import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

type Track = {
  id: number;
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  genres?: string[];
};

const EditTrackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // отримуємо id треку з URL
  const navigate = useNavigate();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Завантаження треку для редагування
  useEffect(() => {
    if (!id) return; // Додаємо перевірку на існування id
    console.log(`Fetching track with ID: ${id}`);
    const fetchTrack = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/tracks/${id}`);
        if (response.data) {
          setTrack(response.data); // якщо трек знайдений, встановлюємо його в стан
        } else {
          setError("Track not found");
        }
      } catch (error) {
        setError("Error fetching track");
        console.error("Error fetching track:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack(); // завантажуємо трек за id
  }, [id]);

  // Обробник відправки форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (track) {
      try {
        await axios.put(`http://localhost:3000/api/tracks/${track.id}`, track);
        setSuccess("Track updated successfully!");
        setTimeout(() => {
          navigate("/tracks"); // Перенаправлення на сторінку зі списком треків після успішного редагування
        }, 2000);
      } catch (error) {
        setError("Error updating track");
        console.error("Error updating track:", error);
      }
    }
  };

  return (
    <div className="edit-track-page">
      <h1>Edit Track</h1>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        track && (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title</label>
              <input
                type="text"
                value={track.title}
                onChange={(e) => setTrack({ ...track, title: e.target.value })}
              />
            </div>
            <div>
              <label>Artist</label>
              <input
                type="text"
                value={track.artist}
                onChange={(e) => setTrack({ ...track, artist: e.target.value })}
              />
            </div>
            <div>
              <label>Album</label>
              <input
                type="text"
                value={track.album || ""}
                onChange={(e) => setTrack({ ...track, album: e.target.value })}
              />
            </div>
            <div>
              <label>Cover Image</label>
              <input
                type="text"
                value={track.coverImage || ""}
                onChange={(e) => setTrack({ ...track, coverImage: e.target.value })}
              />
            </div>
            <div>
              <label>Genres</label>
              <input
                type="text"
                value={track.genres?.join(", ") || ""}
                onChange={(e) => setTrack({ ...track, genres: e.target.value.split(", ").map((g) => g.trim()) })}
              />
            </div>
            <button type="submit">Update Track</button>
          </form>
        )
      )}
    </div>
  );
};

export default EditTrackPage;
