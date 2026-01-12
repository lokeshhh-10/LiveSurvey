import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { getSurveys, deleteSurvey, updateSurvey } from "../services/survey.service.js";
import {
  LayoutDashboard,
  Plus,
  LogOut,
  BarChart3,
  FileText,
  TrendingUp,
  Users,
  Trash2,
  Lock,
  Unlock,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.jsx";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
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
      console.error("Error loading surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = () => {
    navigate("/create-survey");
  };

  const handleViewAnalytics = (surveyId) => {
    navigate(`/analytics/${surveyId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteSurvey = async (surveyId) => {
    if (!window.confirm("Are you sure you want to delete this survey? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteSurvey(surveyId);
      loadSurveys();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete survey");
    }
  };

  const handleToggleSurvey = async (surveyId, currentStatus) => {
    try {
      await updateSurvey(surveyId, { isPublished: !currentStatus });
      loadSurveys();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update survey");
    }
  };

  const totalResponses = surveys.reduce(
    (acc, survey) => acc + (survey.responseCount || 0),
    0
  );
  const activeSurveys = surveys.filter((s) => s.isPublished).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-lg text-[var(--text-secondary)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--bg-card)] border-r border-[var(--border-color)] p-6 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <LayoutDashboard className="w-6 h-6 text-[var(--primary)]" />
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">
              Live Survey
            </h1>
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            <p className="font-medium text-[var(--text-primary)]">{user?.name}</p>
            <p className="text-xs">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1">
          <button
            onClick={handleCreateSurvey}
            className="w-full flex items-center gap-3 px-4 py-3 mb-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary-hover)] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            <Plus className="w-5 h-5" />
            Create Survey
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[var(--bg-card)] border-b border-[var(--border-color)] p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Dashboard
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)] shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-[var(--primary)]" />
                </div>
              </div>
              <h3 className="text-xs uppercase tracking-wide font-medium text-[var(--text-secondary)] mb-1">
                Total Surveys
              </h3>
              <p className="text-2xl font-semibold text-[var(--text-primary)]">
                {surveys.length}
              </p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)] shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="text-xs uppercase tracking-wide font-medium text-[var(--text-secondary)] mb-1">
                Total Responses
              </h3>
              <p className="text-2xl font-semibold text-[var(--text-primary)]">
                {totalResponses}
              </p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)] shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-xs uppercase tracking-wide font-medium text-[var(--text-secondary)] mb-1">
                Active Surveys
              </h3>
              <p className="text-2xl font-semibold text-[var(--text-primary)]">
                {activeSurveys}
              </p>
            </div>
          </div>

          {/* Surveys Grid */}
          <div>
            <h2 className="text-lg font-medium text-[var(--text-primary)] mb-4">
              Your Surveys
            </h2>
            {surveys.length === 0 ? (
              <div className="bg-[var(--bg-card)] rounded-xl shadow-md p-12 text-center border border-[var(--border-color)]">
                <FileText className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
                <p className="text-lg text-[var(--text-secondary)] mb-6">
                  No surveys yet. Create your first survey!
                </p>
                <button
                  onClick={handleCreateSurvey}
                  className="px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Survey
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {surveys.map((survey) => (
                  <div
                    key={survey._id}
                    className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium text-[var(--text-primary)] flex-1">
                        {survey.title}
                      </h3>
                      {!survey.isPublished && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
                          Closed
                        </span>
                      )}
                    </div>
                    {survey.description && (
                      <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                        {survey.description}
                      </p>
                    )}
                    <div className="text-xs text-[var(--text-secondary)] mb-4">
                      <div>Created: {new Date(survey.createdAt).toLocaleDateString()}</div>
                      <div>Responses: {survey.responseCount || 0}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewAnalytics(survey._id)}
                        className="flex-1 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                      </button>
                      <button
                        onClick={() => handleToggleSurvey(survey._id, survey.isPublished)}
                        className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        title={survey.isPublished ? "Close Survey" : "Open Survey"}
                      >
                        {survey.isPublished ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteSurvey(survey._id)}
                        className="p-2.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete Survey"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
