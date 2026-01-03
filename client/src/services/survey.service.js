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

