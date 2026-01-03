import api from '../api/config.js';

export const getAnalytics = async (surveyId) => {
  const response = await api.get(`/analytics/${surveyId}`);
  return response.data;
};

