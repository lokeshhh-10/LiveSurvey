import { Survey } from '../models/Survey.model.js';

export const createSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    const survey = new Survey({
      title,
      description,
      questions,
      createdBy: req.user._id
    });

    await survey.save();

    res.status(201).json({
      message: 'Survey created successfully',
      survey
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .select('-questions');

    res.json({ surveys });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSurveyById = async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await Survey.findById(id);

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    res.json({ survey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSurveyByLink = async (req, res) => {
  try {
    const { link } = req.params;
    const survey = await Survey.findOne({ shareableLink: link });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (!survey.isPublished) {
      return res.status(404).json({ message: 'Survey is not published' });
    }

    res.json({ survey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

