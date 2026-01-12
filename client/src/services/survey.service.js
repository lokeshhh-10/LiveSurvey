import api from '../api/config.js';

export const createSurvey = async (surveyData) => {
  const response = await api.post('/surveys', surveyData);
  return response.data;
};

export const getSurveys = async () => {
  const response = await api.get('/surveys');
  return response.data;
};

export const getSurveyById = async (id) => {
  const response = await api.get(`/surveys/${id}`);
  return response.data;
};

export const getSurveyByLink = async (link) => {
  const response = await api.get(`/surveys/link/${link}`);
  return response.data;
};

export const updateSurvey = async (id, data) => {
  const response = await api.patch(`/surveys/${id}`, data);
  return response.data;
};

export const deleteSurvey = async (id) => {
  const response = await api.delete(`/surveys/${id}`);
  return response.data;
};

