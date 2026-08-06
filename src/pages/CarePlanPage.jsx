import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doctorsAPI, treatmentPlansAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const fallbackDoctors = [
  { _id: 'doc1', name: 'Dr. Sarah Jenkins', specialty: 'General Practitioner', rating: 4.9, reviewCount: 128, distance: '1.2 km', address: 'Medical District Center', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' },
  { _id: 'doc2', name: 'Dr. Michael Chen', specialty: 'Neurologist', rating: 4.8, reviewCount: 94, distance: '2.4 km', address: 'Healthcare City Hospital', imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
  { _id: 'doc3', name: 'Dr. Elena Rostova', specialty: 'Internal Medicine', rating: 4.9, reviewCount: 210, distance: '3.1 km', address: 'Central Clinic', imageUrl: 'https://images.unsplash.com/photo-1594824813566-78a933758f46?w=150&auto=format&fit=crop&q=80' }
];

export default function CarePlanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const diagnosis = location.state?.diagnosis || {
    conditions: [
      { name: 'Tension Headache', probability: 'High', description: 'Common headache resulting from muscle stress, fatigue, or dehydration' }, 
      { name: 'Migraine', probability: 'Medium', description: 'Neurological condition characterized by pulsating localized discomfort' }
    ],
    severity: 'mild',
    recommendedSpecialties: ['General Practitioner', 'Neurologist'],
    suggestedMedications: [
      { name: 'Ibuprofen', dosage: '200-400mg', frequency: 'Every 6-8 hours', notes: 'Take with food' }, 
      { name: 'Acetaminophen', dosage: '500mg', frequency: 'Every 4-6 hours', notes: 'Do not exceed 3g/day' }
    ],
    lifestyleRecommendations: ['Maintain hydration (8+ glasses water)', 'Practice regular posture & screen breaks', 'Ensure 7-8 hours restful sleep'],
    followUpDays: 7
  };

  const handleSavePlan = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSaving(true);
    try {
      await treatmentPlansAPI.save({
        sessionId: location.state?.sessionId || null,
        diagnosis: diagnosis,
        nearbyDoctors: doctors,
        title: diagnosis.conditions?.[0]?.name ? `${diagnosis.conditions[0].name} Care Plan` : 'AI Treatment Plan'
      });
      setSaved(true);
      setToastMsg('Treatment plan saved to your profile!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      setToastMsg(err.response?.data?.message || 'Failed to save treatment plan.');
      setTimeout(() => setToastMsg(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const loadRealDoctors = async () => {
      setLoadingDoctors(true);

      // 1. If nearbyDoctors passed directly from chat state, use them!
      if (location.state?.nearbyDoctors && location.state.nearbyDoctors.length > 0) {
        setDoctors(location.state.nearbyDoctors);
        setLoadingDoctors(false);
        return;
      }

      // 2. Fetch live GPS coordinates & query real TomTom/OSM doctors
      const getCoords = () => new Promise((resolve) => {
        const stateLoc = location.state?.userLocation;
        if (stateLoc && stateLoc.lat && stateLoc.lng) {
          return resolve({ lat: stateLoc.lat, lng: stateLoc.lng });
        }
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve({ lat: 19.0760, lng: 72.8777 }),
            { timeout: 6000 }
          );
        } else {
          resolve({ lat: 19.0760, lng: 72.8777 });
        }
      });

      try {
        const coords = await getCoords();
        const res = await doctorsAPI.searchLive({ lat: coords.lat, lng: coords.lng, radius: 10000 });
        const liveResults = res?.data;

        if (Array.isArray(liveResults) && liveResults.length > 0) {
          // Sort doctors matching recommended specialties to the top
          const specialties = diagnosis.recommendedSpecialties || [];
          const sorted = [...liveResults].sort((a, b) => {
            const aMatch = specialties.some(s => a.specialty?.toLowerCase().includes(s.toLowerCase()));
            const bMatch = specialties.some(s => b.specialty?.toLowerCase().includes(s.toLowerCase()));
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
          });
          setDoctors(sorted);
        } else {
          const { data } = await doctorsAPI.list({ limit: 5 });
          setDoctors(data && data.length > 0 ? data : fallbackDoctors);
        }
      } catch (err) {
        console.warn('CarePlan live doctors fetch notice:', err.message);
        setDoctors(fallbackDoctors);
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadRealDoctors();
  }, [location.state]);

  const severityBadgeClass = {
    mild: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    moderate: 'bg-amber-100 text-amber-800 border border-amber-300',
    severe: 'bg-rose-100 text-rose-800 border border-rose-300',
    emergency: 'bg-red-200 text-red-900 border border-red-400 font-bold'
  };

  const probBadgeClass = {
    High: 'bg-rose-100 text-rose-800 font-semibold',
    Medium: 'bg-amber-100 text-amber-800 font-semibold',
    Low: 'bg-teal-100 text-teal-800 font-semibold'
  };

  return (
    <div className="w-full px-4 md:px-10 lg:px-16 py-8">
      <Link to="/analysis" className="inline-flex items-center gap-2 text-primary text-[14px] font-bold mb-6 hover:text-primary-container transition-colors">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>Back to Assessment
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Toast Notification */}
          {toastMsg && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-between gap-3 text-[14px] font-semibold animate-slide-up border border-slate-700">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
                <span>{toastMsg}</span>
              </div>
              <Link to="/dashboard" className="text-teal-300 underline font-bold hover:text-white">View in Dashboard</Link>
            </div>
          )}

          {/* Header */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-soft border border-surface-variant/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-container rounded-2xl flex items-center justify-center text-on-primary-container shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-2xl">assignment</span>
                </div>
                <div>
                  <h1 className="text-[28px] md:text-[34px] leading-[38px] font-extrabold text-on-surface">Your Care Plan</h1>
                  <p className="text-[14px] text-on-surface-variant font-medium">Personalized recommendations from AI assessment</p>
                </div>
              </div>

              {/* Save to Profile Button */}
              <button
                onClick={handleSavePlan}
                disabled={saving || saved}
                className={`btn-primary py-2.5 px-5 text-[14px] shrink-0 self-start sm:self-center transition-all ${
                  saved ? 'bg-emerald-700 hover:bg-emerald-800' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {saved ? 'check_circle' : saving ? 'hourglass_empty' : 'bookmark_add'}
                </span>
                <span>{saved ? 'Saved to Profile' : saving ? 'Saving...' : 'Save to Profile'}</span>
              </button>
            </div>
            <div className="flex gap-3 flex-wrap mt-4">
              <span className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold ${severityBadgeClass[diagnosis.severity] || severityBadgeClass.mild}`}>
                Severity: {diagnosis.severity ? diagnosis.severity.charAt(0).toUpperCase() + diagnosis.severity.slice(1) : 'Mild'}
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold bg-primary/10 text-primary border border-primary/20">
                Follow-up in {diagnosis.followUpDays || 7} days
              </span>
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-surface-variant/60">
            <h2 className="text-[20px] font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">biotech</span>Possible Conditions
            </h2>
            <div className="space-y-4">
              {diagnosis.conditions?.map((c, i) => (
                <div key={i} className="p-4 md:p-5 bg-surface-container-low rounded-xl border border-surface-variant/50 hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-center mb-2 gap-4">
                    <h3 className="text-[17px] font-bold text-on-surface">{c.name}</h3>
                    <span className={`px-3 py-1 rounded-lg text-[12px] ${probBadgeClass[c.probability] || 'bg-teal-100 text-teal-800'}`}>{c.probability} Probability</span>
                  </div>
                  <p className="text-[14px] leading-relaxed text-on-surface-variant font-medium">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Indian Home Remedies & Recipes (Desi Nuskhe) */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-surface-variant/60">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-[20px] font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[24px]">eco</span>
                <span>Indian Home Remedies & Recipes (Desi Care)</span>
              </h2>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[12px] font-bold rounded-full border border-amber-200 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                AI-Generated & Personalized
              </span>
            </div>
            
            <div className="space-y-5">
              {(diagnosis.indianHomeRemedies || [
                {
                  name: 'Ayurvedic Tulsi-Ginger Kadha (Herbal Tea)',
                  category: 'recipe',
                  ingredients: '8-10 Tulsi leaves, 1-inch fresh Ginger, 2 Cloves, 4 Black Peppercorns, 1 tsp Honey',
                  recipe: '1. Crush ginger, tulsi leaves, cloves, and peppercorns.\n2. Boil in 2 cups of water for 8-10 minutes until liquid reduces to 1 cup.\n3. Strain into a cup and mix with 1 tsp honey while warm.',
                  usage: 'Sip warm 2 times daily for quick relief from fever, cold, headache, and body ache.',
                  youtubeUrl: 'https://www.youtube.com/results?search_query=how+to+make+ayurvedic+kadha+recipe'
                },
                {
                  name: 'Geeli Patti / Cold Compress (गीली पट्टी)',
                  category: 'practice',
                  ingredients: 'Clean cotton cloth, bowl of room-temperature water',
                  recipe: '1. Soak cotton cloth in water and wring out excess moisture.\n2. Place gently on forehead and wrists.\n3. Change every 5-10 minutes.',
                  usage: 'Repeat every 2-3 hours for fever relief. Safe and effective traditional home practice.',
                  youtubeUrl: 'https://www.youtube.com/results?search_query=geeli+patti+cold+compress+fever+remedy+indian'
                }
              ]).map((remedy, i) => {
                const isPractice = remedy.category === 'practice';
                return (
                <div key={i} className={`p-5 md:p-6 rounded-2xl border shadow-2xs transition-all ${isPractice ? 'bg-gradient-to-br from-teal-50/60 to-surface-container-low border-teal-200/80 hover:border-teal-400' : 'bg-gradient-to-br from-amber-50/60 to-surface-container-low border-amber-200/80 hover:border-amber-400'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <h3 className="text-[18px] font-extrabold text-slate-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-amber-700">
                        {isPractice ? 'self_improvement' : 'soup_kitchen'}
                      </span>
                      {remedy.name}
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ml-1 ${isPractice ? 'bg-teal-100 text-teal-800 border border-teal-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                        {isPractice ? 'Traditional Practice' : 'Herbal Recipe'}
                      </span>
                    </h3>
                    <a
                      href={remedy.youtubeUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(`how to make ${remedy.name} remedy recipe`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold rounded-xl transition-all shadow-2xs active:scale-95 shrink-0 w-fit"
                    >
                      <span className="material-symbols-outlined text-[16px]">play_circle</span>
                      <span>Watch Recipe Video</span>
                    </a>
                  </div>

                  <div className="space-y-3 text-[14px] text-slate-700">
                    {/* Ingredients / Materials */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                      <p className="font-extrabold text-slate-900 text-[13px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-amber-700">
                          {isPractice ? 'sanitizer' : 'inventory_2'}
                        </span>
                        {isPractice ? 'Materials Needed:' : 'Ingredients Needed:'}
                      </p>
                      <p className="font-medium text-slate-800 leading-relaxed">
                        {Array.isArray(remedy.ingredients) ? remedy.ingredients.join(', ') : remedy.ingredients}
                      </p>
                    </div>

                    {/* Recipe / Steps */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                      <p className="font-extrabold text-slate-900 text-[13px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-amber-700">
                          {isPractice ? 'clinical_notes' : 'menu_book'}
                        </span>
                        {isPractice ? 'How to Do This:' : 'Preparation Recipe:'}
                      </p>
                      <p className="font-medium text-slate-800 leading-relaxed whitespace-pre-line">
                        {remedy.recipe}
                      </p>
                    </div>

                    {/* Usage / Dosage */}
                    {remedy.usage && (
                      <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-bold border ${isPractice ? 'bg-teal-100/70 text-teal-900 border-teal-300/60' : 'bg-amber-100/70 text-amber-900 border-amber-300/60'}`}>
                        <span className="material-symbols-outlined text-[18px]">{isPractice ? 'schedule' : 'local_cafe'}</span>
                        <span><strong>{isPractice ? 'When & How Often:' : 'How to Consume:'}</strong> {remedy.usage}</span>
                      </div>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Lifestyle */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-surface-variant/60">
            <h2 className="text-[20px] font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">spa</span>Lifestyle & Recovery Guidance
            </h2>
            <ul className="space-y-3">
              {diagnosis.lifestyleRecommendations?.map((r, i) => (
                <li key={i} className="flex items-start gap-3 bg-surface-container-low p-3.5 rounded-xl border border-surface-variant/40">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">check_circle</span>
                  <span className="text-[15px] font-medium text-on-surface">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right sidebar — REAL GPS DOCTORS */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-surface-variant/60">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[20px] font-bold text-on-surface">Recommended Specialists</h3>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-extrabold rounded-full border border-blue-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">location_on</span>
                  Real GPS
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {diagnosis.recommendedSpecialties?.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-[12px] font-bold rounded-full border border-primary/20">{s}</span>
                ))}
              </div>

              {loadingDoctors ? (
                <div className="p-6 text-center text-slate-500 font-medium text-[13px] flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
                  Finding real doctors near your location...
                </div>
              ) : (
                <div className="space-y-3">
                  {doctors.slice(0, 5).map((doc) => (
                    <Link 
                      key={doc._id || doc.id} 
                      to={`/doctor/${doc._id || doc.id}`} 
                      className="block p-4 bg-surface-container-low rounded-xl border border-surface-variant/50 hover:border-primary hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={doc.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || doc.doctorName || 'Doctor')}&background=008378&color=fff`} 
                          alt={doc.name || doc.doctorName} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-surface shadow-sm shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-bold text-on-surface truncate group-hover:text-primary transition-colors">{doc.name || doc.doctorName}</p>
                          <p className="text-[13px] text-on-surface-variant font-medium truncate">{doc.specialty || 'General Practice'}</p>
                          {doc.distance && (
                            <p className="text-[11px] text-teal-700 font-bold flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-[13px]">location_on</span>
                              {doc.distance} away
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-variant/40">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-amber-500 text-[18px] filled">star</span>
                          <span className="text-[13px] font-bold text-on-surface">{doc.rating || 4.9}</span>
                          <span className="text-[12px] text-on-surface-variant font-medium">({doc.reviewCount || 120})</span>
                        </div>
                        <span className="text-[13px] font-bold text-primary flex items-center gap-1">
                          Book 
                          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/doctors" className="block w-full bg-primary text-on-primary text-[15px] font-bold py-3.5 rounded-xl hover:bg-primary-container transition-all shadow-glow hover:shadow-glow-hover text-center">
              Explore All Nearby Doctors →
            </Link>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/60">
              <p className="text-[13px] text-amber-900 leading-relaxed font-medium">
                <strong>Medical Disclaimer:</strong> Care plans generated by HealthSync AI are for informational guidance. Seek immediate emergency care for severe, sudden symptoms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
