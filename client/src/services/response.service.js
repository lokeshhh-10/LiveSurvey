import api from '../api/config.js';

export const submitResponse = async (responseData) => {
  const response = await api.post('/responses', responseData);
  return response.data;
};

