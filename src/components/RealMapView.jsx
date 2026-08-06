import { useEffect, useRef } from 'react';

export default function RealMapView({ items = [], userLoc = { lat: 19.0760, lng: 72.8777 }, selectedId = null, onSelectItem = null, isDoctors = false }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // Make sure Leaflet script is loaded
    if (!window.L || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map instance
      const map = window.L.map(mapRef.current, {
        center: [userLoc.lat || 19.0760, userLoc.lng || 72.8777],
        zoom: 13,
        zoomControl: false
      });

      // Add real map tile layer (OpenStreetMap / CartoDB Voyager tiles)
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Add Zoom Control at top right
      window.L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    // Filter valid items with coordinates
    const validItems = items.filter(it => it && (it.lat || it.location?.coordinates));

    if (validItems.length === 0) return;

    const bounds = [];

    // Add User Location Marker
    if (userLoc.lat && userLoc.lng) {
      const userIcon = window.L.divIcon({
        className: 'user-pulse-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; background: rgba(13, 148, 136, 0.3); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 16px; height: 16px; background: #0d9488; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const userMarker = window.L.marker([userLoc.lat, userLoc.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<strong style="font-size: 13px;">📍 Your Current Location</strong>');
      
      markersRef.current['user_loc'] = userMarker;
      bounds.push([userLoc.lat, userLoc.lng]);
    }

    // Add Markers for Real Doctors / Pharmacies
    validItems.forEach((item, index) => {
      const itemId = item._id || item.id || `item_${index}`;
      const lat = item.lat || (item.location?.coordinates ? item.location.coordinates[1] : null);
      const lng = item.lng || (item.location?.coordinates ? item.location.coordinates[0] : null);

      if (!lat || !lng) return;

      bounds.push([lat, lng]);

      const isSelected = selectedId === itemId;
      const iconSymbol = isDoctors ? 'stethoscope' : 'local_pharmacy';
      const bgColor = isSelected ? '#0f766e' : '#0284c7';

      const customIcon = window.L.divIcon({
        className: `custom-poi-marker ${isSelected ? 'selected' : ''}`,
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: ${bgColor};
            color: white;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
            transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
          ">
            <span className="material-symbols-outlined" style="font-size: 20px;">${iconSymbol}</span>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const popupContent = `
        <div style="font-family: inherit; padding: 4px; max-width: 220px;">
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">${item.name}</div>
          <div style="font-size: 12px; font-weight: 600; color: #0d9488; margin-bottom: 6px;">${item.specialty || item.clinicName || 'Medical Facility'}</div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 8px;">${item.address || ''}</div>
          ${item.phone ? `<div style="font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 8px;">📞 ${item.phone}</div>` : ''}
          <a
            href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name} ${item.address}`)}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              display: inline-block;
              width: 100%;
              text-align: center;
              padding: 6px 12px;
              background: #0d9488;
              color: white;
              font-size: 12px;
              font-weight: 700;
              border-radius: 8px;
              text-decoration: none;
            "
          >
            Google Maps Directions ➔
          </a>
        </div>
      `;

      const marker = window.L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectItem) onSelectItem(itemId);
      });

      markersRef.current[itemId] = marker;
    });

    // Auto-fit bounds if we have markers
    if (bounds.length > 0 && !selectedId) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } catch (e) {}
    }

  }, [items, userLoc, isDoctors]);

  // Center map on selected item
  useEffect(() => {
    if (!selectedId || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const item = items.find(it => (it._id || it.id) === selectedId);

    if (item) {
      const lat = item.lat || (item.location?.coordinates ? item.location.coordinates[1] : null);
      const lng = item.lng || (item.location?.coordinates ? item.location.coordinates[0] : null);

      if (lat && lng) {
        map.flyTo([lat, lng], 16, { duration: 1.2 });
        const marker = markersRef.current[selectedId];
        if (marker) marker.openPopup();
      }
    }
  }, [selectedId, items]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && userLoc.lat && userLoc.lng) {
      mapInstanceRef.current.flyTo([userLoc.lat, userLoc.lng], 14, { duration: 1 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Container for Leaflet Map Canvas */}
      <div ref={mapRef} className="w-full h-full rounded-2xl z-10" style={{ minHeight: '100%', background: '#e2e8f0' }} />

      {/* Recenter GPS Floating Action Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={handleRecenter}
          className="bg-white hover:bg-slate-50 text-slate-800 font-extrabold px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 text-[13px] flex items-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] text-teal-600">my_location</span>
          <span>Recenter Map</span>
        </button>
      </div>
    </div>
  );
}
