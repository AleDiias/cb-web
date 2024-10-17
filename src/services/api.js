import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
});

export const createUtterance = async (data) => {
  try {
    const response = await api.post('/utters/create', data);
    return response.data;
  } catch (error) {
    console.error('Error creating utterance:', error);
    throw error;
  }
};

export default api;