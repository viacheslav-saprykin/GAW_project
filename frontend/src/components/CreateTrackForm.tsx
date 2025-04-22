import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTrackForm = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [genres, setGenres] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenres = Array.from(e.target.selectedOptions, (option) => option.value);
    setGenres(selectedGenres);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/tracks", {
        title,
        artist,
        album,
        coverImage: coverImageUrl,
        genres,
      });

      alert("Track created successfully: " + response.data.title);

      // Очищення форми
      setTitle("");
      setArtist("");
      setAlbum("");
      setCoverImageUrl("");
      setGenres([]);

      // Перенаправлення
      navigate("/tracks");
    } catch (error) {
      console.error("Error creating track:", error);
      alert("Error creating track. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Create New Track</h2>

      <div style={fieldStyle}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div style={fieldStyle}>
        <label>Artist:</label>
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
      </div>

      <div style={fieldStyle}>
        <label>Album:</label>
        <input
          type="text"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
        />
      </div>

      <div style={fieldStyle}>
        <label>Cover Image URL:</label>
        <input
          type="text"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
        />
      </div>

      <div style={fieldStyle}>
        <label>Genres:</label>
        <select multiple value={genres} onChange={handleGenreChange}>
          <option value="Rock">Rock</option>
          <option value="Pop">Pop</option>
          <option value="Hip Hop">Hip Hop</option>
          <option value="Jazz">Jazz</option>
          <option value="Classical">Classical</option>
          <option value="Electronic">Electronic</option>
          <option value="R&B">R&B</option>
          <option value="Country">Country</option>
          <option value="Folk">Folk</option>
          <option value="Reggae">Reggae</option>
          <option value="Metal">Metal</option>
          <option value="Blues">Blues</option>
          <option value="Indie">Indie</option>
        </select>
      </div>

      <button type="submit">Create Track</button>
    </form>
  );
};

// Прості інлайн-стилі, щоб все не злипалося
const formStyle: React.CSSProperties = {
  maxWidth: "500px",
  margin: "0 auto",
  padding: "20px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const fieldStyle: React.CSSProperties = {
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column",
};

export default CreateTrackForm;
