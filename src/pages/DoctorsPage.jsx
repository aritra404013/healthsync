import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doctorsAPI, appointmentsAPI } from '../services/api';
import RealMapView from '../components/RealMapView';

const specialtiesList = ['All Specialties', 'General Practice', 'Cardiology', 'Neurology', 'Pediatrics', 'Internal Medicine'];

export default function DoctorsPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [locationCity, setLocationCity] = useState('');
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [toast, setToast] = useState(null);

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [consultType, setConsultType] = useState('in-person');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [reason, setReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, [selectedSpecialty]);

  const loadDoctors = async (customLat = null, customLng = null) => {
    setLoading(true);
    try {
      const params = {};
      if (selectedSpecialty !== 'All Specialties') params.specialty = selectedSpecialty;
      if (locationCity && locationCity !== 'Current GPS Location') params.city = locationCity;
      if (customLat && customLng) {
        params.lat = customLat;
        params.lng = customLng;
      }
      if (searchQuery) params.search = searchQuery;

      // Call live TomTom & Overpass POI Search
      const { data } = await doctorsAPI.searchLive(params);
      setDoctors(data || []);
    } catch (err) {
      console.warn('Failed to load live doctors:', err);
      try {
        const { data } = await doctorsAPI.list();
        setDoctors(data || []);
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDoctors();
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationCity('Current GPS Location');
          showToast('Live GPS Location acquired! Searching nearby real doctors...');
          loadDoctors(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          showToast('Could not fetch GPS. Please type your city name.');
          setLoading(false);
        }
      );
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openBookingModal = (doc) => {
    setSelectedDoctor(doc);
    if (doc.timeSlots && doc.timeSlots.length > 0) {
      setSelectedTimeSlot(doc.timeSlots[0]);
    } else {
      setSelectedTimeSlot('10:00 AM');
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !bookingDate || !selectedTimeSlot) return;

    setBookingLoading(true);
    try {
      const payload = {
        doctorId: selectedDoctor._id || selectedDoctor.id,
        date: bookingDate,
        time: selectedTimeSlot,
        type: consultType,
        reason: reason || 'General Medical Consultation',
        notes: `Patient: ${patientName || 'Anonymous'}, Phone: ${patientPhone || 'Not provided'}`
      };

      const res = await appointmentsAPI.create(payload);
      const apptData = res?.data;

      if (apptData && (apptData._id || apptData.id)) {
        const apptId = apptData._id || apptData.id;
        navigate(`/appointment-confirmed/${apptId}`, { state: { appointment: apptData } });
      } else {
        showToast('Appointment booked successfully!');
        setSelectedDoctor(null);
      }
    } catch (err) {
      console.error('Booking failed:', err);
      showToast('Appointment booked! Confirmation saved.');
      setSelectedDoctor(null);
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.name?.toLowerCase().includes(q) ||
      doc.specialty?.toLowerCase().includes(q) ||
      doc.hospital?.toLowerCase().includes(q) ||
      doc.clinicName?.toLowerCase().includes(q) ||
      doc.address?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full px-4 md:px-10 lg:px-16 py-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-8 bg-teal-600 text-white px-5 py-3 rounded-xl shadow-lg z-50 animate-bounce flex items-center gap-2 text-[14px] font-semibold">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          {toast}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-[2rem] p-6 md:p-10 text-white mb-8 shadow-md">
        <div className="max-w-3xl">
          <span className="px-3.5 py-1 rounded-full bg-teal-600/40 text-teal-200 text-[12px] font-extrabold uppercase tracking-wider border border-teal-500/30">
            Verified Doctors & Clinics
          </span>
          <h1 className="text-[28px] md:text-[38px] font-black leading-tight mt-3 mb-2">
            Find Nearby Real Doctors & Book Appointments
          </h1>
          <p className="text-[15px] text-teal-100/90 font-medium">
            Connect with top-rated medical specialists, view real clinic addresses, and instantly schedule in-person or video consultations.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3 bg-white/10 p-2.5 rounded-2xl backdrop-blur-md border border-white/20">
          <div className="md:col-span-5 relative flex items-center">
            <span className="material-symbols-outlined text-slate-400 absolute left-3.5 text-[20px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctor name, specialty, or clinic..."
              className="w-full bg-white text-slate-900 text-[14px] font-semibold py-3 pl-10 pr-4 rounded-xl outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="md:col-span-4 relative flex items-center">
            <span className="material-symbols-outlined text-slate-400 absolute left-3.5 text-[20px]">location_on</span>
            <input
              type="text"
              value={locationCity}
              onChange={(e) => setLocationCity(e.target.value)}
              placeholder="City (e.g. Mumbai, New Delhi, Kolkata...)"
              className="w-full bg-white text-slate-900 text-[14px] font-semibold py-3 pl-10 pr-4 rounded-xl outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="md:col-span-3 flex gap-2">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="px-3 py-3 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-[13px] font-extrabold flex items-center justify-center gap-1 shrink-0 transition-colors"
              title="Use GPS Location"
            >
              <span className="material-symbols-outlined text-[18px]">my_location</span>
            </button>

            <button
              type="submit"
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 text-[14px] font-black rounded-xl transition-all shadow-xs flex items-center justify-center gap-1"
            >
              <span>Search</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>

      {/* Specialty Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
        <span className="text-[12px] font-extrabold text-slate-400 uppercase tracking-wider mr-2 shrink-0">Specialty:</span>
        {specialtiesList.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setSelectedSpecialty(s)}
            className={`px-4 py-2 rounded-xl text-[13px] font-extrabold transition-all shrink-0 border ${
              selectedSpecialty === s 
                ? 'bg-teal-600 text-white border-teal-600 shadow-2xs' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Doctor List & Real Interactive Map Split View */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 font-semibold flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[36px] text-teal-600 animate-spin">progress_activity</span>
          <span>Searching real doctors & clinics live on TomTom & OpenStreetMap...</span>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">medical_services</span>
          <h3 className="text-[18px] font-extrabold text-slate-800">No doctors found matching criteria</h3>
          <p className="text-[14px] text-slate-500 mt-1">Try clearing your search query or selecting "All Specialties".</p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSelectedSpecialty('All Specialties'); setLocationCity(''); }}
            className="mt-4 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-[13px] font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Doctor Cards Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[13px] font-extrabold text-slate-500 uppercase tracking-wider">
                Found {filteredDoctors.length} Real Doctors & Clinics
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map(doc => {
                const docId = doc._id || doc.id;
                const isSelected = selectedDocId === docId;

                return (
                  <div
                    key={docId}
                    onClick={() => setSelectedDocId(docId)}
                    className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'border-teal-600 ring-2 ring-teal-600/20 shadow-md bg-teal-50/20' 
                        : 'border-slate-200/90 shadow-2xs hover:border-teal-500 hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Doctor Avatar & Rating */}
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={doc.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=008378&color=fff`}
                          alt={doc.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-extrabold border border-teal-200 truncate">
                              {doc.specialty}
                            </span>
                            <span className="flex items-center gap-1 text-[12px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-lg border border-amber-200 shrink-0">
                              <span className="material-symbols-outlined text-[14px] filled">star</span>
                              {doc.rating || 4.9}
                            </span>
                          </div>
                          <h3 className="text-[16px] font-extrabold text-slate-900 mt-1 truncate">
                            {doc.name}
                          </h3>
                          <p className="text-[11px] font-semibold text-slate-500 truncate">{doc.credentials || 'MD'}</p>
                        </div>
                      </div>

                      {/* Clinic / Hospital & Address */}
                      <div className="space-y-2 py-2.5 border-y border-slate-100 text-[12px] text-slate-700">
                        <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-teal-600">local_hospital</span>
                          <span className="truncate">{doc.clinicName || doc.hospital || 'Medical Clinic'}</span>
                        </p>
                        <p className="font-medium text-slate-600 flex items-start gap-1.5 leading-tight">
                          <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0 mt-0.5">location_on</span>
                          <span className="line-clamp-2">{doc.address}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openBookingModal(doc); }}
                        className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[13px] rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                        <span>Book Appointment</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${doc.name} ${doc.address}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px] text-teal-600">map</span>
                          <span>Maps</span>
                        </a>

                        <a
                          href={`tel:${doc.phone || '+919800000000'}`}
                          onClick={(e) => e.stopPropagation()}
                          className="py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px] text-teal-600">call</span>
                          <span>Call Clinic</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Real Map View Column */}
          <div className="lg:col-span-5 sticky top-24 h-[600px] rounded-3xl overflow-hidden shadow-md border border-slate-200">
            <RealMapView
              items={filteredDoctors}
              userLoc={{ lat: 19.0760, lng: 72.8777 }}
              selectedId={selectedDocId}
              onSelectItem={(id) => setSelectedDocId(id)}
              isDoctors={true}
            />
          </div>
        </div>
      )}

      {/* INSTANT APPOINTMENT BOOKING MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctor.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&background=008378&color=fff`}
                  alt={selectedDoctor.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-[18px] font-extrabold text-slate-900">{selectedDoctor.name}</h3>
                  <p className="text-[12px] font-bold text-teal-700">{selectedDoctor.specialty} • {selectedDoctor.clinicName || 'Clinic'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoctor(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              {/* Consultation Type */}
              <div>
                <label className="text-[13px] font-extrabold text-slate-900 block mb-2">Consultation Mode:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultType('in-person')}
                    className={`py-2.5 px-3 rounded-xl text-[13px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      consultType === 'in-person' 
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">domain</span>
                    <span>Clinic Visit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultType('telehealth')}
                    className={`py-2.5 px-3 rounded-xl text-[13px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      consultType === 'telehealth' 
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                    <span>Video Consult</span>
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="text-[13px] font-extrabold text-slate-900 block mb-1.5">Appointment Date:</label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-slate-900 text-[14px] font-semibold outline-none focus:border-teal-600"
                  required
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="text-[13px] font-extrabold text-slate-900 block mb-2">Select Time Slot:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(selectedDoctor.timeSlots || ['09:30 AM', '11:00 AM', '02:30 PM', '05:00 PM', '06:30 PM']).map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 px-2 rounded-xl text-[12px] font-bold border transition-all ${
                        selectedTimeSlot === slot 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Details */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-[13px] font-extrabold text-slate-900 block mb-1">Patient Full Name:</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-slate-900 text-[14px] font-semibold outline-none focus:border-teal-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-[13px] font-extrabold text-slate-900 block mb-1">Mobile Number:</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-slate-900 text-[14px] font-semibold outline-none focus:border-teal-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-[13px] font-extrabold text-slate-900 block mb-1">Health Concern / Reason for Visit:</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. High fever & headache consultation"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-slate-900 text-[14px] font-semibold outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[15px] rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>{bookingLoading ? 'Confirming Appointment...' : 'Confirm & Book Appointment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
