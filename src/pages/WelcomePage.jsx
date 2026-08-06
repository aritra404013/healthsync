import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
  const [activeTab, setActiveTab] = useState('triage');
  const [selectedSymptom, setSelectedSymptom] = useState('fever');

  const symptomsData = {
    fever: {
      name: 'High Fever (103°F)',
      category: 'Practice',
      practice: 'Geeli Patti / Cold Compress (गीली पट्टी)',
      recipe: 'Soak cotton cloth in room-temp water. Place on forehead & wrists. Change every 5-10 mins to bring down temperature.',
      doctorDistance: '0.8 km',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300'
    },
    cold: {
      name: 'Severe Cold & Cough',
      category: 'Recipe',
      practice: 'Ayurvedic Tulsi-Ginger Kadha',
      recipe: 'Boil 8 Tulsi leaves + 1-inch Ginger + 2 Cloves in 2 cups water down to 1 cup. Add 1 tsp honey while warm.',
      doctorDistance: '1.2 km',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    stomach: {
      name: 'Stomach Pain & Gas',
      category: 'Recipe',
      practice: 'Ajwain-Jeera Warm Decoction',
      recipe: 'Boil 1/2 tsp Ajwain + 1/2 tsp Cumin in 1 glass water for 5 mins. Sip warm after meals for fast relief.',
      doctorDistance: '1.5 km',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    headache: {
      name: 'Throbbing Headache',
      category: 'Practice',
      practice: 'Chandan / Mint forehead application',
      recipe: 'Apply cooling mint or sandalwood paste on forehead. Rest in a dark, quiet room and drink 2 glasses water.',
      doctorDistance: '0.5 km',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300'
    }
  };

  const stats = [
    { label: 'Clinical Evaluations', value: '15,000+', icon: 'medical_services', color: 'from-teal-600 to-emerald-700' },
    { label: 'Triage Response Speed', value: '< 15 Sec', icon: 'bolt', color: 'from-blue-600 to-cyan-700' },
    { label: 'Indian Home Remedies', value: '100% AI Realtime', icon: 'eco', color: 'from-amber-600 to-orange-700' },
    { label: 'GPS Doctor Matching', value: 'Instant & Live', icon: 'location_on', color: 'from-indigo-600 to-purple-700' }
  ];

  const features = [
    {
      id: 'triage',
      title: 'Adaptive AI Symptom Triage',
      subtitle: 'Dynamic problem-tailored questionnaires',
      desc: 'Our engine generates targeted interactive clinical forms tailored to your exact symptoms—whether headache, high fever, or abdominal pain.',
      icon: 'psychology',
      badge: 'Smart Diagnostic',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
      bullets: ['Pain severity & temperature sliders', 'Red-flag emergency symptom detection', 'Instant clinical risk level categorization']
    },
    {
      id: 'doctors',
      title: 'Auto-GPS Doctor & Clinic Finder',
      subtitle: 'No manual search needed',
      desc: 'HealthSync automatically fetches your live GPS coordinates to display nearby verified doctors, clinics, and hospitals in real-time.',
      icon: 'near_me',
      badge: 'GPS Integrated',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80',
      bullets: ['Automatic geolocation pinpointing', 'Live TomTom & OpenStreetMap POI search', 'One-click appointment booking']
    },
    {
      id: 'remedies',
      title: 'Personalized Indian Home Remedies',
      subtitle: 'Authentic Ayurvedic Care & Traditional Practices',
      desc: 'Receive AI-crafted herbal recipes (Kadha, Haldi Doodh) and traditional home care practices (Geeli Patti, Tel Maalish) customized to your condition.',
      icon: 'eco',
      badge: 'Ayurvedic & Natural',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
      bullets: ['Custom ingredients & step-by-step recipes', 'Traditional practices like Geeli Patti for fever', 'Direct YouTube video tutorials']
    },
    {
      id: 'emergency',
      title: 'Automated Emergency Safeguards',
      subtitle: 'Immediate medical urgency alerts',
      desc: 'When high risk or extreme symptoms are detected (fever > 103°F, shortness of breath), HealthSync triggers instant doctor visit warnings.',
      icon: 'warning',
      badge: '24/7 Safety First',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
      bullets: ['Red-flag symptom prioritization', 'Direct 112 emergency advice', 'Top 5 nearest hospital dispatch']
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai, Maharashtra',
      role: 'Software Engineer',
      text: 'When I had a sudden 103°F fever, HealthSync immediately recommended cold Geeli Patti on forehead alongside an urgent doctor visit and showed doctors 1.2km away!',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      verified: 'Verified Patient'
    },
    {
      name: 'Rajesh Patel',
      location: 'Ahmedabad, Gujarat',
      role: 'Business Owner',
      text: 'The AI dynamic form adapted directly to my severe stomach cramps. The Ajwain & Jeera warm water remedy provided fast natural relief.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      verified: 'Verified Patient'
    },
    {
      name: 'Dr. Ananya Roy',
      location: 'Kolkata, West Bengal',
      role: 'Internal Medicine Specialist',
      text: 'HealthSync bridges preliminary patient triage and specialist care brilliantly. The emergency alert safeguards are clinically sound.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      verified: 'Medical Reviewer'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-teal-500/20 selection:text-teal-700 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-20 lg:pt-16 lg:pb-32 overflow-hidden hero-gradient-bg border-b border-teal-100/80">
        {/* Animated Background Mesh Blobs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl pointer-events-none animate-float-blob-1"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300/25 rounded-full blur-3xl pointer-events-none animate-float-blob-2"></div>

        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-12 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in">
            
            {/* Pill Badge with Pulse */}
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-teal-500/10 via-emerald-500/15 to-teal-500/10 text-teal-900 px-4 py-2 rounded-full w-fit border border-teal-300/80 text-[13px] font-extrabold tracking-wide uppercase shadow-2xs backdrop-blur-md badge-glow-teal animate-pulse-soft">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-600"></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-teal-700">clinical_notes</span>
                AI Health Navigator & Desi Remedy Engine 2.0
              </span>
            </div>
            
            {/* Hero Main Heading with Animated Gradient */}
            <div className="flex flex-col gap-3">
              <h1 className="text-[32px] sm:text-[54px] lg:text-[64px] leading-[1.08] font-black tracking-tight text-slate-900">
                Instant AI Triage & <br />
                <span className="text-gradient-animated">Ayurvedic Home Care</span>
              </h1>
              <p className="text-[17px] md:text-[20px] leading-relaxed text-slate-600 max-w-2xl font-medium">
                Describe your symptoms to receive instant clinical evaluation, auto-detected GPS doctor recommendations, and personalized authentic Indian home remedies (Kadha, Geeli Patti & traditional care).
              </p>
            </div>

            {/* JOYFUL INTERACTIVE QUICK-SCANNER BUTTONS */}
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-teal-200/80 shadow-md max-w-xl my-1">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[12px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-teal-600">touch_app</span>
                  Try Quick AI Symptom Scanner:
                </span>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Tap to preview
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'fever', label: 'Fever 103°F', icon: 'thermostat' },
                  { key: 'cold', label: 'Severe Cold', icon: 'ac_unit' },
                  { key: 'stomach', label: 'Stomach Pain', icon: 'spa' },
                  { key: 'headache', label: 'Headache', icon: 'brain' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedSymptom(item.key)}
                    className={`px-3 py-1.5 rounded-xl text-[12.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedSymptom === item.key
                        ? 'bg-teal-600 text-white shadow-md scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              <Link to="/analysis" className="btn-primary text-[16px] py-4 px-8 shadow-lg hover:shadow-teal-500/30 active:scale-98 transition-all card-interactive">
                <span className="material-symbols-outlined text-[22px]">vital_signs</span>
                <span>Start Symptom Analysis</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
              <Link to="/doctors" className="btn-secondary text-[16px] py-4 px-7 shadow-xs hover:shadow-md transition-all">
                <span className="material-symbols-outlined text-[20px] text-teal-600">location_on</span>
                <span>Find Nearby Doctors</span>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-200/80">
              <div className="flex -space-x-3 shrink-0">
                <img className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-md z-30" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80" alt="Doctor" />
                <img className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-md z-20" src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80" alt="Doctor" />
                <img className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-md z-10" src="https://images.unsplash.com/photo-1594824813566-78a933758f46?w=120&auto=format&fit=crop&q=80" alt="Doctor" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-500 text-[14px]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined filled text-[17px]">star</span>
                  ))}
                  <span className="text-slate-900 font-extrabold text-[14px] ml-1">4.9 / 5.0</span>
                </div>
                <span className="text-[12.5px] text-slate-500 font-semibold">Trusted by 15,000+ patients across India</span>
              </div>
            </div>

          </div>
          
          {/* Hero Right Column — DYNAMIC REACTION PREVIEW CARD */}
          <div className="lg:col-span-5 relative z-10 flex justify-center items-center">
            <div className="relative w-full max-w-[500px]">
              
              {/* Main Display Card */}
              <div className="relative rounded-[2.5rem] p-4 bg-white/95 backdrop-blur-xl border-2 border-teal-200 shadow-2xl overflow-hidden card-interactive">
                
                {/* SVG Cardiac Pulse Line Graphic */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600"></div>

                <div className="p-4 space-y-4">
                  
                  {/* Top Live Badge */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-teal-600 animate-pulse">ecg_heart</span>
                      <span className="text-[13px] font-extrabold text-slate-900">Live AI Reaction</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${symptomsData[selectedSymptom].badgeColor}`}>
                      {symptomsData[selectedSymptom].category}
                    </span>
                  </div>

                  {/* Selected Symptom Title */}
                  <div>
                    <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Detected Symptom</span>
                    <h4 className="text-[17px] font-black text-slate-900 mt-0.5">
                      {symptomsData[selectedSymptom].name}
                    </h4>
                  </div>

                  {/* Recommended Desi Remedy Card */}
                  <div className="p-3.5 bg-teal-50/90 rounded-2xl border border-teal-200/90 space-y-1.5 transition-all">
                    <div className="flex items-center gap-2 text-teal-900 font-extrabold text-[13.5px]">
                      <span className="material-symbols-outlined text-[18px] text-teal-700">self_improvement</span>
                      <span>{symptomsData[selectedSymptom].practice}</span>
                    </div>
                    <p className="text-[12.5px] text-slate-700 font-medium leading-relaxed">
                      {symptomsData[selectedSymptom].recipe}
                    </p>
                  </div>

                  {/* Auto GPS Doctor Badge */}
                  <div className="flex items-center justify-between p-3 bg-blue-50/90 rounded-xl border border-blue-200 text-[12px]">
                    <div className="flex items-center gap-2 text-blue-900 font-bold">
                      <span className="material-symbols-outlined text-[18px] text-blue-600">location_on</span>
                      <span>Top Specialist Matched</span>
                    </div>
                    <span className="font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      {symptomsData[selectedSymptom].doctorDistance} away
                    </span>
                  </div>

                  <Link to="/analysis" className="btn-primary w-full justify-center py-3 text-[14px] shadow-md">
                    <span>Analyze Your Own Symptoms</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>

                </div>
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute -top-5 -right-4 glass-panel p-3 rounded-2xl flex items-center gap-2.5 shadow-xl border border-teal-200 bg-white/95 animate-float z-20">
                <span className="material-symbols-outlined text-teal-600 text-[20px]">check_circle</span>
                <span className="text-[12px] font-extrabold text-slate-900">100% Authentic Indian Care</span>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -bottom-5 -left-4 glass-panel p-3 rounded-2xl flex items-center gap-2.5 shadow-xl border border-amber-300 bg-white/95 animate-float-reverse z-20">
                <span className="material-symbols-outlined text-amber-600 text-[20px]">eco</span>
                <span className="text-[12px] font-extrabold text-slate-900">Ayurvedic AI Engine</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* LIVE METRICS / STATS BAR WITH SPRING PHYSICS */}
      <section className="py-10 bg-slate-900 text-white relative z-20 border-y border-slate-800">
        <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((item, idx) => (
            <div key={idx} className="stat-card p-5 md:p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col gap-2 hover:border-teal-500/50 transition-all card-interactive group">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
              </div>
              <span className="text-[28px] sm:text-[36px] font-black tracking-tight text-white mt-1 group-hover:text-teal-300 transition-colors">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE FEATURE SHOWCASE */}
      <section id="features" className="py-16 lg:py-28 bg-white relative">
        <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 flex flex-col gap-12">
          
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="text-[12px] font-extrabold uppercase tracking-widest text-teal-800 bg-teal-100/80 px-4 py-1.5 rounded-full w-fit mx-auto border border-teal-300">
              Modern Healthcare Engine
            </span>
            <h2 className="text-[32px] sm:text-[44px] leading-[1.15] font-black text-slate-900">
              Complete AI Triage + Real-Time Care Ecosystem
            </h2>
            <p className="text-[16px] md:text-[19px] leading-relaxed text-slate-600 font-medium">
              Designed from the ground up to handle complex symptom evaluation, emergency safeguards, live GPS doctor lookup, and personalized Ayurvedic remedies.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex justify-center gap-2 sm:gap-4 flex-wrap border-b border-slate-200 pb-4">
            {features.map((feat) => {
              const isActive = activeTab === feat.id;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveTab(feat.id)}
                  className={`px-5 py-3 rounded-2xl text-[14px] font-extrabold transition-all flex items-center gap-2 border cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50 hover:border-teal-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{feat.icon}</span>
                  <span>{feat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content Card */}
          {features.filter(f => f.id === activeTab).map((feat) => (
            <div key={feat.id} className="grid lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-slate-50 to-teal-50/40 p-6 md:p-10 rounded-[2.5rem] border border-teal-100 shadow-xl animate-fade-in card-interactive">
              <div className="lg:col-span-6 flex flex-col gap-5">
                <span className="px-3.5 py-1 bg-teal-100 text-teal-800 text-[12px] font-extrabold rounded-full w-fit uppercase tracking-wider border border-teal-300">
                  {feat.badge}
                </span>
                <h3 className="text-[28px] sm:text-[36px] font-black text-slate-900 leading-tight">
                  {feat.title}
                </h3>
                <p className="text-[16px] text-slate-600 font-medium leading-relaxed">
                  {feat.desc}
                </p>

                <div className="space-y-3 mt-2">
                  {feat.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                      <span className="text-[14px] font-bold text-slate-800">{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Link to="/analysis" className="btn-primary py-3.5 px-7">
                    <span>Try This Feature Now</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                  <img src={feat.image} alt={feat.title} className="w-full h-[320px] sm:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-[13px] font-bold uppercase text-teal-300 tracking-wider">{feat.subtitle}</p>
                    <p className="text-[18px] font-extrabold mt-1">{feat.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* INDIAN AYURVEDA SPOTLIGHT */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-50 via-orange-50/40 to-slate-50 border-y border-amber-200/60 relative">
        <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full w-fit border border-amber-300 text-[12px] font-extrabold uppercase tracking-wider badge-glow-amber">
              <span className="material-symbols-outlined text-[18px] text-amber-800">eco</span>
              <span>Authentic Indian Household Care</span>
            </div>
            
            <h2 className="text-[32px] sm:text-[44px] font-black text-slate-900 leading-tight">
              Real AI-Generated <br />
              <span className="text-amber-700">Desi Nuskhe & Traditional Care</span>
            </h2>

            <p className="text-[16px] md:text-[18px] text-slate-700 font-medium leading-relaxed">
              We go beyond standard clinical advice. HealthSync AI synthesizes traditional Indian home care wisdom—generating both <strong>herbal recipes</strong> (Kadha, Haldi Doodh) and <strong>traditional home practices</strong> (Geeli Patti, Tel Maalish, Bhaap).
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs card-interactive">
                <div className="flex items-center gap-2 mb-2 text-amber-800 font-extrabold text-[15px]">
                  <span className="material-symbols-outlined text-[20px] text-amber-700">soup_kitchen</span>
                  <span>Herbal Recipes</span>
                </div>
                <p className="text-[13px] text-slate-600 font-medium">Tulsi-Ginger Kadha, Haldi Doodh, Ajwain Jeera water with exact ingredient ratios.</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-2xs card-interactive">
                <div className="flex items-center gap-2 mb-2 text-teal-800 font-extrabold text-[15px]">
                  <span className="material-symbols-outlined text-[20px] text-teal-700">self_improvement</span>
                  <span>Traditional Practices</span>
                </div>
                <p className="text-[13px] text-slate-600 font-medium">Geeli Patti cold compress for fever, Sarson oil massage, Bhaap steam inhalation.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-amber-300 shadow-2xl space-y-4 relative overflow-hidden card-interactive">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px] text-amber-700">eco</span>
                  <div>
                    <h4 className="text-[16px] font-extrabold text-slate-900">Live AI Remedy Preview</h4>
                    <p className="text-[12px] font-semibold text-amber-800">Generated for: High Fever (103°F) + Body Ache</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-[11px] font-extrabold rounded-full">AI Live</span>
              </div>

              {/* Sample Remedy 1: Practice */}
              <div className="p-4 bg-teal-50/90 rounded-2xl border border-teal-200 text-[13px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-teal-700">self_improvement</span>
                    Geeli Patti / Cold Compress (गीली पट्टी)
                  </span>
                  <span className="px-2 py-0.5 bg-teal-200 text-teal-900 text-[10px] font-bold rounded-md">Practice</span>
                </div>
                <p className="text-slate-700 font-medium mt-1">Soak clean cotton cloth in room-temp water. Place on forehead & wrists. Change every 5-10 mins to safely bring down fever.</p>
              </div>

              {/* Sample Remedy 2: Recipe */}
              <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200 text-[13px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-amber-700">soup_kitchen</span>
                    Ayurvedic Tulsi-Ginger Kadha
                  </span>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-md">Recipe</span>
                </div>
                <p className="text-slate-700 font-medium mt-1">8 Tulsi leaves + 1 inch Ginger + 2 Cloves boiled in 2 cups water down to 1 cup. Mix 1 tsp honey while warm.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 lg:py-28 bg-white">
        <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 flex flex-col gap-12">
          
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <span className="text-[12px] font-extrabold uppercase tracking-widest text-teal-800 bg-teal-50 px-4 py-1.5 rounded-full w-fit mx-auto border border-teal-300">
              User Experiences
            </span>
            <h2 className="text-[32px] sm:text-[42px] font-black text-slate-900">
              Trusted by Patients & Physicians
            </h2>
            <p className="text-[16px] text-slate-600 font-medium">
              Real feedback from individuals across India who relied on HealthSync AI for symptom guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-50 hover:bg-white p-8 rounded-[2rem] border border-slate-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-interactive">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined filled text-[18px]">star</span>
                    ))}
                  </div>
                  <p className="text-[15px] leading-relaxed text-slate-700 font-medium italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-200/80">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shadow-sm shrink-0" />
                  <div>
                    <h4 className="text-[15px] font-extrabold text-slate-900 leading-tight">{t.name}</h4>
                    <p className="text-[12px] font-semibold text-slate-500">{t.role} • {t.location}</p>
                    <span className="inline-flex items-center gap-1 mt-0.5 text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      {t.verified}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white relative overflow-hidden">
        <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          
          <div className="flex flex-col gap-3 text-center lg:text-left max-w-2xl">
            <h2 className="text-[32px] sm:text-[44px] font-black leading-tight">
              Ready for Your AI Symptom Assessment?
            </h2>
            <p className="text-[17px] text-teal-100 font-medium">
              Start your free clinical evaluation now. Get immediate triage insights, nearby doctor matches, and authentic Indian home remedies.
            </p>
          </div>

          <div className="shrink-0">
            <Link to="/analysis" className="btn-secondary text-[17px] py-4 px-9 bg-white text-teal-900 font-black hover:bg-teal-50 shadow-2xl transition-all border-none card-interactive">
              <span>Launch AI Symptom Triage</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
