import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.jsx";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-5 transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="bg-[var(--bg-card)] p-10 rounded-xl shadow-lg w-full max-w-md border border-[var(--border-color)]">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-1 mb-6">
            <svg
              width="48"
              height="48"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[var(--primary)]"
            >
              {/* Clipboard background */}
              <rect
                x="12"
                y="8"
                width="36"
                height="44"
                rx="3"
                fill="currentColor"
                opacity="0.1"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              {/* Clipboard clip */}
              <rect
                x="22"
                y="2"
                width="16"
                height="8"
                rx="2"
                fill="currentColor"
              />

              {/* Chart bars */}
              <rect
                x="18"
                y="28"
                width="4"
                height="16"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="26"
                y="22"
                width="4"
                height="22"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="34"
                y="26"
                width="4"
                height="18"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="42"
                y="20"
                width="4"
                height="24"
                rx="1"
                fill="currentColor"
              />

              {/* Checkmark on top */}
              <circle
                cx="48"
                cy="12"
                r="10"
                fill="currentColor"
                opacity="0.2"
              />
              <path
                d="M45 12l2 2l4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <div>
              <h1 className="text-2xl font-bold text-[var(--primary)]">
                Live Survey
              </h1>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Surveys Made Easy
              </p>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              Get Started
            </h2>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg mb-5 text-center text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-xs uppercase tracking-wide font-medium text-[var(--text-secondary)]">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-xs uppercase tracking-wide font-medium text-[var(--text-secondary)]">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-xs uppercase tracking-wide font-medium text-[var(--text-secondary)]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            <UserPlus className="w-5 h-5" />
            Register
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--primary)] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 rounded"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
