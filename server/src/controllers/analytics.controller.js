import { getSurveyAnalytics } from '../services/analytics.service.js';

export const getAnalytics = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const analytics = await getSurveyAnalytics(surveyId);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

