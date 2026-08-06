import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './Layout';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HealthAnalysisPage from './pages/HealthAnalysisPage';
import CarePlanPage from './pages/CarePlanPage';
import DashboardPage from './pages/DashboardPage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import AppointmentConfirmedPage from './pages/AppointmentConfirmedPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import PharmaciesPage from './pages/PharmaciesPage';
import ProfilePage from './pages/ProfilePage';

// Protected route wrapper — redirects to login if not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-3 border-teal-600 border-t-transparent animate-spin"></span>
          <span className="text-[14px] font-semibold text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public: Auth pages (no Layout wrapper) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* All other pages with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<WelcomePage />} />
        
        {/* Protected portal pages */}
        <Route path="analysis" element={<ProtectedRoute><HealthAnalysisPage /></ProtectedRoute>} />
        <Route path="care-plan" element={<ProtectedRoute><CarePlanPage /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="doctor/:id" element={<DoctorProfilePage />} />
        <Route path="appointment-confirmed/:id" element={<ProtectedRoute><AppointmentConfirmedPage /></ProtectedRoute>} />
        <Route path="prescriptions" element={<ProtectedRoute><PrescriptionsPage /></ProtectedRoute>} />
        <Route path="pharmacies" element={<PharmaciesPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
