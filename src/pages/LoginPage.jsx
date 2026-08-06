import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-teal-700 transition-colors">
              <span className="material-symbols-outlined filled text-white text-2xl">ecg_heart</span>
            </div>
            <span className="text-[24px] font-black tracking-tight text-slate-900">HealthSync</span>
          </Link>
          <p className="text-[14px] text-slate-500 font-medium mt-3">Sign in to access your health dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8">
          <h1 className="text-[26px] font-extrabold text-slate-900 mb-1">Welcome Back</h1>
          <p className="text-[14px] text-slate-500 font-medium mb-6">Enter your credentials to continue</p>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-800 font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-[14px] font-medium text-slate-900 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 outline-none transition-all placeholder:text-slate-400"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-300 text-[14px] font-medium text-slate-900 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 outline-none transition-all placeholder:text-slate-400"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-[15px] justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  Sign In
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[14px] text-slate-600 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-teal-700 font-bold hover:text-teal-800 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[12px] text-slate-400 font-medium mt-6">
          Protected by 256-bit encryption. Your health data is secure.
        </p>
      </div>
    </main>
  );
}
