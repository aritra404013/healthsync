export default function TermsPage() {
  return (
    <div className="w-full px-4 md:px-10 lg:px-16 py-12 max-w-4xl mx-auto">
      <div className="mb-10 text-center animate-fade-in">
        <span className="px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-extrabold uppercase tracking-wider border border-teal-200/60 badge-glow-teal inline-block mb-3">
          Compliance & Legal
        </span>
        <h1 className="text-[32px] md:text-[40px] leading-tight font-black text-slate-900 text-gradient-animated">
          Terms of Service
        </h1>
        <p className="text-[14px] text-slate-500 font-semibold mt-2">
          Effective Date: August 1, 2026 | Last Updated: August 7, 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-soft card-interactive space-y-8 text-[14px] text-slate-700 leading-relaxed font-semibold">
        
        <section className="space-y-3">
          <h2 className="text-[20px] font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-teal-600">1.</span> Agreement & Binding Scope
          </h2>
          <p>
            Welcome to HealthSync AI. These Terms of Service ("Terms") constitute a legally binding agreement between you and HealthSync Systems Private Limited ("the Company", "we", "us", "our") governing your access to and use of the HealthSync AI web applications, symptom triage tools, portals, and diagnostic assessment services (collectively, "the Services").
          </p>
          <p>
            By registering an account, completing symptom questionnaires, or browsing the platform, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must immediately cease accessing the Services.
          </p>
        </section>

        <section className="space-y-3 bg-amber-50/50 p-5 rounded-2xl border border-amber-200/60">
          <h2 className="text-[20px] font-black text-amber-900 flex items-center gap-2 border-b border-amber-200 pb-2">
            ⚠️ Medical Disclaimer & Emergency Protocols
          </h2>
          <p className="text-amber-900">
            <strong>HEALTHSYNC AI DOES NOT PROVIDE PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT.</strong> The artificial intelligence algorithms, symptom evaluations, Ayurvedic suggestions, and geographical provider mappings generated through the Services are for clinical preliminary informational guidance and informational purposes only.
          </p>
          <p className="text-amber-900">
            Our services are not intended to be a substitute for the diagnosis, advice, or treatment of a qualified healthcare professional. Do not ignore or delay seeking professional medical advice because of any clinical evaluations shown on this site.
          </p>
          <p className="text-amber-900 font-black">
            IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, SUFFERING SEVERE SYMPTOMS (SUCH AS HIGH FEVER ABOVE 104°F, CHEST PAIN, OR SHORTNESS OF BREATH), IMMEDIATELY CALL YOUR LOCAL EMERGENCY SERVICES (102 OR 112 IN INDIA, 911 IN THE USA) OR RUSH TO THE NEAREST CLINIC/HOSPITAL.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[20px] font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-teal-600">2.</span> Account Security & Patient Responsibilities
          </h2>
          <p>
            To use certain features of the Patient Portal, including saving AI treatment plans and viewing booked appointments, you must create a secure password-protected account. You agree to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide accurate, complete, and current registration information.</li>
            <li>Maintain the absolute confidentiality of your credentials and password.</li>
            <li>Promptly notify us of any unauthorized use or suspect activity on your account.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-[20px] font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-teal-600">3.</span> Acceptable Use & Conduct Guidelines
          </h2>
          <p>
            You are granted a non-exclusive, non-transferable, revocable license to access our Services for personal, non-commercial health logging. You agree NOT to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Input false, malicious, or misleading symptom profiles designed to trick the clinical logic or spam our APIs.</li>
            <li>Attempt to decompile, reverse-engineer, or scan our server routes and AI processing engines for vulnerabilities.</li>
            <li>Spam appointments booking requests with no intention of consulting the matched medical specialists.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-[20px] font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-teal-600">4.</span> Limitation of Liability & Indemnification
          </h2>
          <p>
            To the maximum extent permitted by applicable law, HealthSync Systems Private Limited, its directors, officers, medical consultants, AI model providers, and partners shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your reliance on the AI care plans, Ayurvedic remedies, or doctor consultations matched through the portal.
          </p>
          <p>
            You agree to indemnify and hold harmless the Company and its clinical advisors from any claims, losses, or legal liabilities arising from your breach of these Terms or your misuse of the Services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[20px] font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-teal-600">5.</span> Governing Law & Jurisdiction
          </h2>
          <p>
            These Terms, their interpretation, performance, and any disputes arising hereunder shall be governed by and construed in accordance with the laws of the Republic of India.
          </p>
          <p>
            Any legal suit, action, or proceeding arising out of or related to these Terms shall be instituted exclusively in the competent courts of **Mumbai, Maharashtra, India**.
          </p>
        </section>

      </div>
    </div>
  );
}
