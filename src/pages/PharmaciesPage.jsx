import { useState, useEffect, useRef } from 'react';
import { pharmaciesAPI, doctorsAPI } from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import RealMapView from '../components/RealMapView';

const fallbackPharmacies = [
  { _id: 'pharm1', name: 'CVS Pharmacy #4829', address: '500 Lexington Ave, New York, NY 10017', phone: '(212) 555-0192', distance: '0.3', is24hr: true, hours: 'Open 24 Hours', filter: '24hr', lat: 40.756, lng: -73.974 },
  { _id: 'pharm2', name: 'Walgreens Pharmacy', address: '148 E 86th St, New York, NY 10028', phone: '(212) 555-0348', distance: '0.6', is24hr: false, hours: 'Open until 10:00 PM', filter: 'delivery', lat: 40.779, lng: -73.955 },
  { _id: 'pharm3', name: 'Duane Reade Pharmacy', address: '1251 Avenue of the Americas, New York, NY 10020', phone: '(212) 555-0982', distance: '0.8', is24hr: true, hours: 'Open 24 Hours', filter: '24hr', lat: 40.759, lng: -73.982 },
  { _id: 'pharm4', name: 'Metro Health Pharmacy', address: '920 2nd Ave, New York, NY 10017', phone: '(212) 555-0411', distance: '1.2', is24hr: false, hours: 'Open until 9:00 PM', filter: 'delivery', lat: 40.751, lng: -73.971 }
];

const fallbackDoctors = [
  { _id: 'doc1', id: 'doc1', name: 'Dr. Sarah Jenkins', specialty: 'General Practice', address: '742 Park Avenue, Suite 400, New York, NY 10021', phone: '(212) 555-0182', distance: '0.4', rating: 4.9, reviewCount: 128, lat: 40.771, lng: -73.963 },
  { _id: 'doc2', id: 'doc2', name: 'Dr. Michael Chen', specialty: 'Neurology Specialist', address: '680 Madison Ave, New York, NY 10065', phone: '(212) 555-0492', distance: '0.7', rating: 4.8, reviewCount: 94, lat: 40.765, lng: -73.971 },
  { _id: 'doc3', id: 'doc3', name: 'Dr. Elena Rostova', specialty: 'Internal Medicine', address: '1000 5th Ave, New York, NY 10028', phone: '(212) 555-0721', distance: '1.1', rating: 4.9, reviewCount: 210, lat: 40.779, lng: -73.962 },
  { _id: 'doc4', id: 'doc4', name: 'Dr. James Wilson', specialty: 'Cardiology', address: '525 E 68th St, New York, NY 10065', phone: '(212) 555-0391', distance: '1.5', rating: 4.9, reviewCount: 156, lat: 40.764, lng: -73.954 }
];

export default function PharmaciesPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isDoctors = pathname.includes('doctor');
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const [userLoc, setUserLoc] = useState({ lat: 40.7128, lng: -74.0060 });
  const itemRefs = useRef({});

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log('Using default location')
      );
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (isDoctors) {
          const { data } = await doctorsAPI.getNearby({ lat: userLoc.lat, lng: userLoc.lng, radius: 5000 });
          const combined = [...(data.dbDoctors || []), ...(data.nearbyResults || [])];
          setResults(combined.length > 0 ? combined : fallbackDoctors);
        } else {
          const { data } = await pharmaciesAPI.getNearby({ lat: userLoc.lat, lng: userLoc.lng, radius: 5000, filter: filter !== 'all' ? filter : undefined });
          const combined = [...(data.dbPharmacies || []), ...(data.nearbyResults || [])];
          setResults(combined.length > 0 ? combined : fallbackPharmacies);
        }
      } catch (e) {
        setResults(isDoctors ? fallbackDoctors : fallbackPharmacies);
      }
      setLoading(false);
    };
    load();
  }, [userLoc, isDoctors, filter]);

  const filteredResults = results.filter(r => 
    r.name?.toLowerCase().includes(search.toLowerCase()) || 
    r.address?.toLowerCase().includes(search.toLowerCase()) ||
    r.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectItem = (id) => {
    setSelectedId(id);
    if (itemRefs.current[id]) {
      itemRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="flex-grow flex flex-col lg:flex-row relative min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] overflow-hidden">
      {/* List View */}
      <section className="w-full lg:w-1/3 xl:w-[480px] h-full bg-surface flex flex-col z-20 border-r border-outline-variant/30 relative shadow-soft">
        <div className="p-5 md:p-6 bg-surface-container-lowest/90 backdrop-blur-md z-10 flex-shrink-0 border-b border-surface-variant/50">
          <h1 className="text-[26px] md:text-[28px] font-extrabold text-on-surface mb-4 tracking-tight">
            {isDoctors ? 'Find Nearby Doctors' : 'Nearby Pharmacies'}
          </h1>
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
            <input 
              value={search} onChange={(e) => setSearch(e.target.value)}
              type="text" placeholder={isDoctors ? "Search doctor name or specialty..." : "Search pharmacy name or address..."} 
              className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-2xl py-3.5 pl-12 pr-4 text-[14px] font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-outline/70"
            />
          </div>
          {!isDoctors && (
            <div className="flex gap-2 mt-4 overflow-x-auto scroll-hidden pb-1 snap-x">
              {['all', 'open', '24hr', 'delivery'].map(f => (
                <button 
                  key={f} onClick={() => setFilter(f)}
                  className={`shrink-0 snap-start text-[12px] font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 ${filter === f ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-low text-secondary border border-surface-variant/50 hover:bg-surface-variant hover:text-on-surface'}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1).replace('hr', ' Hours')}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex-grow overflow-y-auto p-4 md:p-5 space-y-4 custom-scrollbar bg-surface-container-lowest/30">
          {loading ? (
            <div className="flex justify-center py-16"><span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span></div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-14 px-6 bg-surface-container-lowest/50 rounded-2xl border border-dashed border-outline-variant/50 mt-4">
              <span className="material-symbols-outlined text-outline/50 text-[48px] mb-3 block">location_off</span>
              <p className="text-[15px] font-medium text-on-surface-variant">No matching locations found.</p>
            </div>
          ) : (
            filteredResults.map((item, i) => {
              const itemId = item._id || item.id || `item_${i}`;
              const isSelected = selectedId === itemId;
              return (
                <article 
                  key={itemId} 
                  ref={el => itemRefs.current[itemId] = el}
                  onClick={() => setSelectedId(itemId)}
                  className={`p-5 rounded-[1.5rem] transition-all duration-300 cursor-pointer border relative overflow-hidden group animate-slide-up ${
                    isSelected 
                      ? 'bg-surface-container-lowest border-primary shadow-glow ring-2 ring-primary/20' 
                      : 'glass shadow-sm hover:shadow-soft border-surface-variant/50 hover:border-primary/40'
                  }`} 
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex justify-between items-start mb-2 gap-3">
                    <h3 className="text-[17px] leading-[22px] font-bold text-on-surface group-hover:text-primary transition-colors">{item.name}</h3>
                    <span className="bg-primary/10 text-primary text-[12px] font-bold px-2.5 py-1 rounded-lg shrink-0 border border-primary/20">{item.distance || '0.5'} mi</span>
                  </div>
                  <p className="text-[13px] text-on-surface-variant font-medium mb-3">{item.address}</p>
                  
                  {isDoctors ? (
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px] bg-primary/10 p-1 rounded-md">medical_services</span>
                        <span className="text-[13px] font-bold text-on-surface-variant">{item.specialty || 'General Practice'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[12px] font-bold text-amber-600">
                        <span className="material-symbols-outlined text-[16px] filled text-amber-500">star</span>
                        <span>{item.rating || 4.9}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`material-symbols-outlined text-[18px] p-1 rounded-md ${item.is24hr ? 'text-primary bg-primary/10' : 'text-secondary bg-surface-variant/50'}`}>{item.is24hr ? 'check_circle' : 'schedule'}</span>
                      <span className={`text-[13px] font-bold ${item.is24hr ? 'text-primary' : 'text-secondary'}`}>{item.is24hr ? 'Open 24 Hours' : (item.hours || 'Open until 9:00 PM')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-2 pt-3 border-t border-surface-variant/40">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address || item.name)}`} 
                      target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary text-[13px] font-bold flex items-center gap-1 hover:underline"
                    >
                      <span className="material-symbols-outlined text-[18px]">directions</span> Directions
                    </a>

                    {isDoctors ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/doctor/${item._id || item.id || 'doc1'}`); }}
                        className="bg-primary text-on-primary text-[12px] font-bold px-4 py-2 rounded-xl transition-all shadow-sm hover:bg-primary-container"
                      >
                        Book Appointment
                      </button>
                    ) : (
                      <a 
                        href={`tel:${item.phone?.replace(/[^0-9]/g, '') || '2125550192'}`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-surface-container-highest text-primary hover:bg-primary hover:text-on-primary text-[12px] font-bold px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">call</span> {item.phone || 'Call'}
                      </a>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* Real Interactive Map View */}
      <section className="hidden lg:block lg:w-2/3 xl:w-[calc(100%-480px)] relative bg-slate-100 p-3">
        <RealMapView
          items={filteredResults}
          userLoc={userLoc}
          selectedId={selectedId}
          onSelectItem={handleSelectItem}
          isDoctors={isDoctors}
        />
      </section>
    </div>
  );
}
