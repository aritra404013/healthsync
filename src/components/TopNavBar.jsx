import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopNavBar() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="glass-nav sticky top-0 w-full z-50 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-[1440px] mx-auto h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-teal-600/10 rounded-xl flex items-center justify-center group-hover:bg-teal-600/20 transition-colors border border-teal-600/20">
            <span className="material-symbols-outlined filled text-teal-700 text-2xl">ecg_heart</span>
          </div>
          <span className="text-[20px] font-extrabold tracking-tight text-slate-900">HealthSync</span>
        </Link>

        <nav className="hidden md:flex gap-8 items-center bg-slate-100/80 px-6 py-2 rounded-full border border-slate-200/80 shadow-inner">
          <a href="/#how-it-works" className="text-slate-600 hover:text-teal-700 transition-colors text-[14px] font-semibold">How it Works</a>
          <Link to="/pharmacies" className={`transition-colors text-[14px] font-semibold relative ${location.pathname === '/pharmacies' ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'}`}>
            Find Pharmacies
            {location.pathname === '/pharmacies' && <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-teal-600 rounded-full"></span>}
          </Link>
          <Link to="/doctors" className={`transition-colors text-[14px] font-semibold relative ${location.pathname === '/doctors' ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'}`}>
            Find Doctors
            {location.pathname === '/doctors' && <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-teal-600 rounded-full"></span>}
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className={`transition-colors text-[14px] font-semibold relative ${location.pathname === '/dashboard' ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'}`}>
              Dashboard
              {location.pathname === '/dashboard' && <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-teal-600 rounded-full"></span>}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors">
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-[12px] font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-[13px] font-bold text-slate-700 max-w-[100px] truncate">{user?.name?.split(' ')[0] || 'User'}</span>
              </Link>
              <Link to="/analysis" className="btn-nav-cta">
                Start Analysis
              </Link>
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl text-[13px] font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-[14px] font-bold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200">
                <span className="material-symbols-outlined text-[18px]">login</span>
                Sign In
              </Link>
              <Link to="/register" className="btn-nav-cta">
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
