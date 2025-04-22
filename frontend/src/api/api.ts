import axios from 'axios';

// Інстанс для API
const api = axios.create({
  baseURL: 'http://localhost:8000', // Адреса серверу
});

// Отримання жанрів
export const getGenres = async () => {
  try {
    const response = await api.get('/api/genres');
    console.log('Genres fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export default api;
