import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: 'dashboard', label: 'Overview', path: '/dashboard' },
  { icon: 'chat_bubble', label: 'AI Analysis', path: '/analysis' },
  { icon: 'assignment', label: 'Saved Plans', path: '/dashboard', hash: '#plans' },
  { icon: 'medication', label: 'Prescriptions', path: '/prescriptions' },
  { icon: 'local_pharmacy', label: 'Pharmacies', path: '/pharmacies' },
  { icon: 'person_search', label: 'Find Doctors', path: '/doctors' },
];

export default function SideNavBar() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-white/90 backdrop-blur-xl p-5 gap-4 z-50 border-r border-slate-200 shadow-xs transition-all duration-300">
      <div className="mb-4 flex items-center gap-3 px-2">
        <Link to="/" className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm hover:bg-teal-700 transition-colors">
          HS
        </Link>
        <div>
          <Link to="/" className="text-[18px] font-extrabold text-slate-900 tracking-tight block">HealthSync</Link>
          <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Patient Portal</p>
        </div>
      </div>

      <ul className="flex-1 flex flex-col gap-1.5">
        <li className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-2">Main Menu</li>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/doctors' && location.pathname.startsWith('/doctor'));
          return (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-[14px] font-semibold ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-slate-500'}`}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* User profile section */}
      {isAuthenticated && user && (
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <Link to="/profile" className="flex items-center gap-3 px-2 hover:bg-slate-50 p-1.5 rounded-xl transition-all group">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[22px] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              {user.profilePicture || '🩺'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">{user.name}</p>
              <p className="text-[11px] text-slate-500 font-medium truncate">{user.email}</p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      )}

      <div className="pt-3">
        <Link to="/analysis" className="btn-primary w-full justify-center py-3 text-[14px]">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>New Assessment</span>
        </Link>
      </div>
    </nav>
  );
}
