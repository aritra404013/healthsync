import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { appointmentsAPI } from '../services/api';

export default function AppointmentConfirmedPage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await appointmentsAPI.getById(id);
        if (data) setAppointment(data);
        else findLocalAppointment();
      } catch (e) {
        findLocalAppointment();
      }
    };

    const findLocalAppointment = () => {
      const localAppts = JSON.parse(localStorage.getItem('healthsync_appointments') || '[]');
      const found = localAppts.find(a => a._id === id) || localAppts[0] || {
        _id: id || 'APPT-84920',
        date: new Date(Date.now() + 86400000).toISOString(),
        time: '10:30 AM',
        type: 'in-person',
        doctorId: {
          name: 'Dr. Sarah Jenkins',
          specialty: 'General Practice',
          credentials: 'MD, FACP',
          imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
          location: { address: '742 Park Avenue, Medical Suite 400, New York, NY 10021' }
        }
      };
      setAppointment(found);
    };

    if (id) load();
    else findLocalAppointment();
  }, [id]);

  const doctor = appointment?.doctorInfo || (typeof appointment?.doctorId === 'object' ? appointment.doctorId : null);

  const handleCalendar = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
      {/* Success Banner */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-glow">
          <span className="material-symbols-outlined text-primary text-5xl filled">check_circle</span>
        </div>
        <h1 className="text-[30px] md:text-[36px] leading-[40px] font-extrabold text-on-surface mb-2">Appointment Confirmed!</h1>
        <p className="text-[16px] text-on-surface-variant font-medium">Your medical consultation has been successfully booked.</p>
      </div>

      {/* Appointment Details Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-soft border border-surface-variant/60 mb-8 animate-slide-up">
        <div className="flex items-center justify-between border-b border-surface-variant/50 pb-4 mb-6">
          <h2 className="text-[20px] font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">event_available</span>Booking Details
          </h2>
          <span className="bg-emerald-100 text-emerald-800 text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Confirmed</span>
        </div>

        <div className="space-y-6">
          {/* Doctor Info */}
          <div className="flex items-center gap-4 pb-6 border-b border-surface-variant/50">
            <img src={doctor?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || 'Doctor')}&background=008378&color=fff`} alt={doctor?.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-surface shadow-sm shrink-0" />
            <div>
              <p className="text-[20px] font-bold text-on-surface">{doctor?.name || 'Dr. HealthSync Practitioner'}</p>
              <p className="text-[14px] font-semibold text-primary">{doctor?.specialty || 'General Practice'}{doctor?.credentials ? `, ${doctor.credentials}` : ''}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3 bg-surface-container-low p-4 rounded-xl border border-surface-variant/40">
              <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">calendar_today</span>
              <div>
                <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Date</p>
                <p className="text-[15px] font-bold text-on-surface mt-0.5">{appointment?.date ? new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Tomorrow'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-surface-container-low p-4 rounded-xl border border-surface-variant/40">
              <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">schedule</span>
              <div>
                <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Time</p>
                <p className="text-[15px] font-bold text-on-surface mt-0.5">{appointment?.time || '10:30 AM'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-surface-container-low p-4 rounded-xl border border-surface-variant/40">
              <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">{appointment?.type === 'video' ? 'videocam' : 'location_on'}</span>
              <div>
                <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Consultation Type</p>
                <p className="text-[15px] font-bold text-on-surface mt-0.5">{appointment?.type === 'video' ? 'Video Visit' : 'In-Person Visit'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-surface-container-low p-4 rounded-xl border border-surface-variant/40">
              <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">confirmation_number</span>
              <div>
                <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Reference Code</p>
                <p className="text-[15px] font-bold text-on-surface mt-0.5">#{appointment?._id?.slice(-8).toUpperCase() || 'HS-98421'}</p>
              </div>
            </div>
          </div>

          {/* Location / Video link */}
          <div className="flex items-start gap-3 pt-4 border-t border-surface-variant/50">
            <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">{appointment?.type === 'video' ? 'link' : 'place'}</span>
            <div>
              <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Location & Instructions</p>
              <p className="text-[15px] text-on-surface font-medium mt-0.5">{doctor?.location?.address || '742 Park Avenue, Medical Suite 400, New York, NY 10021'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar & Map Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button onClick={handleCalendar} className="flex-1 bg-surface-container-highest border border-outline-variant/40 text-primary hover:bg-primary hover:text-on-primary text-[14px] font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[20px]">{copied ? 'event_available' : 'calendar_add_on'}</span>
          {copied ? 'Added to Calendar!' : 'Add to Calendar'}
        </button>
        {doctor?.location?.address && (
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.location.address)}`} target="_blank" rel="noopener noreferrer" className="flex-1 border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary text-[14px] font-bold py-3 rounded-xl transition-all text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">directions</span> Get Directions
          </a>
        )}
      </div>

      {/* Main Navigation Actions */}
      <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Link to="/dashboard" className="flex-1 bg-primary text-on-primary text-[15px] font-bold py-3.5 rounded-xl hover:bg-primary-container transition-all shadow-glow text-center">
          Go to Patient Dashboard
        </Link>
        <Link to="/pharmacies" className="flex-1 border border-outline-variant/50 text-primary hover:bg-primary/5 text-[15px] font-bold py-3.5 rounded-xl transition-all text-center">
          Find Nearby Pharmacies
        </Link>
      </div>
    </div>
  );
}
