import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSurvey } from '../services/survey.service.js';

const CreateSurvey = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { type: 'MCQ', question: '', options: ['', ''] }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { type: 'MCQ', question: '', options: ['', ''] }]);
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
    if (type === 'Text') {
      updated[index].options = [];
    } else {
      updated[index].options = ['', ''];
    }
    setQuestions(updated);
  };

  const addOption = (questionIndex) => {
    const updated = [...questions];
    updated[questionIndex].options.push('');
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
        options: q.type === 'MCQ' ? q.options.filter(opt => opt.trim() !== '') : []
      }))
      .filter(q => q.question !== '');

    if (validQuestions.length === 0) {
      alert('Please add at least one valid question');
      return;
    }

    for (const q of validQuestions) {
      if (q.type === 'MCQ' && q.options.length < 2) {
        alert('MCQ questions must have at least 2 options');
        return;
      }
    }

    try {
      await createSurvey({
        title: title.trim(),
        description: description.trim(),
        questions: validQuestions
      });
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create survey');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Create New Survey</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 text-gray-700 font-medium">Survey Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter survey title"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-gray-700 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter survey description (optional)"
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition resize-none"
            />
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold text-gray-800">Questions</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition"
              >
                + Add Question
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-gray-50 p-5 rounded-lg mb-5 border-2 border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestionType(qIndex, e.target.value)}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium cursor-pointer"
                  >
                    <option value="MCQ">Multiple Choice</option>
                    <option value="Text">Short Answer</option>
                  </select>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm font-semibold hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-medium">Question *</label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    placeholder="Enter your question"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                {q.type === 'MCQ' && (
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">Options *</label>
                    {q.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          required
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                        />
                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-lg leading-none"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition mt-2"
                    >
                      + Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end mt-8">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition transform hover:-translate-y-0.5 shadow-lg"
            >
              Create Survey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSurvey;

