import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('support');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setToast('Message sent successfully! Our clinical support team will respond within 12 hours.');
      setName('');
      setEmail('');
      setMessage('');
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }, 1200);
  };

  return (
    <div className="w-full px-4 md:px-10 lg:px-16 py-12 relative">
      {/* Toast feedback */}
      {toast && (
        <div className="fixed top-24 right-8 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-xl z-50 animate-bounce flex items-center gap-2 text-[14px] font-semibold border border-slate-700 max-w-sm">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto animate-fade-in">
        <span className="px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[12px] font-extrabold uppercase tracking-wider border border-teal-200/60 badge-glow-teal inline-block mb-3">
          Contact Us
        </span>
        <h1 className="text-[32px] md:text-[40px] leading-tight font-black text-slate-900 text-gradient-animated">
          Get in Touch
        </h1>
        <p className="text-[15px] text-slate-500 font-semibold mt-2">
          Have queries about symptom analysis, corporate licensing, or medical partnerships? Contact our compliance and clinical support desks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left Column: Corporate Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft card-interactive space-y-5">
            <h2 className="text-[18px] font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">apartment</span>
              Corporate Headquarters
            </h2>
            <div className="space-y-4 text-[13.5px] text-slate-700 font-semibold">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-teal-600 mt-0.5 shrink-0">location_on</span>
                <div>
                  <p className="text-slate-950 font-black">HealthSync AI Corporate Office</p>
                  <p className="text-slate-500 font-medium mt-0.5 leading-relaxed">
                    Level 12, Tower B, Godrej BKC, Bandra Kurla Complex,<br />
                    Mumbai, Maharashtra - 400051, India
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 pt-2">
                <span className="material-symbols-outlined text-teal-600 mt-0.5 shrink-0">call</span>
                <div>
                  <p className="text-slate-950 font-black">Phone Lines</p>
                  <p className="text-slate-500 font-medium mt-0.5">+91 (22) 6902-8800 (Corporate desk)</p>
                  <p className="text-slate-500 font-medium">+91 (22) 6902-8811 (Clinical emergency triage support)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <span className="material-symbols-outlined text-teal-600 mt-0.5 shrink-0">mail</span>
                <div>
                  <p className="text-slate-950 font-black">Email Communications</p>
                  <p className="text-teal-700 font-bold hover:underline mt-0.5"><a href="mailto:support@healthsync.ai">support@healthsync.ai</a></p>
                  <p className="text-teal-700 font-bold hover:underline"><a href="mailto:partnerships@healthsync.ai">partnerships@healthsync.ai</a></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft card-interactive space-y-4">
            <h3 className="text-[16px] font-extrabold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">shield</span>
              Regulatory & Data Compliance
            </h3>
            <p className="text-[13px] text-slate-600 leading-relaxed font-semibold">
              Our clinical algorithms are HIPAA & DPDP Act compliant. For legal, data retrieval, or grievance concerns, contact our designated Grievance Officer:
            </p>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-[12.5px] text-slate-700 font-semibold space-y-1">
              <p className="text-slate-950 font-black">Dr. K. R. Nair (Grievance Officer)</p>
              <p className="text-slate-500">Legal & Data Privacy Department</p>
              <p className="text-teal-700 hover:underline"><a href="mailto:compliance@healthsync.ai">compliance@healthsync.ai</a></p>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-soft card-interactive space-y-5">
          <h2 className="text-[18px] font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600">rate_review</span>
            Send Message
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[14px] text-slate-900 font-semibold focus:bg-white focus:border-teal-600 outline-none transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[14px] text-slate-900 font-semibold focus:bg-white focus:border-teal-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Purpose of Inquiry</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[14px] text-slate-900 font-bold focus:bg-white focus:border-teal-600 outline-none transition-all"
            >
              <option value="support">Patient Portal & App Support</option>
              <option value="partnership">Hospital & Doctor Partnerships</option>
              <option value="privacy">DPDP / Data Privacy Grievance</option>
              <option value="enterprise">API Integration & Corporate Licensing</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Message Description</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your inquiry details..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[14px] text-slate-900 font-semibold focus:bg-white focus:border-teal-600 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-700/60 text-white font-extrabold text-[14px] py-3.5 rounded-xl shadow-md transition-all active:scale-98"
          >
            {loading ? 'Sending Request...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}
