import { Response } from '../models/Response.model.js';
import { Survey } from '../models/Survey.model.js';

export const getSurveyAnalytics = async (surveyId) => {
  const survey = await Survey.findById(surveyId);
  if (!survey) {
    throw new Error('Survey not found');
  }

  const responses = await Response.find({ surveyId });
  const totalResponses = responses.length;

  const questionAnalytics = survey.questions.map((question, index) => {
    const questionId = index.toString();
    
    if (question.type === 'MCQ') {
      const optionCounts = {};
      question.options.forEach(option => {
        optionCounts[option] = 0;
      });

      responses.forEach(response => {
        const answer = response.answers.find(a => a.questionId === questionId);
        if (answer && optionCounts.hasOwnProperty(answer.answer)) {
          optionCounts[answer.answer]++;
        }
      });

      return {
        questionId,
        question: question.question,
        type: question.type,
        options: question.options,
        optionCounts
      };
    } else {
      const textAnswers = responses
        .map(response => {
          const answer = response.answers.find(a => a.questionId === questionId);
          return answer ? answer.answer : null;
        })
        .filter(answer => answer !== null);

      return {
        questionId,
        question: question.question,
        type: question.type,
        textAnswers,
        totalTextResponses: textAnswers.length
      };
    }
  });

  return {
    surveyId,
    surveyTitle: survey.title,
    totalResponses,
    questionAnalytics
  };
};

