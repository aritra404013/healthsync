import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentsAPI, chatAPI, treatmentPlansAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  
  // Welcome Back Caring Modal State
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [welcomeBackMessage, setWelcomeBackMessage] = useState('');
  const [welcomeBackProblem, setWelcomeBackProblem] = useState('');
  const [caringToast, setCaringToast] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [apptRes, sessRes, plansRes] = await Promise.allSettled([
          appointmentsAPI.list(),
          chatAPI.getSessions(),
          treatmentPlansAPI.list()
        ]);

        if (apptRes.status === 'fulfilled' && apptRes.value.data) {
          setAppointments(apptRes.value.data);
        } else {
          setAppointments([]);
        }

        if (sessRes.status === 'fulfilled' && sessRes.value.data) {
          const list = sessRes.value.data;
          setSessions(list);

          // Evaluate returning user check-in popup conditions
          const alreadyShown = sessionStorage.getItem('healthsync_welcome_shown');
          if (!alreadyShown && (list.length > 0 || apptRes.value.data?.length > 0)) {
            try {
              const checkinRes = await chatAPI.getWelcomeCheckin();
              if (checkinRes.data && checkinRes.data.message) {
                setWelcomeBackMessage(checkinRes.data.message);
                setShowWelcomeBack(true);
                sessionStorage.setItem('healthsync_welcome_shown', 'true');
              }
            } catch (err) {
              console.warn('Failed to load dynamic welcome checkin:', err);
            }
          }
        } else {
          setSessions([]);
        }

        if (plansRes.status === 'fulfilled' && plansRes.value.data) {
          setTreatmentPlans(plansRes.value.data);
        }
      } catch (e) {
        setAppointments([]);
        setSessions([]);
      } finally {
        setLoadingPlans(false);
      }
    };
    loadData();
  }, []);

  const stats = [
    { icon: 'event_available', label: 'Appointments', value: appointments.length, color: 'from-primary/20 to-primary/5 text-primary', border: 'border-primary/20' },
    { icon: 'bookmark', label: 'Saved Treatment Plans', value: treatmentPlans.length, color: 'from-amber-500/20 to-amber-500/5 text-amber-700', border: 'border-amber-500/20' },
    { icon: 'chat_bubble', label: 'AI Assessments', value: sessions.length, color: 'from-[#00bfa5]/20 to-[#00bfa5]/5 text-[#00bfa5]', border: 'border-[#00bfa5]/20' },
  ];

  return (
    <div className="w-full px-4 md:px-10 lg:px-16 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="animate-fade-in">
          <h1 className="text-[30px] md:text-[36px] leading-[40px] font-black text-on-surface tracking-tight text-gradient-animated">Patient Dashboard</h1>
          <p className="text-[15px] text-on-surface-variant mt-1 font-medium">Your personal health records, appointments & saved AI treatment plans</p>
        </div>
        <Link to="/analysis" className="bg-primary hover:bg-primary-container text-on-primary text-[15px] font-bold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-glow hover:shadow-glow-hover active:scale-95 flex items-center gap-2 group animate-fade-in">
          <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-300">add</span>New Assessment
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={s.label} className="glass p-6 rounded-[1.5rem] shadow-soft hover:shadow-glow-hover transition-all duration-300 flex items-center gap-5 group animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${s.color} border ${s.border} group-hover:scale-110 transition-transform duration-300`}>
              <span className="material-symbols-outlined text-[32px]">{s.icon}</span>
            </div>
            <div>
              <p className="text-[36px] leading-none font-black text-on-surface mb-1">{s.value}</p>
              <p className="text-[14px] font-semibold text-on-surface-variant">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SAVED TREATMENT PLANS SECTION */}
      <div id="plans" className="glass p-6 md:p-8 rounded-[1.5rem] shadow-soft animate-slide-up mb-10">
        <div className="flex justify-between items-center mb-6 border-b border-surface-variant/50 pb-4">
          <h2 className="text-[20px] md:text-[22px] font-bold text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-700 bg-amber-100 p-2 rounded-xl text-[20px]">assignment_turned_in</span>
            Saved AI Treatment Plans
          </h2>
          <span className="text-[13px] font-bold text-slate-500">{treatmentPlans.length} Saved</span>
        </div>

        {loadingPlans ? (
          <div className="py-8 text-center text-slate-500 font-medium text-[14px]">Loading saved treatment plans...</div>
        ) : treatmentPlans.length === 0 ? (
          <div className="text-center py-10 px-6 bg-surface-container-lowest/50 rounded-2xl border border-dashed border-outline-variant/50">
            <span className="material-symbols-outlined text-outline/50 text-[48px] mb-2 block">bookmark_border</span>
            <p className="text-[15px] text-on-surface-variant mb-2 font-medium">No saved treatment plans yet</p>
            <p className="text-[13px] text-slate-500 mb-4">Run an AI symptom analysis and click "Save to Profile" on your care plan page.</p>
            <Link to="/analysis" className="btn-primary text-[13px] py-2.5 px-5">Start New Symptom Assessment</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {treatmentPlans.map((plan) => (
              <Link
                key={plan._id}
                to="/care-plan"
                state={{ diagnosis: plan.diagnosis, sessionId: plan.sessionId }}
                className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-[16px] font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                      {plan.title || 'AI Care Plan'}
                    </h3>
                    {plan.diagnosis?.severity && (
                      <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md shrink-0 ${
                        plan.diagnosis.severity === 'emergency' ? 'bg-red-100 text-red-800 border border-red-300' :
                        plan.diagnosis.severity === 'severe' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                        plan.diagnosis.severity === 'moderate' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        'bg-teal-100 text-teal-800 border border-teal-300'
                      }`}>
                        {plan.diagnosis.severity}
                      </span>
                    )}
                  </div>

                  <p className="text-[13px] text-slate-600 font-medium line-clamp-2 mb-3">
                    {plan.diagnosis?.conditions?.[0]?.description || 'Comprehensive preliminary evaluation with Ayurvedic remedies.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[12px]">
                  <span className="text-slate-400 font-semibold">
                    Saved {new Date(plan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="font-bold text-teal-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Care Plan
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="glass p-6 md:p-8 rounded-[1.5rem] shadow-soft animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center mb-6 border-b border-surface-variant/50 pb-4">
            <h2 className="text-[20px] md:text-[22px] font-bold text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl text-[20px]">calendar_today</span>
              Upcoming Appointments
            </h2>
            <Link to="/doctors" className="text-[14px] font-bold text-primary hover:text-primary-container transition-colors">Book New</Link>
          </div>
          {appointments.length === 0 ? (
            <div className="text-center py-12 px-6 bg-surface-container-lowest/50 rounded-2xl border border-dashed border-outline-variant/50">
              <span className="material-symbols-outlined text-outline/50 text-[56px] mb-3 block">event_busy</span>
              <p className="text-[15px] text-on-surface-variant mb-3 font-medium">No upcoming appointments</p>
              <Link to="/doctors" className="text-primary text-[14px] font-bold hover:underline">Match with verified doctors</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.slice(0, 5).map((appt) => (
                <div key={appt._id} className="group flex items-center gap-4 p-4 bg-surface-container-lowest/80 rounded-2xl border border-surface-variant/50 hover:border-primary/40 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-transparent rounded-xl flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                    <span className="material-symbols-outlined">event</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-on-surface truncate">{appt.doctorId?.name || 'Doctor Consultation'}</p>
                    <p className="text-[13px] text-on-surface-variant font-medium mt-0.5 truncate">{appt.doctorId?.specialty || 'General'} · {appt.time}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-bold text-on-surface mb-1">{new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-emerald-100 text-emerald-800">{appt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Assessments */}
        <div className="glass p-6 md:p-8 rounded-[1.5rem] shadow-soft animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-6 border-b border-surface-variant/50 pb-4">
            <h2 className="text-[20px] md:text-[22px] font-bold text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl text-[20px]">history</span>
              Recent Assessments
            </h2>
            <Link to="/analysis" className="text-[14px] font-bold text-primary hover:text-primary-container transition-colors">Start New</Link>
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-12 px-6 bg-surface-container-lowest/50 rounded-2xl border border-dashed border-outline-variant/50">
              <span className="material-symbols-outlined text-outline/50 text-[56px] mb-3 block">chat_bubble</span>
              <p className="text-[15px] text-on-surface-variant mb-3 font-medium">No assessments yet</p>
              <Link to="/analysis" className="text-primary text-[14px] font-bold hover:underline">Start your AI health analysis</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.slice(0, 5).map((sess) => (
                <Link key={sess._id} to="/care-plan" state={{ diagnosis: sess.diagnosis, sessionId: sess._id }} className="group flex items-center gap-4 p-4 bg-surface-container-lowest/80 rounded-2xl border border-surface-variant/50 hover:border-primary/40 hover:shadow-md transition-all block">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-gradient-to-br from-primary/10 to-transparent text-primary border-primary/10 shrink-0">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-on-surface group-hover:text-primary transition-colors truncate">Assessment #{sess._id?.slice(-6)}</p>
                    <p className="text-[13px] text-on-surface-variant font-medium mt-0.5 truncate">{sess.symptomTags?.join(', ') || 'General Symptom Assessment'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] text-on-surface-variant font-medium mb-1">{new Date(sess.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Completed</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10 animate-slide-up" style={{ animationDelay: '0.5s' }}>
        {[
          { icon: 'chat_bubble', label: 'AI Analysis', path: '/analysis', color: 'from-primary/20 to-primary/5 text-primary border-primary/20' },
          { icon: 'local_pharmacy', label: 'Pharmacies', path: '/pharmacies', color: 'from-tertiary/20 to-tertiary/5 text-tertiary border-tertiary/20' },
          { icon: 'medication', label: 'Prescriptions', path: '/prescriptions', color: 'from-[#00bfa5]/20 to-[#00bfa5]/5 text-[#00bfa5] border-[#00bfa5]/20' },
          { icon: 'person_search', label: 'Find Doctors', path: '/doctors', color: 'from-secondary/20 to-secondary/5 text-secondary border-secondary/20' },
        ].map((action) => (
          <Link key={action.label} to={action.path} className="glass p-5 rounded-[1.5rem] shadow-soft hover:shadow-glow-hover transition-all duration-300 text-center group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-gradient-to-br border ${action.color} group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
              <span className="material-symbols-outlined text-[28px]">{action.icon}</span>
            </div>
            <p className="text-[15px] font-bold text-on-surface">{action.label}</p>
          </Link>
        ))}
      </div>

      {/* CARING WELCOME BACK POPUP MODAL */}
      {showWelcomeBack && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center relative overflow-hidden card-interactive animate-scale-in">
            {/* Ambient Background Blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>
            
            {/* Heartbeat Pulse Icon */}
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-[36px] mx-auto mb-5 border border-rose-200/50 shadow-2xs">
              <span className="material-symbols-outlined text-[36px] text-rose-500 animate-heartbeatPulse">favorite</span>
            </div>

            <h3 className="text-[22px] font-black text-slate-900 mb-2">
              Welcome Back, {user?.name || 'Friend'}!
            </h3>
            
            <p className="text-[14.5px] text-slate-600 font-semibold leading-relaxed mb-6">
              {welcomeBackMessage}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowWelcomeBack(false);
                  setCaringToast({
                    type: 'success',
                    text: `We are absolutely thrilled to hear you've fully recovered! Keep staying healthy & mindful! 🌿`
                  });
                  setTimeout(() => setCaringToast(null), 5000);
                }}
                className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[14px] rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">sentiment_very_satisfied</span>
                <span>Yes, fully cured!</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowWelcomeBack(false);
                  setCaringToast({
                    type: 'warning',
                    text: `We're here for you. We suggest starting a new assessment or consulting nearby doctors.`
                  });
                  setTimeout(() => setCaringToast(null), 6000);
                }}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[14px] rounded-xl border border-slate-200 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">sentiment_dissatisfied</span>
                <span>No, still unwell</span>
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => setShowWelcomeBack(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* CARING CONGRATS TOAST BANNER */}
      {caringToast && (
        <div className="fixed top-24 right-8 bg-slate-900 text-white px-5 py-4 rounded-xl shadow-xl z-50 animate-bounce flex items-center gap-3 text-[14px] font-semibold border border-slate-700 max-w-sm">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${caringToast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <span className="material-symbols-outlined text-[20px] filled">
              {caringToast.type === 'success' ? 'favorite' : 'medical_services'}
            </span>
          </div>
          <span className="leading-relaxed">{caringToast.text}</span>
        </div>
      )}
    </div>
  );
}
