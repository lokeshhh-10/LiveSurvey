import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [analytics, setAnalytics] = useState(null);
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareableLink, setShareableLink] = useState("");

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
    const socketConnection = io("http://localhost:5000");
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
    alert("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics || !survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-red-600">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {analytics.surveyTitle}
              </h1>
              <p className="text-gray-600 mt-2">
                Total Responses: {analytics.totalResponses}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={copyLink}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Copy Shareable Link
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {shareableLink && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Shareable Link:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                />
                <button
                  onClick={copyLink}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analytics.questionAnalytics.map((qa, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {index + 1}. {qa.question}
              </h3>

              {qa.type === "MCQ" ? (
                <div>
                  <div className="mb-4">
                    <Pie
                      data={{
                        labels: qa.options,
                        datasets: [
                          {
                            label: "Responses",
                            data: qa.options.map(
                              (opt) => qa.optionCounts[opt] || 0
                            ),
                            backgroundColor: [
                              "#667eea",
                              "#764ba2",
                              "#f093fb",
                              "#4facfe",
                              "#43e97b",
                              "#fa709a",
                            ],
                            borderWidth: 2,
                            borderColor: "#fff",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <Bar
                      data={{
                        labels: qa.options,
                        datasets: [
                          {
                            label: "Number of Responses",
                            data: qa.options.map(
                              (opt) => qa.optionCounts[opt] || 0
                            ),
                            backgroundColor: "#667eea",
                            borderColor: "#5568d3",
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-3">
                    Total Text Responses: {qa.totalTextResponses}
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {qa.textAnswers.length > 0 ? (
                      qa.textAnswers.map((answer, aIndex) => (
                        <div
                          key={aIndex}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <p className="text-gray-700 text-sm">{answer}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No responses yet</p>
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
