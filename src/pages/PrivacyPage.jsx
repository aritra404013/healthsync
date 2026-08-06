export default function PrivacyPage() {
  return (
    <div className="w-full px-4 md:px-10 lg:px-16 py-12 max-w-4xl mx-auto">
      <div className="mb-10 text-center animate-fade-in">
        <span className="px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-extrabold uppercase tracking-wider border border-teal-200/60 badge-glow-teal inline-block mb-3">
          Compliance & Legal
        </span>
        <h1 className="text-[32px] md:text-[40px] leading-tight font-black text-slate-900 text-gradient-animated">
          Privacy Policy
        </h1>
        <p className="text-[14px] text-slate-500 font-semibold mt-2">
          Effective Date: August 1, 2026 | Last Updated: August 7, 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-soft card-interactive space-y-8 text-[14px] text-slate-700 leading-relaxed font-semibold">
        
        <section className="space-y-3">
          <h2 className="text-[20px] font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-teal-600">1.</span> Corporate Commitment & Scope
          </h2>
          <p>
            HealthSync AI (owned and operated by HealthSync Systems Private Limited, hereinafter referred to as "the Company", "we", "us", or "our") has maintained an unwavering commitment to patient data integrity, confidentiality, and security for decades. This Privacy Policy outlines the frameworks we use to collect, process, encrypt, store, and dispose of your personal, medical, and geolocation data.
          </p>
          <p>
            This policy is compliant with the **Health Insurance Portability and Accountability Act (HIPAA)**, the **Digital Personal Data Protection (DPDP) Act, 2023 (India)**, and other applicable regional digital healthcare privacy regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[20px] font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-teal-600">2.</span> Types of Data Collected
          </h2>
          <p>
            In order to provide our adaptive AI Symptom Triage, Ayurvedic care matching, and geolocation-based medical clinic searches, we collect the following classes of data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account Registration Details:</strong> Full name, registered email address, telephone contact details, password hashes, and user-selected custom profile avatars.
            </li>
            <li>
              <strong>Clinical Assessment Logs:</strong> Input symptoms (such as body temperature, headache severity, duration, and associated discomforts), diagnostic responses, AI-triage classifications, and saved care plans.
            </li>
            <li>
              <strong>Precise Geolocation Data:</strong> Real-time GPS coordinates (latitude & longitude) acquired from your browser or device location APIs (solely utilized to execute TOMTOM and OSM local doctor searches).
            </li>
            <li>
              <strong>Usage Information:</strong> Device models, browser configurations, operating system versions, and interaction timings across portals.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-[20px] font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-teal-600">3.</span> Purpose & Legal Basis for Processing
          </h2>
          <p>
            We process your data strictly under the following legal bases:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Explicit Consent:</strong> By typing your symptoms, consenting to GPS retrieval, and executing assessments, you grant us consent to process clinical symptoms to generate care recommendations.
            </li>
            <li>
              <strong>Performance of Service Contract:</strong> Processing account info to host and save your treatment history under your personal profile dashboard.
            </li>
            <li>
              <strong>Medical Vital Interests:</strong> In emergency situations, processing data to warn users of high clinical severity levels and display local emergency contacts.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-[20px] font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-teal-600">4.</span> Data Security & Encryption Standards
          </h2>
          <p>
            HealthSync AI implements institutional-grade, multi-layer encryption controls to safeguard health data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Data in Transit:</strong> All communications between your device browser and our servers are encrypted using **TLS 1.3** transport protocols.
            </li>
            <li>
              <strong>Data at Rest:</strong> Patient profiles, passwords, and clinical care plan records stored in our MongoDB cloud instances are encrypted using **AES-256** standards.
            </li>
            <li>
              <strong>Anonymized Logs:</strong> Geolocation coordinates are processed in-memory and are never permanently stored on servers linked directly to your static identification records.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-[20px] font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-teal-600">5.</span> Patient Data Rights
          </h2>
          <p>
            Under the DPDP Act (India) and GDPR, you have the following enforceable rights over your digital personal data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Right to Access:</strong> Retrieve a complete copy of your saved treatment plans and assessment logs.
            </li>
            <li>
              <strong>Right to Correction/Erasure:</strong> Request the correction of details or the permanent deletion of your profile history.
            </li>
            <li>
              <strong>Right to Withdraw Consent:</strong> Revoke geolocation access or close your profile at any time.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-[20px] font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-teal-600">6.</span> DPO Contact Information
          </h2>
          <p>
            If you have questions, compliance audits, or requests regarding this Privacy Policy, please contact our Data Protection Officer:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[13px] space-y-1">
            <p className="text-slate-950 font-black">Data Protection Officer (DPO)</p>
            <p className="text-slate-500">HealthSync Systems Legal Department</p>
            <p className="text-slate-500">Email: <a href="mailto:dpo@healthsync.ai" className="text-teal-700 hover:underline">dpo@healthsync.ai</a></p>
          </div>
        </section>

      </div>
    </div>
  );
}
