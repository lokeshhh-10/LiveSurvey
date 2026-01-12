import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/dashboard');
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
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-[var(--primary)] mb-2">
            Live Survey
          </h1>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Register</h2>
          <p className="text-sm text-[var(--text-secondary)]">Create your account to get started</p>
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
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--primary)] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 rounded">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
