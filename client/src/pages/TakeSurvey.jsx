import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurveyByLink } from '../services/survey.service.js';
import { submitResponse } from '../services/response.service.js';

const TakeSurvey = () => {
  const { link } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSurvey();
  }, [link]);

  const loadSurvey = async () => {
    try {
      const data = await getSurveyByLink(link);
      setSurvey(data.survey);
      const initialAnswers = {};
      data.survey.questions.forEach((_, index) => {
        initialAnswers[index] = '';
      });
      setAnswers(initialAnswers);
    } catch (error) {
      setError('Survey not found or not available');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers({
      ...answers,
      [questionIndex]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const responseAnswers = survey.questions.map((_, index) => ({
      questionId: index.toString(),
      answer: answers[index] || ''
    }));

    const hasEmptyAnswers = responseAnswers.some(a => !a.answer.trim());
    if (hasEmptyAnswers) {
      setError('Please answer all questions');
      setSubmitting(false);
      return;
    }

    try {
      const userIdentifier = `user-${Date.now()}-${Math.random()}`;
      await submitResponse({
        surveyId: survey._id,
        answers: responseAnswers,
        userIdentifier
      });
      alert('Thank you for your response!');
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Loading survey...</p>
      </div>
    );
  }

  if (error && !survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{survey?.title}</h1>
        {survey?.description && (
          <p className="text-gray-600 mb-8">{survey.description}</p>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {survey?.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-8">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                {qIndex + 1}. {question.question}
              </label>

              {question.type === 'MCQ' ? (
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition"
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={option}
                        checked={answers[qIndex] === option}
                        onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                        className="mr-3 w-4 h-4 text-indigo-600"
                        required
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[qIndex] || ''}
                  onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                  placeholder="Enter your answer..."
                  required
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeSurvey;

