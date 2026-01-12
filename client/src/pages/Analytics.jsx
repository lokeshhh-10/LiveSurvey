import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { io } from "socket.io-client";
import { getSurveyById } from "../services/survey.service.js";
import { getAnalytics } from "../services/analytics.service.js";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import {
  ArrowLeft,
  Copy,
  Check,
  BarChart3,
  Link as LinkIcon,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.jsx";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Analytics = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareableLink, setShareableLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
    const socketConnection = setupSocket();

    return () => {
      if (socketConnection) {
        socketConnection.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyId]);

  const setupSocket = () => {
    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:5000";
    const socketConnection = io(SOCKET_URL);
    socketConnection.emit("join-survey", surveyId);

    socketConnection.on("new-response", (data) => {
      if (data.surveyId === surveyId) {
        loadAnalytics();
      }
    });

    return socketConnection;
  };

  const loadData = async () => {
    try {
      const [analyticsData, surveyData] = await Promise.all([
        getAnalytics(surveyId),
        getSurveyById(surveyId),
      ]);
      setAnalytics(analyticsData);
      setSurvey(surveyData.survey);
      const link = `${window.location.origin}/survey/${surveyData.survey.shareableLink}`;
      setShareableLink(link);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics(surveyId);
      setAnalytics(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Chart colors that work in both themes
  const getChartColors = () => {
    if (theme === "dark") {
      return [
        "#6366F1", // indigo
        "#8B5CF6", // purple
        "#EC4899", // pink
        "#10B981", // green
        "#F59E0B", // amber
        "#EF4444", // red
      ];
    }
    return [
      "#4F46E5", // indigo
      "#7C3AED", // purple
      "#DB2777", // pink
      "#059669", // green
      "#D97706", // amber
      "#DC2626", // red
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-lg text-[var(--text-secondary)]">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (!analytics || !survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-lg text-red-600 dark:text-red-400">
          Failed to load analytics
        </p>
      </div>
    );
  }

  const chartColors = getChartColors();

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
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              {analytics.surveyTitle}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Total Responses:{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {analytics.totalResponses}
              </span>
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-[var(--bg-card)] rounded-xl shadow-lg p-6 mb-6 border border-[var(--border-color)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-lg font-medium text-[var(--text-primary)]">
                Shareable Link
              </h2>
            </div>
            <button
              onClick={copyLink}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </button>
          </div>

          {shareableLink && (
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
              <p className="text-xs uppercase tracking-wide font-medium text-[var(--text-secondary)] mb-2">
                Shareable Link:
              </p>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)]">
                  <LinkIcon className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" />
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
                <button
                  onClick={copyLink}
                  className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {analytics.questionAnalytics.map((qa, index) => (
            <div
              key={index}
              className="bg-[var(--bg-card)] rounded-xl shadow-md p-4 border border-[var(--border-color)]"
            >
              <h3 className="text-base font-medium text-[var(--text-primary)] mb-3">
                {index + 1}. {qa.question}
              </h3>

              {qa.type === "MCQ" ? (
                <div className="space-y-3">
                  <div className="h-48">
                    <Pie
                      data={{
                        labels: qa.options,
                        datasets: [
                          {
                            label: "Responses",
                            data: qa.options.map(
                              (opt) => qa.optionCounts[opt] || 0
                            ),
                            backgroundColor: chartColors,
                            borderWidth: 2,
                            borderColor:
                              theme === "dark" ? "#020617" : "#FFFFFF",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              color: theme === "dark" ? "#E5E7EB" : "#111827",
                              padding: 8,
                              font: {
                                family: "Poppins",
                                size: 10,
                              },
                            },
                          },
                          tooltip: {
                            backgroundColor:
                              theme === "dark" ? "#020617" : "#FFFFFF",
                            titleColor:
                              theme === "dark" ? "#E5E7EB" : "#111827",
                            bodyColor: theme === "dark" ? "#E5E7EB" : "#111827",
                            borderColor:
                              theme === "dark" ? "#1E293B" : "#E5E7EB",
                            borderWidth: 1,
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="h-40">
                    <Bar
                      data={{
                        labels: qa.options,
                        datasets: [
                          {
                            label: "Number of Responses",
                            data: qa.options.map(
                              (opt) => qa.optionCounts[opt] || 0
                            ),
                            backgroundColor: chartColors[0],
                            borderColor: chartColors[0],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            backgroundColor:
                              theme === "dark" ? "#020617" : "#FFFFFF",
                            titleColor:
                              theme === "dark" ? "#E5E7EB" : "#111827",
                            bodyColor: theme === "dark" ? "#E5E7EB" : "#111827",
                            borderColor:
                              theme === "dark" ? "#1E293B" : "#E5E7EB",
                            borderWidth: 1,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1,
                              color: theme === "dark" ? "#94A3B8" : "#6B7280",
                              font: {
                                family: "Poppins",
                              },
                            },
                            grid: {
                              color: theme === "dark" ? "#1E293B" : "#E5E7EB",
                            },
                          },
                          x: {
                            ticks: {
                              color: theme === "dark" ? "#94A3B8" : "#6B7280",
                              font: {
                                family: "Poppins",
                              },
                            },
                            grid: {
                              color: theme === "dark" ? "#1E293B" : "#E5E7EB",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">
                    Total Text Responses:{" "}
                    <span className="font-medium text-[var(--text-primary)]">
                      {qa.totalTextResponses}
                    </span>
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {qa.textAnswers.length > 0 ? (
                      qa.textAnswers.map((answer, aIndex) => (
                        <div
                          key={aIndex}
                          className="p-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]"
                        >
                          <p className="text-xs text-[var(--text-primary)]">
                            {answer}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[var(--text-secondary)] text-center py-4">
                        No responses yet
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
