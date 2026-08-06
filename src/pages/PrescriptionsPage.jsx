import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { treatmentPlansAPI, chatAPI } from '../services/api';

const defaultIndianRemedies = [
  {
    _id: 'rem1',
    name: 'Geeli Patti / Cold Compress (गीली पट्टी)',
    category: 'practice',
    ingredients: 'Clean cotton cloth or towel, bowl of room-temperature water',
    recipe: '1. Soak cotton cloth in room-temp water and wring out excess moisture.\n2. Place gently on forehead, wrists, and back of neck.\n3. Change every 5-10 mins as the cloth warms up.\n4. Repeat for 20-30 minutes.',
    usage: 'Repeat every 2-3 hours to safely bring down high body temperature.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=geeli+patti+fever+cold+compress+remedy',
    status: 'active',
    prescribedFor: 'High Fever & Body Temperature Management'
  },
  {
    _id: 'rem2',
    name: 'Ayurvedic Tulsi-Ginger Kadha (Herbal Tea)',
    category: 'recipe',
    ingredients: '8-10 Tulsi leaves, 1-inch fresh Ginger, 2 Cloves, 4 Black Peppercorns, 1 tsp Honey',
    recipe: '1. Crush ginger, tulsi leaves, cloves, and peppercorns.\n2. Boil in 2 cups of water for 8-10 minutes until reduced to 1 cup.\n3. Strain into a cup and mix with 1 tsp honey while warm.',
    usage: 'Sip warm 2 times daily for fast relief from cold, cough, fever, and sore throat.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=how+to+make+ayurvedic+kadha+recipe',
    status: 'active',
    prescribedFor: 'Severe Cold, Cough & Respiratory Relief'
  },
  {
    _id: 'rem3',
    name: 'Haldi Doodh (Golden Turmeric Milk)',
    category: 'recipe',
    ingredients: '1 cup warm Milk, 1/2 tsp Pure Turmeric powder, pinch of crushed Black Pepper, Honey',
    recipe: '1. Heat 1 cup of milk in a saucepan on medium flame.\n2. Stir in turmeric powder and crushed black pepper.\n3. Simmer for 3-4 minutes, pour into a mug, and add honey to taste.',
    usage: 'Drink warm right before sleep to soothe inflammation, relieve body pain, and boost immunity.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=haldi+doodh+golden+milk+turmeric+recipe',
    status: 'active',
    prescribedFor: 'Body Ache, Fatigue & Immunity Boost'
  },
  {
    _id: 'rem4',
    name: 'Ajwain-Jeera Warm Water Decoction',
    category: 'recipe',
    ingredients: '1/2 tsp Ajwain (Carom seeds), 1/2 tsp Jeera (Cumin seeds), 1 glass Water, pinch of Black Salt',
    recipe: '1. Boil ajwain and jeera in 1 glass of water for 5 minutes.\n2. Strain the warm liquid and add a pinch of black salt.',
    usage: 'Sip warm after meals for rapid relief from gas, bloating, and stomach cramps.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=ajwain+jeera+water+for+stomach+pain',
    status: 'completed',
    prescribedFor: 'Stomach Pain, Cramps & Gastric Relief'
  }
];

export default function PrescriptionsPage() {
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadUserRemedies = async () => {
      setLoading(true);
      try {
        // 1. Fetch saved treatment plans
        const plansRes = await treatmentPlansAPI.list();
        let extractedRemedies = [];

        if (plansRes.data && plansRes.data.length > 0) {
          // Extract remedies from full treatment plan details
          for (const plan of plansRes.data.slice(0, 3)) {
            try {
              const fullPlan = await treatmentPlansAPI.getById(plan._id);
              const planRemedies = fullPlan.data?.diagnosis?.indianHomeRemedies || [];
              const planTitle = fullPlan.data?.title || 'AI Assessment';
              
              planRemedies.forEach((rem, idx) => {
                extractedRemedies.push({
                  _id: `${plan._id}_${idx}`,
                  name: rem.name,
                  category: rem.category || 'recipe',
                  ingredients: rem.ingredients,
                  recipe: rem.recipe,
                  usage: rem.usage,
                  youtubeUrl: rem.youtubeUrl,
                  status: 'active',
                  prescribedFor: planTitle
                });
              });
            } catch (e) {
              /* ignore single plan fetch error */
            }
          }
        }

        // 2. Fallback to chat session remedies if no saved plan remedies found
        if (extractedRemedies.length === 0) {
          const sessRes = await chatAPI.getSessions();
          if (sessRes.data && sessRes.data.length > 0) {
            for (const sess of sessRes.data.slice(0, 3)) {
              if (sess.diagnosis?.indianHomeRemedies?.length > 0) {
                sess.diagnosis.indianHomeRemedies.forEach((rem, idx) => {
                  extractedRemedies.push({
                    _id: `${sess._id}_${idx}`,
                    name: rem.name,
                    category: rem.category || 'recipe',
                    ingredients: rem.ingredients,
                    recipe: rem.recipe,
                    usage: rem.usage,
                    youtubeUrl: rem.youtubeUrl,
                    status: 'active',
                    prescribedFor: sess.symptomTags?.join(', ') || 'Symptom Triage'
                  });
                });
              }
            }
          }
        }

        if (extractedRemedies.length > 0) {
          setRemedies(extractedRemedies);
        } else {
          setRemedies([]);
        }
      } catch (e) {
        console.warn('Fallback to default Indian remedies:', e);
        setRemedies(defaultIndianRemedies);
      } finally {
        setLoading(false);
      }
    };

    loadUserRemedies();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="w-full px-4 md:px-10 lg:px-16 py-8 relative">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-24 right-8 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl z-50 animate-bounce flex items-center gap-2 text-[14px] font-semibold border border-slate-700">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          {toast}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[30px] md:text-[36px] leading-[40px] font-black text-on-surface tracking-tight text-gradient-animated">
            Ayurvedic Remedies & Home Care
          </h1>
          <p className="text-[15px] text-on-surface-variant font-medium mt-1">
            Personalized natural prescriptions & authentic Indian home remedies generated from your AI symptom assessment.
          </p>
        </div>
        <Link to="/analysis" className="btn-primary py-3 px-6 text-[14px] card-interactive shrink-0">
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>New AI Symptom Triage</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main List */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <span className="material-symbols-outlined text-teal-600 text-4xl animate-spin">sync</span>
            </div>
          ) : remedies.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center shadow-soft border border-surface-variant/60">
              <span className="material-symbols-outlined text-teal-600 text-5xl mb-4 block">eco</span>
              <p className="text-[16px] text-on-surface-variant font-medium mb-4">No active home remedies found.</p>
              <Link to="/analysis" className="text-teal-700 text-[14px] font-bold hover:underline">
                Start a health assessment to receive AI-personalized remedies
              </Link>
            </div>
          ) : (
            remedies.map((rem) => {
              const isPractice = rem.category === 'practice';
              return (
                <div 
                  key={rem._id} 
                  className={`p-6 rounded-2xl border shadow-soft transition-all card-interactive ${
                    isPractice 
                      ? 'bg-gradient-to-br from-teal-50/70 via-white to-surface-container-low border-teal-200/80 hover:border-teal-400' 
                      : 'bg-gradient-to-br from-amber-50/70 via-white to-surface-container-low border-amber-200/80 hover:border-amber-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                        isPractice ? 'bg-teal-100 text-teal-800 border border-teal-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        <span className="material-symbols-outlined text-2xl">
                          {isPractice ? 'self_improvement' : 'soup_kitchen'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-[19px] font-black text-slate-900">{rem.name}</h3>
                        <p className="text-[12px] font-bold text-slate-500 mt-0.5">
                          Prescribed for: <span className="text-slate-800">{rem.prescribedFor || 'Symptom Triage'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                        isPractice ? 'bg-teal-100 text-teal-800 border border-teal-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {isPractice ? 'Traditional Practice' : 'Herbal Recipe'}
                      </span>
                      <a
                        href={rem.youtubeUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${rem.name} Indian remedy`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-2xs active:scale-95 shrink-0"
                      >
                        <span className="material-symbols-outlined text-[14px]">play_circle</span>
                        Video
                      </a>
                    </div>
                  </div>

                  <div className="space-y-3 text-[13.5px] border-t border-slate-200/80 pt-4">
                    {/* Ingredients / Materials */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                      <p className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-amber-700">
                          {isPractice ? 'sanitizer' : 'inventory_2'}
                        </span>
                        {isPractice ? 'Materials Needed:' : 'Ingredients Required:'}
                      </p>
                      <p className="font-semibold text-slate-700 leading-relaxed">
                        {Array.isArray(rem.ingredients) ? rem.ingredients.join(', ') : rem.ingredients}
                      </p>
                    </div>

                    {/* Preparation Steps */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                      <p className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-teal-700">
                          {isPractice ? 'clinical_notes' : 'menu_book'}
                        </span>
                        {isPractice ? 'How to Perform:' : 'Preparation Recipe:'}
                      </p>
                      <p className="font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                        {rem.recipe}
                      </p>
                    </div>

                    {/* Usage / Timing */}
                    {rem.usage && (
                      <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12.5px] font-bold border ${
                        isPractice ? 'bg-teal-100/70 text-teal-900 border-teal-300/60' : 'bg-amber-100/70 text-amber-900 border-amber-300/60'
                      }`}>
                        <span className="material-symbols-outlined text-[18px]">{isPractice ? 'schedule' : 'local_cafe'}</span>
                        <span><strong>Dosage & Frequency:</strong> {rem.usage}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-200/80 card-interactive">
            <h3 className="text-[18px] font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">eco</span>
              Natural Care Disclaimer
            </h3>
            <p className="text-[13.5px] text-slate-600 font-medium leading-relaxed mb-4">
              Indian home remedies (Geeli Patti, Kadha, Haldi Doodh) provide supportive symptom management. If symptoms persist or worsen (e.g. fever above 103°F), consult a doctor immediately.
            </p>
            <Link to="/doctors" className="block text-center w-full bg-teal-600 text-white font-bold text-[14px] py-3 rounded-xl hover:bg-teal-700 transition-all shadow-md">
              Find Nearby Doctors
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-200/80 card-interactive">
            <h3 className="text-[18px] font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">schedule</span>
              Remedy & Practice Routine
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-amber-50/80 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-amber-700 text-[20px]">soup_kitchen</span>
                  <div>
                    <span className="text-[13px] font-bold text-slate-900 block">Morning Kadha</span>
                    <span className="text-[11px] text-slate-500">Tulsi & Ginger decoction</span>
                  </div>
                </div>
                <span className="text-[12px] font-black text-amber-800">08:00 AM</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-teal-50/80 rounded-xl border border-teal-200">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-teal-700 text-[20px]">self_improvement</span>
                  <div>
                    <span className="text-[13px] font-bold text-slate-900 block">Mid-Day Care</span>
                    <span className="text-[11px] text-slate-500">Geeli Patti / Rest</span>
                  </div>
                </div>
                <span className="text-[12px] font-black text-teal-800">02:00 PM</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-amber-50/80 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-amber-700 text-[20px]">local_cafe</span>
                  <div>
                    <span className="text-[13px] font-bold text-slate-900 block">Night Haldi Doodh</span>
                    <span className="text-[11px] text-slate-500">Golden Milk before bed</span>
                  </div>
                </div>
                <span className="text-[12px] font-black text-amber-800">09:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
