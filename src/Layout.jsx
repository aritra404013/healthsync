import { Outlet, useLocation, Link } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
import Footer from './components/Footer';

export default function Layout() {
  const { pathname } = useLocation();
  
  // Use Sidebar for all patient portal internal pages, TopNav for public welcome page
  const useSidebar = ['/dashboard', '/prescriptions', '/care-plan', '/pharmacies', '/doctors', '/analysis', '/profile'].some(p => pathname.includes(p)) || pathname.includes('/doctor/');
  // Don't show footer on app-like full height internal portal pages
  const hideFooter = useSidebar;

  return (
    <div className="min-h-screen flex flex-col bg-surface w-full">
      {!useSidebar && <TopNavBar />}
      {useSidebar && <SideNavBar />}
      
      <div className="flex-1 flex w-full">
        {/* Invisible spacer for the fixed sidebar */}
        {useSidebar && <div className="hidden md:block w-64 shrink-0"></div>}
        <div className="flex-1 flex flex-col w-full min-w-0 pb-16 md:pb-0">
          <Outlet />
        </div>
      </div>
      
      {!hideFooter && <Footer />}
      
      {/* Mobile Bottom Nav */}
      {useSidebar && (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-2 pb-4 md:hidden bg-white/90 backdrop-blur-xl shadow-[0px_-4px_25px_rgba(0,131,120,0.12)] border-t border-slate-200/80">
          <Link to="/dashboard" className={`flex flex-col items-center p-2 rounded-2xl text-[11px] font-extrabold transition-all duration-300 relative ${pathname === '/dashboard' ? 'text-teal-700 scale-105' : 'text-slate-500 hover:text-slate-700'}`}>
            <span className="material-symbols-outlined text-[23px] mb-0.5">home</span>
            <span>Home</span>
            {pathname === '/dashboard' && <span className="absolute top-1 right-3 w-1.5 h-1.5 bg-teal-600 rounded-full animate-ping"></span>}
          </Link>
          <Link to="/analysis" className={`flex flex-col items-center p-2 rounded-2xl text-[11px] font-extrabold transition-all duration-300 relative ${pathname === '/analysis' ? 'text-teal-700 scale-105' : 'text-slate-500 hover:text-slate-700'}`}>
            <span className="material-symbols-outlined text-[23px] mb-0.5">medical_services</span>
            <span>Assess</span>
            {pathname === '/analysis' && <span className="absolute top-1 right-3 w-1.5 h-1.5 bg-teal-600 rounded-full animate-ping"></span>}
          </Link>
          <Link to="/prescriptions" className={`flex flex-col items-center p-2 rounded-2xl text-[11px] font-extrabold transition-all duration-300 relative ${pathname === '/prescriptions' ? 'text-teal-700 scale-105' : 'text-slate-500 hover:text-slate-700'}`}>
            <span className="material-symbols-outlined text-[23px] mb-0.5">medication</span>
            <span>Remedies</span>
            {pathname === '/prescriptions' && <span className="absolute top-1 right-3 w-1.5 h-1.5 bg-teal-600 rounded-full animate-ping"></span>}
          </Link>
          <Link to="/pharmacies" className={`flex flex-col items-center p-2 rounded-2xl text-[11px] font-extrabold transition-all duration-300 relative ${pathname === '/pharmacies' ? 'text-teal-700 scale-105' : 'text-slate-500 hover:text-slate-700'}`}>
            <span className="material-symbols-outlined text-[23px] mb-0.5">local_pharmacy</span>
            <span>Pharmacies</span>
            {pathname === '/pharmacies' && <span className="absolute top-1 right-3 w-1.5 h-1.5 bg-teal-600 rounded-full animate-ping"></span>}
          </Link>
          <Link to="/doctors" className={`flex flex-col items-center p-2 rounded-2xl text-[11px] font-extrabold transition-all duration-300 relative ${pathname === '/doctors' ? 'text-teal-700 scale-105' : 'text-slate-500 hover:text-slate-700'}`}>
            <span className="material-symbols-outlined text-[23px] mb-0.5">person_search</span>
            <span>Doctors</span>
            {pathname === '/doctors' && <span className="absolute top-1 right-3 w-1.5 h-1.5 bg-teal-600 rounded-full animate-ping"></span>}
          </Link>
        </nav>
      )}
    </div>
  );
}
