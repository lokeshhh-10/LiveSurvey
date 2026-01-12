import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { getSurveyByLink } from "../services/survey.service.js";
import { submitResponse } from "../services/response.service.js";
import { ArrowLeft, Send, FileText, CheckCircle } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.jsx";

const TakeSurvey = () => {
  const { link } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadSurvey();
  }, [link]);

  const loadSurvey = async () => {
    try {
      const data = await getSurveyByLink(link);
      setSurvey(data.survey);
      const initialAnswers = {};
      data.survey.questions.forEach((_, index) => {
        initialAnswers[index] = "";
      });
      setAnswers(initialAnswers);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Survey not found or is no longer accepting responses"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers({
      ...answers,
      [questionIndex]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const responseAnswers = survey.questions.map((_, index) => ({
      questionId: index.toString(),
      answer: answers[index] || "",
    }));

    const hasEmptyAnswers = responseAnswers.some((a) => !a.answer.trim());
    if (hasEmptyAnswers) {
      setError("Please answer all questions");
      setSubmitting(false);
      return;
    }

    try {
      const userIdentifier = `user-${Date.now()}-${Math.random()}`;
      await submitResponse({
        surveyId: survey._id,
        answers: responseAnswers,
        userIdentifier,
      });
      setSubmitted(true);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to submit response"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-lg text-[var(--text-secondary)]">
          Loading survey...
        </p>
      </div>
    );
  }

  if (error && !survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="bg-[var(--bg-card)] p-8 rounded-xl shadow-lg text-center border border-[var(--border-color)] max-w-md">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">
            {error}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] py-10 px-5 transition-colors duration-200">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="max-w-2xl mx-auto bg-[var(--bg-card)] p-8 rounded-xl shadow-lg border border-[var(--border-color)] text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
              Thank You!
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Your response has been submitted successfully.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-10 px-5 transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-2xl mx-auto bg-[var(--bg-card)] p-8 rounded-xl shadow-lg border border-[var(--border-color)]">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-[var(--primary)]" />
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              {survey?.title}
            </h1>
          </div>
          {survey?.description && (
            <p className="text-sm text-[var(--text-secondary)]">
              {survey.description}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg mb-5 text-center text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {survey?.questions.map((question, qIndex) => (
            <div key={qIndex} className="space-y-3">
              <label className="block text-lg font-medium text-[var(--text-primary)]">
                {qIndex + 1}. {question.question}
              </label>

              {question.type === "MCQ" ? (
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className="flex items-center p-4 border border-[var(--border-color)] rounded-lg cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--bg-primary)] transition-all duration-200 group"
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={option}
                        checked={answers[qIndex] === option}
                        onChange={(e) =>
                          handleAnswerChange(qIndex, e.target.value)
                        }
                        className="mr-3 w-4 h-4 text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                        required
                      />
                      <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[qIndex] || ""}
                  onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                  placeholder="Enter your answer..."
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all resize-none"
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 mt-8 pt-6 border-t border-[var(--border-color)]">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            >
              <Send className="w-5 h-5" />
              {submitting ? "Submitting..." : "Submit Response"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeSurvey;
