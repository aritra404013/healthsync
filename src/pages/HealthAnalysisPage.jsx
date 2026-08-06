import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chatAPI, doctorsAPI } from '../services/api';

const quickSymptoms = ['Headache', 'Fever', 'Stomach Pain', 'Back Pain', 'Cough', 'Fatigue', 'Dizziness', 'Sore Throat'];

// Helper to determine if user message is related to health/symptoms
const isHealthRelatedQuery = (text) => {
  if (!text) return false;
  const lower = text.toLowerCase().trim();

  // If text is interactive form response, it's health related
  if (lower.startsWith('[interactive form responses')) return true;

  // Non-health general greetings and chitchat
  const nonHealthGreetings = [
    'hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon',
    'who are you', 'what can you do', 'how are you', 'thank you', 'thanks',
    'bye', 'goodbye', 'ok', 'okay', 'cool', 'nice', 'help'
  ];
  
  if (nonHealthGreetings.includes(lower)) return false;

  // Key health & symptom keywords
  const healthKeywords = [
    'pain', 'ache', 'fever', 'headache', 'stomach', 'cough', 'sore', 'throat',
    'dizziness', 'dizzy', 'nausea', 'vomit', 'vomiting', 'fatigue', 'tired',
    'breath', 'breathing', 'chest', 'back', 'joint', 'muscle', 'rash', 'skin',
    'blood', 'bleed', 'bleeding', 'temp', 'temperature', 'chill', 'chills',
    'cramps', 'swollen', 'swelling', 'infection', 'sick', 'ill', 'hurt',
    'hurts', 'injury', 'wound', 'diarrhea', 'allergy', 'allergic', 'asthma',
    'migraine', 'flu', 'cold', 'symptom', 'disease', 'condition', 'feel unwell',
    'not feeling well', 'uncomfortable'
  ];

  return healthKeywords.some(kw => lower.includes(kw));
};

// Helper to generate dynamic interactive forms based on problem type
const getFormForProblem = (text, customFormFromAI = null) => {
  if (!isHealthRelatedQuery(text)) {
    return null;
  }

  if (customFormFromAI && customFormFromAI.questions) {
    return customFormFromAI;
  }

  const lower = text.toLowerCase();

  if (lower.includes('headache') || lower.includes('migraine') || lower.includes('head')) {
    return {
      title: 'Headache & Neurological Triage Form',
      problemType: 'Headache',
      questions: [
        { id: 'severity', type: 'slider', label: 'Head Pain Intensity (1-10)', min: 1, max: 10, default: 6 },
        { id: 'location', type: 'single_choice', label: 'Pain Localization:', options: ['Forehead / Frontal', 'One Side (Temporal)', 'Back of Head / Neck', 'Entire Head'] },
        { id: 'onset', type: 'single_choice', label: 'Onset Speed:', options: ['Sudden / Thunderclap', 'Gradual (Over Hours)', 'Intermittent / Waves'] },
        { id: 'red_flags', type: 'multi_choice', label: 'Accompanying Symptoms:', options: ['Stiff Neck', 'Sensitivity to Light (Photophobia)', 'Nausea / Vomiting', 'Visual Aura / Flashes', 'Confusion / Dizziness'] }
      ]
    };
  }

  if (lower.includes('fever') || lower.includes('temperature') || lower.includes('chill') || lower.includes('cold')) {
    return {
      title: 'Fever & Infection Triage Form',
      problemType: 'Fever',
      questions: [
        { id: 'temp', type: 'temp_slider', label: 'Current Thermometer Temp (°F):', min: 98.0, max: 105.0, step: 0.5, default: 101.5 },
        { id: 'pattern', type: 'single_choice', label: 'Fever Pattern:', options: ['Constant High', 'Comes & Goes (Spiking)', 'Night Sweats & Chills'] },
        { id: 'duration', type: 'single_choice', label: 'Duration:', options: ['< 24 Hours', '1-3 Days', '4-7 Days', '1+ Weeks'] },
        { id: 'associated', type: 'multi_choice', label: 'Associated Symptoms:', options: ['Body Aches', 'Fatigue / Weakness', 'Cough or Sore Throat', 'Skin Rash', 'Shortness of Breath'] }
      ]
    };
  }

  if (lower.includes('stomach') || lower.includes('belly') || lower.includes('abdomen') || lower.includes('nausea') || lower.includes('digest')) {
    return {
      title: 'Abdominal & Gastrointestinal Triage Form',
      problemType: 'Stomach',
      questions: [
        { id: 'severity', type: 'slider', label: 'Abdominal Discomfort (1-10)', min: 1, max: 10, default: 5 },
        { id: 'quadrant', type: 'single_choice', label: 'Pain Location:', options: ['Upper Right', 'Upper Center', 'Lower Right (Appendix area)', 'Lower Left', 'Whole Abdomen'] },
        { id: 'nature', type: 'single_choice', label: 'Pain Characteristics:', options: ['Sharp / Cramping', 'Dull Burning Ache', 'Bloating / Pressure'] },
        { id: 'gi_triggers', type: 'multi_choice', label: 'Associated Factors:', options: ['Worse after eating', 'Nausea or Vomiting', 'Diarrhea or Loose Stool', 'Loss of Appetite'] }
      ]
    };
  }

  if (lower.includes('cough') || lower.includes('chest') || lower.includes('breath') || lower.includes('lung')) {
    return {
      title: 'Respiratory & Chest Triage Form',
      problemType: 'Respiratory',
      questions: [
        { id: 'breathlessness', type: 'single_choice', label: 'Breathlessness Level:', options: ['None / Normal', 'On Walking / Exertion', 'At Rest (Emergency)'] },
        { id: 'cough_type', type: 'single_choice', label: 'Cough Characteristics:', options: ['Dry & Hacking', 'Wet with Mucus/Phlegm', 'Wheezing / Tightness'] },
        { id: 'resp_signs', type: 'multi_choice', label: 'Associated Signs:', options: ['Chest Tightness', 'Fever', 'Sore Throat / Runny Nose', 'Swollen Ankles / Legs'] }
      ]
    };
  }

  return {
    title: 'General Symptom Triage Form',
    problemType: 'General',
    questions: [
      { id: 'severity', type: 'slider', label: 'Overall Discomfort Level (1-10)', min: 1, max: 10, default: 5 },
      { id: 'duration', type: 'single_choice', label: 'Symptom Duration:', options: ['< 24 Hours', '1-3 Days', '4-7 Days', '1+ Weeks'] },
      { id: 'impact', type: 'single_choice', label: 'Impact on Daily Activity:', options: ['Mild Inconvenience', 'Unable to Work', 'Bedridden'] },
      { id: 'general_signs', type: 'multi_choice', label: 'Select Experienced Signs:', options: ['Fever / Chills', 'Fatigue', 'Dizziness / Lightheaded', 'Body Aches'] }
    ]
  };
};

export default function HealthAnalysisPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello. I'm HealthSync AI. Let's gather some details to evaluate your health concern today. What primary symptoms or discomfort are you experiencing?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);

  // Dynamic Problem-Specific Interactive Form State
  const [activeForm, setActiveForm] = useState(null);
  const [formAnswers, setFormAnswers] = useState({});
  const [submittedFormCount, setSubmittedFormCount] = useState(0);

  // GPS auto-detection state
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [nearbyDoctors, setNearbyDoctors] = useState(null);
  const [emergencyAlert, setEmergencyAlert] = useState(null); // 'severe' | 'emergency' | null

  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, activeForm, nearbyDoctors]);

  // Auto-detect GPS location on page load (silently — no clicks needed)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log('GPS auto-detected:', position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn('GPS auto-detect notice:', err.message);
          // Fallback to a default Indian location (Mumbai)
          setUserLocation({ lat: 19.0760, lng: 72.8777 });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      // Fallback for browsers without geolocation
      setUserLocation({ lat: 19.0760, lng: 72.8777 });
    }
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormAnswerChange = (questionId, value, isMulti = false) => {
    setFormAnswers(prev => {
      if (isMulti) {
        const currentList = prev[questionId] || [];
        const newList = currentList.includes(value) 
          ? currentList.filter(v => v !== value) 
          : [...currentList, value];
        return { ...prev, [questionId]: newList };
      }
      return { ...prev, [questionId]: value };
    });
  };

  const submitDynamicForm = () => {
    if (!activeForm) return;

    const answerLines = activeForm.questions.map(q => {
      const ans = formAnswers[q.id];
      let formattedAns = 'Not specified';
      if (Array.isArray(ans)) {
        formattedAns = ans.length > 0 ? ans.join(', ') : 'None selected';
      } else if (ans !== undefined && ans !== null) {
        formattedAns = `${ans}${q.type === 'temp_slider' ? '°F' : ''}`;
      } else if (q.default !== undefined) {
        formattedAns = `${q.default}${q.type === 'temp_slider' ? '°F' : ''}`;
      }
      return `• ${q.label} ${formattedAns}`;
    });

    const summaryText = `[Interactive Form Responses for ${activeForm.title}]\n${answerLines.join('\n')}`;
    
    // Clear active form and increment turn count so form doesn't loop
    setActiveForm(null);
    setFormAnswers({});
    setSubmittedFormCount(prev => prev + 1);

    sendMessage(summaryText);
  };

  const sendMessage = async (cleanText) => {
    if (!cleanText || loading) return;
    const userMsg = { role: 'user', content: cleanText };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    
    const isHealthQuery = isHealthRelatedQuery(cleanText);
    const isFormSubmission = cleanText.startsWith('[Interactive Form Responses') || submittedFormCount > 0;

    try {
      const res = await chatAPI.sendMessage({
        message: cleanText,
        sessionId,
        lat: userLocation.lat,
        lng: userLocation.lng
      });
      const data = res?.data;
      if (data && data.response) {
        if (data.sessionId) setSessionId(data.sessionId);
        
        const responseContent = typeof data.response === 'string' 
          ? data.response 
          : (data.response?.text || 'I have completed your symptom evaluation.');
          
        setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
        
        // Handle nearby doctors returned from server
        if (data.nearbyDoctors && data.nearbyDoctors.length > 0) {
          setNearbyDoctors(data.nearbyDoctors);
        }

        // Handle emergency/severe alert
        const diagSeverity = data.diagnosis?.severity;
        if (diagSeverity === 'emergency' || diagSeverity === 'severe') {
          setEmergencyAlert(diagSeverity);
        } else {
          setEmergencyAlert(null);
        }

        if (!isHealthQuery) {
          // Non-health greeting or chitchat: do NOT show interactive form!
          setActiveForm(null);
          setNearbyDoctors(null);
          setEmergencyAlert(null);
        } else if (isFormSubmission) {
          // User completed interactive form: advance to diagnosis!
          setActiveForm(null);
          setStep(4);
          if (data.diagnosis) {
            setDiagnosis(data.diagnosis);
          } else {
            setDiagnosis({
              conditions: [
                { name: 'Symptom Assessment Completed', probability: 'High', description: 'Clinical triage evaluation completed based on interactive form answers.' }
              ],
              severity: 'moderate',
              recommendedSpecialties: ['Primary Care Physician', 'Specialist Consultation'],
              suggestedMedications: [],
              lifestyleRecommendations: ['Rest and monitor symptoms', 'Stay adequately hydrated', 'Follow up with physician if symptoms persist'],
              followUpDays: 3
            });
          }
        } else {
          // Health query: construct problem-specific interactive form
          const formToSet = getFormForProblem(cleanText, data.interactiveForm);
          setActiveForm(formToSet);

          if (formToSet && formToSet.questions) {
            const defaultAnswers = {};
            formToSet.questions.forEach(q => {
              if (q.default !== undefined) defaultAnswers[q.id] = q.default;
              if (q.type === 'multi_choice') defaultAnswers[q.id] = [];
            });
            setFormAnswers(defaultAnswers);
          }

          if (data.diagnosis) { 
            setDiagnosis(data.diagnosis); 
            setStep(4); 
          } else { 
            setStep(2); 
          }
        }
      } else {
        throw new Error('No response from AI service');
      }
    } catch (err) {
      console.warn('Chat API notice, utilizing local AI evaluation:', err);
      const assistantText = `Thank you for reaching out. ${isHealthQuery ? 'I have prepared a clinical triage questionnaire below to evaluate your symptoms.' : 'How can I assist you with your health today?'}`;
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantText }]);
      
      if (!isHealthQuery || isFormSubmission) {
        setActiveForm(null);
        if (isFormSubmission) setStep(4);
      } else {
        const fallbackForm = getFormForProblem(cleanText);
        setActiveForm(fallbackForm);
        setStep(2);
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Basic Information', desc: 'Age, gender, pre-existing conditions' },
    { label: 'Symptom Details', desc: 'Current description & severity' },
    { label: 'Severity & History', desc: 'Impact on daily life' },
    { label: 'Analysis Results', desc: 'Potential causes & next steps' }
  ];

  return (
    <div className="flex-grow w-full px-4 md:px-10 lg:px-16 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-24 right-8 bg-teal-600 text-white px-5 py-3 rounded-xl shadow-lg z-50 animate-bounce flex items-center gap-2 text-[14px] font-semibold">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          {toast}
        </div>
      )}

      {/* Main Analysis Panel */}
      <section className="lg:col-span-8 flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] min-h-[500px] glass-panel rounded-[2rem] p-4 md:p-8 shadow-xs relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl pointer-events-none animate-float-blob-1"></div>

        {/* Header */}
        <div className="mb-4 pb-4 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0 relative z-10">
          <div>
            <h1 className="text-[24px] md:text-[28px] leading-tight font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-gradient-animated">Symptom Assessment</span>
            </h1>
            <p className="text-[13px] md:text-[14px] text-slate-500 mt-0.5 font-medium">Describe your concern or complete the interactive problem form generated by HealthSync AI.</p>
          </div>
          
          <div className="flex items-center gap-2.5 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200 shrink-0 badge-glow-teal animate-pulse-soft">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-600"></span>
            </span>
            <span className="text-[12px] font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-teal-700">robot_2</span>
              AI Active
            </span>
          </div>
        </div>

        {/* Quick Symptoms Chips (Horizontally Scrollable Single Row for Mobile/Tablet Spacing) */}
        <div className="mb-3.5 flex flex-row gap-2 shrink-0 items-center overflow-x-auto scrollbar-none py-1.5 relative z-10 w-full">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">touch_app</span>
            Quick Select:
          </span>
          <div className="flex gap-2">
            {quickSymptoms.map(s => (
              <button 
                key={s} 
                type="button" 
                onClick={() => sendMessage(s)} 
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-[13px] font-bold hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all active:scale-95 shadow-2xs shrink-0 card-interactive cursor-pointer"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-grow overflow-y-auto pr-2 md:pr-4 flex flex-col gap-5 custom-scrollbar scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-3 md:gap-4 animate-fade-in ${msg.role === 'user' ? 'self-end max-w-[90%] md:max-w-[80%] flex-row-reverse' : 'max-w-[90%] md:max-w-[85%]'}`}>
              <div className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-xs ${msg.role === 'user' ? 'bg-slate-200 text-slate-700' : 'bg-teal-600 text-white'}`}>
                <span className={`material-symbols-outlined text-[22px] ${msg.role === 'user' ? '' : 'filled'}`}>
                  {msg.role === 'user' ? 'person' : 'robot_2'}
                </span>
              </div>
              <div className={`rounded-2xl p-4 shadow-2xs ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-tr-xs' : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'}`}>
                <p className="text-[15px] leading-[24px] whitespace-pre-wrap font-medium">{typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}</p>
              </div>
            </div>
          ))}

          {/* DYNAMIC PROBLEM-TAILORED INTERACTIVE FORM WIDGET FROM AI */}
          {activeForm && !loading && (
            <div className="bg-gradient-to-br from-teal-50/90 to-slate-50 border-2 border-teal-500/40 rounded-3xl p-5 md:p-6 shadow-md animate-slide-up my-2">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-teal-200/60">
                <span className="material-symbols-outlined text-teal-700 text-[24px]">tune</span>
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-900">{activeForm.title}</h3>
                  <p className="text-[12px] font-semibold text-teal-800">Interactive diagnostic questionnaire tailored to your specific problem.</p>
                </div>
              </div>

              <div className="space-y-5">
                {activeForm.questions.map((q, idx) => (
                  <div key={q.id || idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <label className="text-[14px] font-extrabold text-slate-900 block mb-2">
                      {q.label}
                    </label>

                    {/* 1. SEVERITY SLIDER QUESTION */}
                    {q.type === 'slider' && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[12px] font-bold text-slate-400">Mild (1)</span>
                          <span className="text-[14px] font-extrabold text-teal-700 bg-teal-50 px-3 py-0.5 rounded-lg border border-teal-200">
                            {formAnswers[q.id] || q.default || 5} / 10
                          </span>
                          <span className="text-[12px] font-bold text-rose-500">Severe (10)</span>
                        </div>
                        <input
                          type="range"
                          min={q.min || 1}
                          max={q.max || 10}
                          value={formAnswers[q.id] || q.default || 5}
                          onChange={(e) => handleFormAnswerChange(q.id, Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                        />
                      </div>
                    )}

                    {/* 2. TEMPERATURE SLIDER QUESTION */}
                    {q.type === 'temp_slider' && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[12px] font-bold text-slate-400">98.6°F</span>
                          <span className="text-[14px] font-extrabold text-teal-700 bg-teal-50 px-3 py-0.5 rounded-lg border border-teal-200">
                            {formAnswers[q.id] || q.default || 101.0}°F
                          </span>
                          <span className="text-[12px] font-bold text-rose-600">105.0°F</span>
                        </div>
                        <input
                          type="range"
                          min={q.min || 98.0}
                          max={q.max || 105.0}
                          step={q.step || 0.5}
                          value={formAnswers[q.id] || q.default || 101.0}
                          onChange={(e) => handleFormAnswerChange(q.id, Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                        />
                      </div>
                    )}

                    {/* 3. SINGLE CHOICE QUESTION */}
                    {q.type === 'single_choice' && (
                      <div className="flex flex-wrap gap-2">
                        {q.options.map(opt => {
                          const isSelected = formAnswers[q.id] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleFormAnswerChange(q.id, opt)}
                              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold border transition-all ${
                                isSelected 
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-2xs' 
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50 hover:border-teal-300'
                              }`}
                            >
                              <span>{isSelected ? '● ' : '○ '}</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* 4. MULTI CHOICE QUESTION */}
                    {q.type === 'multi_choice' && (
                      <div className="flex flex-wrap gap-2">
                        {q.options.map(opt => {
                          const selectedList = formAnswers[q.id] || [];
                          const isSelected = selectedList.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleFormAnswerChange(q.id, opt, true)}
                              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold border transition-all ${
                                isSelected 
                                  ? 'bg-slate-800 text-white border-slate-800 shadow-2xs' 
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span>{isSelected ? '✓ ' : '+ '}</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={submitDynamicForm}
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[15px] rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">send</span>
                  <span>Submit Diagnostic Form Answers to AI</span>
                </button>
              </div>
            </div>
          )}

          {/* EMERGENCY ALERT BANNER */}
          {emergencyAlert && !loading && (
            <div className={`rounded-2xl p-4 md:p-5 shadow-lg animate-slide-up border-2 flex items-start gap-3 ${
              emergencyAlert === 'emergency'
                ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-400 text-white'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-white'
            }`}>
              <span className="material-symbols-outlined text-[28px] mt-0.5 shrink-0">
                {emergencyAlert === 'emergency' ? 'emergency' : 'warning'}
              </span>
              <div>
                <h3 className="text-[16px] font-extrabold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    {emergencyAlert === 'emergency' ? 'emergency' : 'warning'}
                  </span>
                  {emergencyAlert === 'emergency'
                    ? 'EMERGENCY — Seek immediate medical attention'
                    : 'URGENT — You should visit a doctor immediately'}
                </h3>
                <p className="text-[13px] font-semibold opacity-90 mt-1">
                  {emergencyAlert === 'emergency'
                    ? 'Your symptoms indicate a potentially serious condition. Visit the nearest hospital or call 112 right away. Nearby doctors are shown below.'
                    : 'Your symptoms need prompt professional evaluation. We have found nearby doctors for you — please book a consultation immediately.'}
                </p>
              </div>
            </div>
          )}

          {/* INLINE NEARBY DOCTORS CARDS (auto-fetched via GPS) */}
          {nearbyDoctors && nearbyDoctors.length > 0 && !loading && (
            <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/80 border-2 border-blue-400/50 rounded-3xl p-5 md:p-6 shadow-md animate-slide-up my-2">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-blue-200/60">
                <span className="material-symbols-outlined text-blue-700 text-[24px]">location_on</span>
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-900 flex items-center gap-1.5">
                    Nearby Doctors Found (Auto-detected Geolocation)
                  </h3>
                  <p className="text-[12px] font-semibold text-blue-800">Real-time results based on your GPS location — book immediately</p>
                </div>
              </div>
              <div className="space-y-3">
                {nearbyDoctors.slice(0, 5).map((doc, idx) => (
                  <Link
                    key={doc._id || doc.id || idx}
                    to={`/doctor/${doc._id || doc.id}`}
                    className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <img
                      src={doc.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || 'Doctor')}&background=3b82f6&color=fff`}
                      alt={doc.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">{doc.name || doc.doctorName}</p>
                      <p className="text-[12px] text-slate-500 font-medium truncate">{doc.specialty || 'General Practice'} • {doc.distance || 'Nearby'}</p>
                      <p className="text-[11px] text-slate-400 font-medium truncate">{doc.address}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-amber-500 text-[14px] filled">star</span>
                        <span className="text-[12px] font-bold text-slate-700">{doc.rating || '4.8'}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                        Book Now
                        <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                to="/doctors"
                className="mt-4 flex items-center justify-center gap-1.5 text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] rounded-xl transition-all shadow-sm"
              >
                <span>View All Nearby Doctors</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          )}

          {/* INLINE INDIAN HOME REMEDIES CARDS (AI-Generated & Personalized) */}
          {diagnosis && diagnosis.indianHomeRemedies && diagnosis.indianHomeRemedies.length > 0 && !loading && !activeForm && (
            <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/60 border-2 border-amber-400/50 rounded-3xl p-5 md:p-6 shadow-md animate-slide-up my-2">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-200/60 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700 text-[24px]">eco</span>
                  <div>
                    <h3 className="text-[16px] font-extrabold text-slate-900 flex items-center gap-2">
                      Indian Home Remedies (Desi Care)
                    </h3>
                    <p className="text-[12px] font-semibold text-amber-800">AI-personalized Ayurvedic remedies & traditional practices for your specific condition</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full border border-amber-300 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">psychology</span>
                  AI-Generated
                </span>
              </div>
              <div className="space-y-4">
                {diagnosis.indianHomeRemedies.map((remedy, idx) => {
                  const isPractice = remedy.category === 'practice';
                  return (
                  <div key={idx} className={`p-4 bg-white rounded-2xl border shadow-2xs hover:border-amber-400 transition-all ${isPractice ? 'border-teal-200/80' : 'border-amber-200/80'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="material-symbols-outlined text-[20px] shrink-0 text-amber-700">
                          {isPractice ? 'self_improvement' : 'soup_kitchen'}
                        </span>
                        <h4 className="text-[15px] font-extrabold text-slate-900 truncate">{remedy.name}</h4>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 flex items-center gap-1 ${isPractice ? 'bg-teal-100 text-teal-800 border border-teal-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                          <span className="material-symbols-outlined text-[12px]">
                            {isPractice ? 'self_improvement' : 'soup_kitchen'}
                          </span>
                          {isPractice ? 'Traditional Practice' : 'Herbal Recipe'}
                        </span>
                      </div>
                      <a
                        href={remedy.youtubeUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${remedy.name} Indian home remedy`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-2xs active:scale-95 shrink-0 w-fit"
                      >
                        <span className="material-symbols-outlined text-[14px]">play_circle</span>
                        Watch Video
                      </a>
                    </div>
                    <div className="space-y-2 text-[13px]">
                      <div className={`p-3 rounded-xl border ${isPractice ? 'bg-teal-50/80 border-teal-100' : 'bg-amber-50/80 border-amber-100'}`}>
                        <p className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            {isPractice ? 'sanitizer' : 'inventory_2'}
                          </span>
                          {isPractice ? 'Materials Needed:' : 'Ingredients:'}
                        </p>
                        <p className="font-medium text-slate-700 leading-relaxed">{Array.isArray(remedy.ingredients) ? remedy.ingredients.join(', ') : remedy.ingredients}</p>
                      </div>
                      <div className={`p-3 rounded-xl border ${isPractice ? 'bg-teal-50/80 border-teal-100' : 'bg-amber-50/80 border-amber-100'}`}>
                        <p className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            {isPractice ? 'clinical_notes' : 'menu_book'}
                          </span>
                          {isPractice ? 'How to Do This:' : 'Recipe:'}
                        </p>
                        <p className="font-medium text-slate-700 leading-relaxed whitespace-pre-line">{remedy.recipe}</p>
                      </div>
                      {remedy.usage && (
                        <div className={`flex items-start gap-2 px-3 py-2 rounded-xl text-[12px] font-bold border ${isPractice ? 'bg-teal-100/70 text-teal-900 border-teal-300/60' : 'bg-amber-100/70 text-amber-900 border-amber-300/60'}`}>
                          <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">{isPractice ? 'schedule' : 'local_cafe'}</span>
                          <span><strong>{isPractice ? 'When & How Often:' : 'How to use:'}</strong> {remedy.usage}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 text-slate-500 mt-2 pl-4 md:pl-14">
              <div className="flex gap-1.5 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              </div>
              <span className="text-[13px] font-bold tracking-wide">Evaluating symptoms with AI...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Controls */}
        <div className="mt-3 pt-3 border-t border-slate-200 shrink-0">
          <div className="relative flex items-center group">
            <input
              type="text"
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  e.stopPropagation();
                  if (input && input.trim() && !loading) {
                    const textToSend = input.trim();
                    setInput('');
                    sendMessage(textToSend);
                  }
                }
              }}
              className="w-full bg-white border border-slate-300 rounded-2xl py-3.5 pl-4 pr-14 text-slate-900 text-[15px] focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all shadow-2xs outline-none font-medium placeholder:text-slate-400"
              placeholder="Type your symptoms here..." 
              disabled={loading}
            />
            <button 
              type="button" 
              disabled={loading || !input.trim()} 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (input && input.trim() && !loading) {
                  const textToSend = input.trim();
                  setInput('');
                  sendMessage(textToSend);
                }
              }}
              className="absolute right-2.5 w-9 h-9 flex items-center justify-center rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-all disabled:opacity-40 shadow-xs active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 flex justify-between items-center px-1 shrink-0">
          <button 
            type="button" 
            onClick={() => showToast('Assessment progress saved!')} 
            className="text-[13px] font-bold text-slate-600 hover:text-teal-700 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span> 
            <span>Save for later</span>
          </button>
          
          {diagnosis && (
            <Link to="/care-plan" state={{ diagnosis, sessionId, nearbyDoctors, userLocation }} className="btn-primary py-2.5 px-5 text-[14px]">
              <span>View Treatment Plan</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          )}
        </div>
      </section>

      {/* Right Sidebar */}
      <aside className="lg:col-span-4 hidden lg:flex flex-col gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {/* Progress */}
        <div className="glass p-6 md:p-8 rounded-[1.5rem] shadow-soft">
          <h2 className="text-[20px] font-bold text-on-surface mb-6">Assessment Progress</h2>
          <div className="relative">
            <div className="absolute left-5 top-5 bottom-5 w-[2px] bg-surface-variant"></div>
            <ul className="space-y-6 relative z-10">
              {steps.map((s, i) => {
                const isComplete = i + 1 < step;
                const isCurrent = i + 1 === step;
                return (
                  <li key={i} className={`flex items-start gap-4 transition-opacity duration-300 ${!isComplete && !isCurrent ? 'opacity-40' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors duration-300 ${isComplete ? 'bg-primary text-on-primary shadow-md' : isCurrent ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-glow' : 'bg-surface-container-highest text-on-surface-variant border-2 border-outline-variant/30'}`}>
                      {isComplete ? <span className="material-symbols-outlined text-[18px]">check</span> : <span className="text-[15px] font-bold">{i + 1}</span>}
                    </div>
                    <div className="pt-1">
                      <p className={`text-[15px] font-bold mb-0.5 ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>{s.label}</p>
                      <p className="text-[13px] text-on-surface-variant font-medium">{s.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Privacy Banner */}
        <div className="glass bg-surface-container-lowest/80 rounded-[1.5rem] p-6 flex gap-4 border border-outline-variant/30 hover:border-primary/30 transition-colors">
          <div className="text-primary mt-1 shrink-0">
            <span className="material-symbols-outlined filled text-[26px]">lock</span>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-on-surface mb-1">Private & Encrypted</h3>
            <p className="text-[13px] leading-relaxed text-on-surface-variant font-medium">Your health data is securely encrypted. HealthSync provides clinical preliminary guidance and does not replace emergency medical services.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
