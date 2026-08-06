import { Outlet, useLocation, Link } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
import Footer from './components/Footer';

export default function Layout() {
  const { pathname } = useLocation();
  
  // Use Sidebar for all patient portal internal pages, TopNav for public welcome page
  const useSidebar = ['/dashboard', '/prescriptions', '/care-plan', '/pharmacies', '/doctors', '/analysis'].some(p => pathname.includes(p)) || pathname.includes('/doctor/');
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
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 md:hidden bg-surface-container-lowest/90 backdrop-blur-lg shadow-[0px_-4px_20px_rgba(13,148,136,0.08)] border-t border-surface-variant/80">
          <Link to="/dashboard" className={`flex flex-col items-center p-2 rounded-xl text-[12px] font-semibold transition-colors ${pathname === '/dashboard' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[22px]">home</span>
            <span>Home</span>
          </Link>
          <Link to="/analysis" className={`flex flex-col items-center p-2 rounded-xl text-[12px] font-semibold transition-colors ${pathname === '/analysis' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[22px]">medical_services</span>
            <span>Assess</span>
          </Link>
          <Link to="/prescriptions" className={`flex flex-col items-center p-2 rounded-xl text-[12px] font-semibold transition-colors ${pathname === '/prescriptions' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[22px]">medication</span>
            <span>Meds</span>
          </Link>
          <Link to="/pharmacies" className={`flex flex-col items-center p-2 rounded-xl text-[12px] font-semibold transition-colors ${pathname === '/pharmacies' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[22px]">local_pharmacy</span>
            <span>Pharmacies</span>
          </Link>
          <Link to="/doctors" className={`flex flex-col items-center p-2 rounded-xl text-[12px] font-semibold transition-colors ${pathname === '/doctors' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[22px]">person_search</span>
            <span>Doctors</span>
          </Link>
        </nav>
      )}
    </div>
  );
}
