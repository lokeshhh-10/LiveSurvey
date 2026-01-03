import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getSurveys } from '../services/survey.service.js';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const data = await getSurveys();
      setSurveys(data.surveys);
    } catch (error) {
      console.error('Error loading surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = () => {
    navigate('/create-survey');
  };

  const handleViewAnalytics = (surveyId) => {
    navigate(`/analytics/${surveyId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <header className="bg-white rounded-xl shadow-md p-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Surveys</h1>
          <p className="text-gray-600 mt-1">Welcome, {user?.name}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCreateSurvey}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition transform hover:-translate-y-0.5 shadow-lg"
          >
            + Create Survey
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-lg text-gray-600 mb-6">No surveys yet. Create your first survey!</p>
            <button
              onClick={handleCreateSurvey}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition transform hover:-translate-y-0.5 shadow-lg"
            >
              Create Survey
            </button>
          </div>
        ) : (
          surveys.map((survey) => (
            <div
              key={survey._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-2"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{survey.title}</h3>
              {survey.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{survey.description}</p>
              )}
              <div className="text-xs text-gray-500 mb-4">
                Created: {new Date(survey.createdAt).toLocaleDateString()}
              </div>
              <button
                onClick={() => handleViewAnalytics(survey._id)}
                className="w-full py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition"
              >
                View Analytics
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;

