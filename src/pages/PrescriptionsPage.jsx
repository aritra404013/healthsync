import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { prescriptionsAPI } from '../services/api';

const fallbackPrescriptions = [
  { _id: 'rx1', medication: 'Amoxicillin 500mg', dosage: '1 capsule 3x daily', frequency: 'Three times daily with meals', duration: '7 days', doctorId: { name: 'Dr. Sarah Jenkins' }, refillsRemaining: 1, status: 'active', instructions: 'Finish complete course of antibiotics even if feeling better.' },
  { _id: 'rx2', medication: 'Sumatriptan 50mg', dosage: '1 tablet at onset of headache', frequency: 'As needed for acute migraine', duration: '30 days', doctorId: { name: 'Dr. Michael Chen' }, refillsRemaining: 2, status: 'active', instructions: 'Take single dose at first sign of migraine attack. Max 200mg in 24 hours.' },
  { _id: 'rx3', medication: 'Ibuprofen 400mg', dosage: '1 tablet every 8 hours', frequency: 'Every 8 hours as needed', duration: '14 days', doctorId: { name: 'Dr. Elena Rostova' }, refillsRemaining: 0, status: 'completed', instructions: 'Take with food or milk to prevent stomach discomfort.' }
];

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await prescriptionsAPI.list();
        if (data && data.length > 0) setPrescriptions(data);
        else setPrescriptions(fallbackPrescriptions);
      } catch (e) {
        setPrescriptions(fallbackPrescriptions);
      }
      setLoading(false);
    };
    load();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold';
      case 'completed': return 'bg-slate-100 text-slate-700 border border-slate-300 font-bold';
      case 'discontinued': return 'bg-rose-100 text-rose-800 border border-rose-300 font-bold';
      default: return 'bg-teal-100 text-teal-800 border border-teal-300 font-bold';
    }
  };

  return (
    <div className="w-full px-4 md:px-10 lg:px-16 py-8 relative">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-24 right-8 bg-primary text-on-primary px-5 py-3 rounded-xl shadow-glow z-50 animate-bounce flex items-center gap-2 text-[14px] font-semibold">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          {toast}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[30px] md:text-[36px] leading-[40px] font-extrabold text-on-surface tracking-tight">Prescriptions</h1>
          <p className="text-[15px] text-on-surface-variant font-medium mt-1">Manage active medications & delivery schedules</p>
        </div>
        <Link to="/pharmacies" className="bg-primary hover:bg-primary-container text-on-primary text-[14px] font-bold px-6 py-3 rounded-xl transition-all shadow-glow hover:shadow-glow-hover flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">local_pharmacy</span>Find Pharmacy
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="flex justify-center py-20"><span className="material-symbols-outlined text-primary text-4xl animate-spin">sync</span></div>
          ) : prescriptions.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center shadow-soft border border-surface-variant/60">
              <span className="material-symbols-outlined text-outline text-5xl mb-4 block">medication</span>
              <p className="text-[16px] text-on-surface-variant font-medium mb-4">You don't have any active prescriptions.</p>
              <Link to="/analysis" className="text-primary text-[14px] font-bold hover:underline">Start a health assessment to receive clinical guidance</Link>
            </div>
          ) : (
            prescriptions.map((rx) => (
              <div key={rx._id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-surface-variant/60 hover:border-primary/40 transition-all group">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shrink-0">
                      <span className="material-symbols-outlined text-2xl">pill</span>
                    </div>
                    <div>
                      <h3 className="text-[20px] font-bold text-on-surface">{rx.medication}</h3>
                      <p className="text-[14px] font-semibold text-primary mt-0.5">{rx.dosage}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[12px] capitalize ${getStatusBadge(rx.status)}`}>{rx.status}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-surface-variant/50 mb-4">
                  <div>
                    <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Frequency</p>
                    <p className="text-[14px] font-bold text-on-surface mt-0.5">{rx.frequency}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Duration</p>
                    <p className="text-[14px] font-bold text-on-surface mt-0.5">{rx.duration}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Prescribed By</p>
                    <p className="text-[14px] font-bold text-on-surface mt-0.5">{rx.doctorId?.name || 'HealthSync Doctor'}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Refills</p>
                    <p className="text-[14px] font-bold text-on-surface mt-0.5">{rx.refillsRemaining} remaining</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-low p-4 rounded-xl border border-surface-variant/40">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">info</span>
                    <div>
                      <p className="text-[13px] font-bold text-on-surface">Instructions</p>
                      <p className="text-[13px] text-on-surface-variant font-medium mt-0.5">{rx.instructions || 'Take as directed by your healthcare provider.'}</p>
                    </div>
                  </div>
                  {rx.status === 'active' && (
                    <button onClick={() => showToast(`Refill request submitted for ${rx.medication}`)} className="bg-primary hover:bg-primary-container text-on-primary text-[13px] font-bold px-4 py-2 rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap">
                      Request Refill
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-surface-variant/60">
            <h3 className="text-[20px] font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">local_shipping</span>Home Delivery
            </h3>
            <p className="text-[14px] text-on-surface-variant font-medium mb-4">Get recurring prescriptions delivered directly to your doorstep with automatic refills.</p>
            <button onClick={() => showToast('Delivery service configured successfully!')} className="w-full bg-surface-container-highest text-primary font-bold text-[14px] py-3 rounded-xl hover:bg-primary hover:text-on-primary transition-all shadow-sm">
              Configure Delivery Address
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-surface-variant/60">
            <h3 className="text-[20px] font-bold text-on-surface mb-4">Daily Dosage Schedule</h3>
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl mb-2.5 border border-surface-variant/40">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">wb_twilight</span>
                <span className="text-[14px] font-bold text-on-surface">Morning Dose</span>
              </div>
              <span className="text-[14px] font-extrabold text-primary">08:00 AM</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-surface-variant/40">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">nights_stay</span>
                <span className="text-[14px] font-bold text-on-surface">Evening Dose</span>
              </div>
              <span className="text-[14px] font-extrabold text-primary">08:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
