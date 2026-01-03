import { Response } from '../models/Response.model.js';
import { Survey } from '../models/Survey.model.js';
import { getIO } from '../config/socket.js';

export const submitResponse = async (req, res) => {
  try {
    const { surveyId, answers, userIdentifier } = req.body;

    if (!surveyId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Survey ID and answers are required' });
    }

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (!survey.isPublished) {
      return res.status(400).json({ message: 'Survey is not published' });
    }

    if (userIdentifier) {
      const existingResponse = await Response.findOne({
        surveyId,
        userIdentifier
      });

      if (existingResponse) {
        return res.status(400).json({ message: 'You have already submitted this survey' });
      }
    }

    const response = new Response({
      surveyId,
      answers,
      userIdentifier: userIdentifier || null
    });

    await response.save();

    const io = getIO();
    io.to(`survey-${surveyId}`).emit('new-response', {
      surveyId,
      totalResponses: await Response.countDocuments({ surveyId })
    });

    res.status(201).json({
      message: 'Response submitted successfully',
      response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

