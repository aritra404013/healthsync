import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t border-outline-variant">
      <div className="w-full py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined filled text-primary">ecg_heart</span>
          <span className="text-[20px] font-semibold text-primary">HealthSync AI</span>
        </div>
        <p className="text-[14px] text-on-surface-variant text-center md:text-left">
          © 2026 HealthSync AI. Precise. Calm. Reliable.
        </p>
        <nav className="flex gap-6">
          <Link className="text-[12px] font-bold text-on-surface-variant hover:text-primary transition-colors" to="/contact">Contact Info</Link>
          <Link className="text-[12px] font-bold text-on-surface-variant hover:text-primary transition-colors" to="/privacy">Privacy Policy</Link>
          <Link className="text-[12px] font-bold text-on-surface-variant hover:text-primary transition-colors" to="/terms">Terms of Service</Link>
        </nav>
      </div>
    </footer>
  );
}
