import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { createSurvey } from "../services/survey.service.js";
import {
  ArrowLeft,
  Plus,
  X,
  Trash2,
  FileText,
  Type,
  ChevronDown,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.jsx";

const CreateSurvey = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { type: "MCQ", question: "", options: ["", ""] },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { type: "MCQ", question: "", options: ["", ""] },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateQuestionType = (index, type) => {
    const updated = [...questions];
    updated[index].type = type;
    if (type === "Text") {
      updated[index].options = [];
    } else {
      updated[index].options = ["", ""];
    }
    setQuestions(updated);
  };

  const addOption = (questionIndex) => {
    const updated = [...questions];
    updated[questionIndex].options.push("");
    setQuestions(updated);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updated);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validQuestions = questions
      .map((q) => ({
        type: q.type,
        question: q.question.trim(),
        options:
          q.type === "MCQ" ? q.options.filter((opt) => opt.trim() !== "") : [],
      }))
      .filter((q) => q.question !== "");

    if (validQuestions.length === 0) {
      alert("Please add at least one valid question");
      return;
    }

    for (const q of validQuestions) {
      if (q.type === "MCQ" && q.options.length < 2) {
        alert("MCQ questions must have at least 2 options");
        return;
      }
    }

    try {
      await createSurvey({
        title: title.trim(),
        description: description.trim(),
        questions: validQuestions,
      });
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create survey");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-200">
      <header className="bg-[var(--bg-card)] border-b border-[var(--border-color)] p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Create New Survey
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-[var(--bg-card)] rounded-xl shadow-lg p-8 border border-[var(--border-color)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-xs uppercase tracking-wide font-medium text-[var(--text-secondary)]">
                Survey Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter survey title"
                className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs uppercase tracking-wide font-medium text-[var(--text-secondary)]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter survey description (optional)"
                rows="3"
                className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="mt-8">
              <div className="mb-5">
                <h3 className="text-lg font-medium text-[var(--text-primary)]">
                  Questions
                </h3>
              </div>

              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="bg-[var(--bg-primary)] p-5 rounded-lg mb-5 border border-[var(--border-color)]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      {q.type === "MCQ" ? (
                        <FileText className="w-4 h-4 text-[var(--text-secondary)]" />
                      ) : (
                        <Type className="w-4 h-4 text-[var(--text-secondary)]" />
                      )}
                      <div className="relative">
                        <select
                          value={q.type}
                          onChange={(e) =>
                            updateQuestionType(qIndex, e.target.value)
                          }
                          className="pl-3 pr-8 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium cursor-pointer bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] appearance-none min-w-[140px]"
                        >
                          <option value="MCQ">Multiple Choice</option>
                          <option value="Text">Short Answer</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
                      </div>
                    </div>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-xs uppercase tracking-wide font-medium text-[var(--text-secondary)]">
                      Question *
                    </label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) =>
                        updateQuestion(qIndex, "question", e.target.value)
                      }
                      placeholder="Enter your question"
                      required
                      className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                    />
                  </div>

                  {q.type === "MCQ" && (
                    <div>
                      <label className="block mb-2 text-xs uppercase tracking-wide font-medium text-[var(--text-secondary)]">
                        Options *
                      </label>
                      {q.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(qIndex, oIndex, e.target.value)
                            }
                            placeholder={`Option ${oIndex + 1}`}
                            required
                            className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                          />
                          {q.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(qIndex, oIndex)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 mt-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Option
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-4">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="w-full px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-[var(--bg-primary)] hover:bg-[var(--bg-primary)]/80 text-[var(--text-primary)] rounded-lg font-medium transition-all duration-200 border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
              >
                Create Survey
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;
