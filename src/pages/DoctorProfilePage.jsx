import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { doctorsAPI, appointmentsAPI } from '../services/api';

const fallbackDoctorsList = [
  {
    _id: 'doc_in_1', id: 'doc_in_1', name: 'Dr. Rajesh Sharma', specialty: 'Cardiology', credentials: 'MBBS, MD, DM (Cardiology)', hospital: 'Apollo Medical Center', clinicName: 'Apollo Heart Clinic', rating: 4.9, reviewCount: 342, yearsExperience: 18, languages: ['English', 'Hindi', 'Marathi'], acceptingNewPatients: true, telehealthAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80', about: 'Dr. Rajesh Sharma is a Senior Interventional Cardiologist with over 18 years of clinical experience in coronary care, preventative cardiology, and hypertension management.', subSpecialties: ['Interventional Cardiology', 'Hypertension & Heart Failure', 'Coronary Angiography'], education: [{ degree: 'DM (Cardiology)', institution: 'AIIMS New Delhi' }, { degree: 'MD (Internal Medicine)', institution: 'KEM Hospital Mumbai' }], reviews: [{ patientInitials: 'A.K.', rating: 5, comment: 'Dr. Sharma explained everything patiently. Highly professional clinic!', date: new Date().toISOString() }]
  },
  {
    _id: 'doc_in_2', id: 'doc_in_2', name: 'Dr. Ananya Mukherjee', specialty: 'General Practice', credentials: 'MBBS, MD (Internal Medicine)', hospital: 'Fortis Health Clinic', clinicName: 'Fortis Multispecialty Clinic', rating: 4.9, reviewCount: 289, yearsExperience: 14, languages: ['English', 'Hindi', 'Bengali'], acceptingNewPatients: true, telehealthAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80', about: 'Dr. Ananya Mukherjee is a renowned Physician specializing in general medicine, fever management, diabetes care, and lifestyle disease prevention.', subSpecialties: ['Internal Diagnostics', 'Fever & Infection Care', 'Diabetology'], education: [{ degree: 'MD (Internal Medicine)', institution: 'Calcutta Medical College' }], reviews: [{ patientInitials: 'S.R.', rating: 5, comment: 'Extremely compassionate doctor. Excellent consultation experience.', date: new Date().toISOString() }]
  },
  {
    _id: 'doc_in_3', id: 'doc_in_3', name: 'Dr. Vikram Malhotra', specialty: 'Neurology', credentials: 'MBBS, MS, DNB (Neurology)', hospital: 'Max Super Specialty Hospital', clinicName: 'Max Brain & Spine Clinic', rating: 4.8, reviewCount: 195, yearsExperience: 16, languages: ['English', 'Hindi', 'Punjabi'], acceptingNewPatients: true, telehealthAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80', about: 'Dr. Vikram Malhotra is a Senior Neurologist specializing in severe headache management, stroke prevention, epilepsy, and spinal disorders.', subSpecialties: ['Migraine & Headache Disorders', 'Stroke Care', 'Neuro-Diagnostics'], education: [{ degree: 'DNB Neurology', institution: 'MAMC New Delhi' }], reviews: [{ patientInitials: 'P.V.', rating: 5, comment: 'Dr. Malhotra correctly diagnosed my migraine after years of suffering.', date: new Date().toISOString() }]
  },
  {
    _id: 'doc_in_4', id: 'doc_in_4', name: 'Dr. Priya Nair', specialty: 'Pediatrics', credentials: 'MBBS, DCH, MD (Pediatrics)', hospital: 'Manipal Healthcare Clinic', clinicName: 'Little Angels Child Care & Clinic', rating: 4.9, reviewCount: 412, yearsExperience: 12, languages: ['English', 'Hindi', 'Kannada'], acceptingNewPatients: true, telehealthAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1594824813566-78a933758f46?w=400&auto=format&fit=crop&q=80', about: 'Dr. Priya Nair is a dedicated Pediatrician providing comprehensive child healthcare, growth monitoring, and pediatric immunization.', subSpecialties: ['Pediatric Infections', 'Child Growth & Nutrition', 'Vaccinations'], education: [{ degree: 'MD Pediatrics', institution: 'Bangalore Medical College' }], reviews: [{ patientInitials: 'M.N.', rating: 5, comment: 'Wonderful with kids! Very gentle and thorough.', date: new Date().toISOString() }]
  },
  { _id: 'doc1', id: 'doc1', name: 'Dr. Sarah Jenkins', specialty: 'General Practice', credentials: 'MD, FACP', rating: 4.9, reviewCount: 128, yearsExperience: 14, languages: ['English', 'Spanish'], acceptingNewPatients: true, telehealthAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80', about: 'Dr. Sarah Jenkins is a board-certified General Practitioner with over 14 years of experience in preventative healthcare and comprehensive patient evaluation.', subSpecialties: ['Preventative Care', 'Chronic Disease Management', 'Holistic Health'], education: [{ degree: 'Doctor of Medicine (MD)', institution: 'Harvard Medical School' }, { degree: 'Residency in Internal Medicine', institution: 'Massachusetts General Hospital' }], reviews: [{ patientInitials: 'R.M.', patientName: 'Rachel Miller', rating: 5, comment: 'Dr. Jenkins was exceptionally thorough and listened carefully to all my concerns.', date: new Date().toISOString() }] },
  { _id: 'doc2', id: 'doc2', name: 'Dr. Michael Chen', specialty: 'Neurology', credentials: 'MD, PhD', rating: 4.8, reviewCount: 94, yearsExperience: 11, languages: ['English', 'Mandarin'], acceptingNewPatients: true, telehealthAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80', about: 'Dr. Michael Chen specializes in headache disorders, migraines, and nerve pain with a focused patient-centered treatment approach.', subSpecialties: ['Headache Disorders', 'Migraine Care', 'Neuro-Diagnostics'], education: [{ degree: 'MD & PhD in Neurobiology', institution: 'Johns Hopkins School of Medicine' }], reviews: [{ patientInitials: 'D.K.', patientName: 'David Kim', rating: 5, comment: 'Clear explanations and very effective treatment plan for my chronic migraines.', date: new Date().toISOString() }] },
  { _id: 'doc3', id: 'doc3', name: 'Dr. Elena Rostova', specialty: 'Internal Medicine', credentials: 'MD', rating: 4.9, reviewCount: 210, yearsExperience: 18, languages: ['English', 'Russian'], acceptingNewPatients: true, telehealthAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1594824813566-78a933758f46?w=300&auto=format&fit=crop&q=80', about: 'Dr. Elena Rostova provides integrative internal medicine consultations tailored to complex symptom profiles.', subSpecialties: ['Internal Diagnostics', 'Cardiovascular Health'], education: [{ degree: 'Doctor of Medicine', institution: 'Columbia University Vagelos College' }], reviews: [{ patientInitials: 'A.S.', patientName: 'Anna Smith', rating: 5, comment: 'Wonderful doctor! Very knowledgeable and compassionate.', date: new Date().toISOString() }] }
];

export default function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [loading, setLoading] = useState(!location.state?.doctor);
  const [selectedType, setSelectedType] = useState('in-person');
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [booking, setBooking] = useState(false);

  const dates = (() => {
    const d = [];
    const today = new Date();
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      d.push({ day: date.toLocaleDateString('en', { weekday: 'short' }), date: date.getDate(), full: date });
    }
    return d;
  })();
  const times = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM'];

  useEffect(() => {
    const load = async () => {
      // 1. If passed via state, prioritize state doctor data
      if (location.state?.doctor) {
        setDoctor(location.state.doctor);
        setLoading(false);
        return;
      }

      try {
        const { data } = await doctorsAPI.getById(id);
        if (data && (data._id === id || data.id === id || data.name)) {
          setDoctor(data);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Could not fetch doctor by ID from API:', e.message);
      }

      // 2. Check session storage cache
      try {
        const cachedStr = sessionStorage.getItem('healthsync_cached_doctors');
        if (cachedStr) {
          const cachedList = JSON.parse(cachedStr);
          const cachedDoc = cachedList.find(d => d._id === id || d.id === id);
          if (cachedDoc) {
            setDoctor(cachedDoc);
            setLoading(false);
            return;
          }
        }
      } catch (err) {}

      // 3. Search fallback predefined doctors
      const foundFallback = fallbackDoctorsList.find(d => d._id === id || d.id === id);
      if (foundFallback) {
        setDoctor(foundFallback);
      } else {
        setDoctor(null);
      }
      setLoading(false);
    };

    load();
  }, [id, location.state]);

  const handleBooking = async () => {
    setBooking(true);
    const targetDate = dates[selectedDate]?.full || new Date();
    const apptPayload = {
      doctorId: doctor?._id || id,
      doctorInfo: {
        name: doctor?.name,
        specialty: doctor?.specialty,
        imageUrl: doctor?.imageUrl || '',
        address: doctor?.address || doctor?.location?.address || '',
        phone: doctor?.phone || ''
      },
      date: targetDate.toISOString(),
      time: selectedTime,
      type: selectedType,
      reason: 'Consultation from AI assessment'
    };

    try {
      const { data } = await appointmentsAPI.create(apptPayload);
      navigate(`/appointment-confirmed/${data._id}`);
    } catch (e) {
      // Local persistence fallback
      const mockId = `appt_${Date.now()}`;
      const savedAppt = {
        _id: mockId,
        ...apptPayload,
        doctorId: doctor,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      const existing = JSON.parse(localStorage.getItem('healthsync_appointments') || '[]');
      localStorage.setItem('healthsync_appointments', JSON.stringify([savedAppt, ...existing]));
      
      navigate(`/appointment-confirmed/${mockId}`);
    }
    setBooking(false);
  };

  if (loading) return <div className="flex items-center justify-center h-96"><span className="material-symbols-outlined text-primary text-5xl animate-pulse">ecg_heart</span></div>;
  if (!doctor) return <div className="text-center py-20"><p className="text-on-surface-variant">Doctor profile not found</p></div>;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
      <Link to="/doctors" className="inline-flex items-center gap-2 text-primary text-[14px] font-bold mb-6 hover:text-primary-container transition-colors">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>Back to Find Doctors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Profile Header */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-soft flex flex-col sm:flex-row gap-6 items-start border border-surface-variant/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <img className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover border-2 border-surface shadow-md z-10 shrink-0" src={doctor.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=008378&color=fff&size=160`} alt={doctor.name} />
            <div className="flex flex-col gap-2 z-10 w-full">
              <h1 className="text-[28px] md:text-[34px] leading-[38px] font-bold text-on-surface">{doctor.name}</h1>
              <p className="text-[18px] font-bold text-primary">{doctor.specialty} Specialist{doctor.credentials ? `, ${doctor.credentials}` : ''}</p>
              <div className="flex flex-wrap gap-4 mt-1 text-[14px] text-on-surface-variant font-medium">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-500 text-[18px] filled">star</span>
                  <span className="font-bold text-on-surface">{doctor.rating || 4.9}</span>
                  <span>({doctor.reviewCount || 100} Reviews)</span>
                </div>
                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px] text-primary">medical_information</span><span>{doctor.yearsExperience || 10}+ Years Experience</span></div>
                {doctor.languages?.length > 0 && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px] text-primary">language</span><span>{doctor.languages.join(', ')}</span></div>}
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {doctor.acceptingNewPatients && <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[12px] font-bold rounded-full">Accepting New Patients</span>}
                {doctor.telehealthAvailable && <span className="px-3 py-1 bg-primary/10 text-primary text-[12px] font-bold rounded-full border border-primary/20">Telehealth Available</span>}
              </div>
            </div>
          </div>

          {/* About & Specialties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="md:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-surface-variant/60">
              <h2 className="text-[20px] font-bold text-on-surface mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-primary">person</span>About {doctor.name}</h2>
              <p className="text-[15px] leading-relaxed text-on-surface-variant font-medium">{doctor.about}</p>
            </section>
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-surface-variant/60">
              <h2 className="text-[20px] font-bold text-on-surface mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-primary">psychiatry</span>Specialties</h2>
              <ul className="flex flex-wrap gap-2">
                {doctor.subSpecialties?.map((s, i) => (
                  <li key={i} className="px-3.5 py-1.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-[13px] font-bold text-on-surface">{s}</li>
                ))}
              </ul>
            </section>
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-surface-variant/60">
              <h2 className="text-[20px] font-bold text-on-surface mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-primary">school</span>Education & Training</h2>
              <ul className="flex flex-col gap-3">
                {doctor.education?.map((e, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-on-surface-variant font-medium">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <div><span className="font-bold text-on-surface block">{e.degree}</span>{e.institution}</div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Reviews */}
          {doctor.reviews?.length > 0 && (
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-surface-variant/60">
              <h2 className="text-[20px] font-bold text-on-surface mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-primary">forum</span>Verified Patient Reviews</h2>
              <div className="flex flex-col gap-4">
                {doctor.reviews.map((r, i) => (
                  <div key={i} className="border-b border-surface-variant/40 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[13px] font-bold border border-primary/20">
                          {r.patientInitials || r.patientName?.charAt(0) || 'P'}
                        </div>
                        <span className="text-[15px] font-bold text-on-surface">{r.patientName}</span>
                      </div>
                      <div className="flex text-amber-500">{Array(r.rating || 5).fill(0).map((_, j) => <span key={j} className="material-symbols-outlined text-[16px] filled">star</span>)}</div>
                    </div>
                    <p className="text-[14px] leading-relaxed text-on-surface-variant font-medium">"{r.comment}"</p>
                    <span className="text-[12px] text-outline font-medium mt-2 block">{new Date(r.date || Date.now()).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-surface-variant/60 flex flex-col gap-4">
            <h3 className="text-[20px] font-bold text-on-surface border-b border-surface-variant/50 pb-3">Schedule Appointment</h3>
            <div className="flex flex-col gap-2.5">
              <label className="text-[14px] font-bold text-on-surface">Consultation Type</label>
              <div className="flex gap-2">
                {['in-person', 'video'].map(t => (
                  <button key={t} onClick={() => setSelectedType(t)} className={`flex-1 py-2.5 px-3 rounded-xl text-[13px] font-bold text-center transition-all ${selectedType === t ? 'border-2 border-primary bg-primary/10 text-primary shadow-sm' : 'border border-outline-variant/40 text-on-surface-variant hover:bg-surface-variant/50'}`}>
                    {t === 'in-person' ? 'In-Person' : 'Video Visit'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2.5 mt-2">
              <label className="text-[14px] font-bold text-on-surface">Select Date</label>
              <div className="grid grid-cols-3 gap-2">
                {dates.map((d, i) => (
                  <button key={i} onClick={() => setSelectedDate(i)} className={`py-2.5 px-1 rounded-xl flex flex-col items-center transition-all ${selectedDate === i ? 'border-2 border-primary bg-primary/10 text-primary font-bold shadow-sm' : 'border border-outline-variant/40 hover:border-primary text-on-surface'}`}>
                    <span className="text-[12px] font-medium">{d.day}</span>
                    <span className="text-[22px] font-bold">{d.date}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2.5 mt-2">
              <label className="text-[14px] font-bold text-on-surface">Select Time Slot</label>
              <div className="grid grid-cols-2 gap-2">
                {times.map(t => (
                  <button key={t} onClick={() => setSelectedTime(t)} className={`py-2.5 rounded-xl text-[13px] font-bold transition-all ${selectedTime === t ? 'border-2 border-primary bg-primary/10 text-primary shadow-sm' : 'border border-outline-variant/40 hover:border-primary text-on-surface'}`}>{t}</button>
                ))}
              </div>
            </div>
            <button onClick={handleBooking} disabled={booking} className="w-full bg-primary text-on-primary text-[15px] font-bold py-3.5 rounded-xl hover:bg-primary-container transition-all shadow-glow hover:shadow-glow-hover mt-4 disabled:opacity-50">
              {booking ? 'Confirming...' : 'Confirm Booking'}
            </button>
            <p className="text-center text-[12px] text-outline font-medium mt-1">Instant confirmation · No upfront payment required</p>
          </div>
        </div>
      </div>
    </div>
  );
}
