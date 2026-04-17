// import React, { useEffect, useRef, useState } from 'react';
// import { getNearbyHospitals } from '../../services/api';
// import { MapPin, Navigation, X, AlertCircle, Loader2 } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function HospitalMap({ onClose }) {
//   const mapRef = useRef(null);
//   const containerRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hospitals, setHospitals] = useState([]);

//   useEffect(() => {
//     if (!window.L) {
//       setError("Leaflet map engine failed to load. Please refresh the page.");
//       setLoading(false);
//       return;
//     }

//     // Small delay to ensure container is ready
//     const timer = setTimeout(() => {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           await initMap(latitude, longitude);
//         },
//         (err) => {
//           setError("Location access denied. We need your location to find nearby hospitals.");
//           setLoading(false);
//         }
//       );
//     }, 100);

//     return () => {
//       clearTimeout(timer);
//       if (mapRef.current) {
//         mapRef.current.remove();
//       }
//     };
//   }, []);

//   const initMap = async (lat, lon) => {
//     try {
//       const L = window.L;

//       if (!containerRef.current) return;

//       // Initialize map
//       const map = L.map(containerRef.current).setView([lat, lon], 14);
//       mapRef.current = map;

//       // Use a clean dark map style or standard OSM
//       L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//         attribution: '&copy; OpenStreetMap contributors'
//       }).addTo(map);

//       // User Marker
//       const userIcon = L.divIcon({
//         html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.9)] animate-pulse"></div>`,
//         className: 'custom-div-icon',
//         iconSize: [20, 20],
//         iconAnchor: [10, 10]
//       });
//       L.marker([lat, lon], { icon: userIcon }).addTo(map).bindPopup("<b>Your Current Position</b>").openPopup();

//       // Fetch hospitals
//       const results = await getNearbyHospitals(lat, lon);

//       const hospitalList = Array.isArray(results) ? results : Array.isArray(results.places) ? results.places : [];
//       setHospitals(hospitalList);

//       const hospitalIcon = L.divIcon({
//         html: `<div class="text-rose-500 bg-white rounded-full p-1.5 shadow-xl border-2 border-rose-500 ring-2 ring-rose-500/20"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M8 11h8"/><path d="M12 7v8"/></svg></div>`,
//         className: 'custom-div-icon',
//         iconSize: [32, 32],
//         iconAnchor: [16, 16]
//       });

//       hospitalList.forEach((h) => {
//         const hLat = h.lat || h.latitude;
//         const hLon = h.lon || h.longitude;
//         const hName = h.name || h.display_name || "Medical Facility";

//         if (hLat && hLon) {
//           L.marker([hLat, hLon], { icon: hospitalIcon })
//             .addTo(map)
//             .bindPopup(`
//               <div class="p-3 min-w-[200px] bg-slate-900 text-white rounded-lg">
//                 <h4 class="font-bold text-sm text-blue-400 uppercase tracking-tight">${hName}</h4>
//                 <p class="text-[10px] text-slate-400 mt-1 line-clamp-2">${h.address || h.display_name || 'Emergency/Medical Care'}</p>
//                 <div class="mt-3 flex items-center justify-between pt-2 border-t border-slate-700">
//                    <span class="text-[9px] font-bold text-emerald-400">READY FOR CARE</span>
//                    <a href="https://www.google.com/maps/dir/?api=1&destination=${hLat},${hLon}" target="_blank" class="text-blue-400 text-[10px] font-bold uppercase hover:underline flex items-center">
//                      Route <Navigation className="w-3 h-3 ml-1" />
//                    </a>
//                 </div>
//               </div>
//             `);
//         }
//       });

//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch nearby medical facilities accurately.");
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-6 bg-slate-950/80 backdrop-blur-md"
//     >
//       <motion.div
//         initial={{ y: 50, scale: 0.95 }}
//         animate={{ y: 0, scale: 1 }}
//         exit={{ y: 50, scale: 0.95 }}
//         className="relative w-full max-w-6xl h-full sm:h-[85vh] bg-slate-900 sm:rounded-3xl overflow-hidden border-t sm:border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
//       >
//         {/* Header */}
//         <div className="p-4 sm:p-5 border-b border-slate-700 flex items-center justify-between bg-slate-900/90 backdrop-blur-sm z-30">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
//               <MapPin className="w-6 h-6 text-rose-500 animate-pulse" />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-white tracking-tight leading-none">Emergency Response Map</h2>
//               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Live Clinical Infrastructure Scan</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-full transition-all border border-slate-700 hover:scale-110 active:scale-90"
//           >
//             <X className="w-5 h-5 text-slate-400" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 relative bg-slate-950">
//           <AnimatePresence>
//             {loading && (
//               <motion.div
//                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//                 className="absolute inset-0 z-50 flex flex-col items-center justify-center space-y-4 bg-slate-950/90"
//               >
//                 <div className="relative">
//                   <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
//                   <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-400" />
//                 </div>
//                 <div className="text-center">
//                   <p className="text-white font-bold tracking-tight">Accessing Neural Satellite Link...</p>
//                   <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Triangulating nearby facilities</p>
//                 </div>
//               </motion.div>
//             )}

//             {error && (
//               <motion.div
//                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//                 className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 text-center bg-slate-950/95"
//               >
//                 <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-6 neon-glow-red">
//                   <AlertCircle className="w-10 h-10 text-rose-500" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-white mb-3">System Access Denied</h3>
//                 <p className="text-slate-400 max-w-md mx-auto leading-relaxed">{error}</p>
//                 <button
//                   onClick={onClose}
//                   className="mt-8 px-10 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700 hover:shadow-lg shadow-black/50"
//                 >
//                   Return to Dashboard
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <div ref={containerRef} className="w-full h-full z-10" />

//           {/* Sidebar Info (Desktop) */}
//           {!loading && !error && hospitals.length > 0 && (
//             <div className="absolute top-6 left-6 z-20 w-80 max-h-[80%] hidden lg:flex flex-col bg-slate-900/90 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden pointer-events-auto shadow-2xl">
//               <div className="p-4 border-b border-white/5 bg-slate-800/20">
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Tactical Scan</span>
//                   <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-md border border-blue-500/20">{hospitals.length} Found</span>
//                 </div>
//               </div>
//               <div className="overflow-y-auto p-3 space-y-2 custom-scrollbar">
//                 {hospitals.map((h, i) => (
//                   <div
//                     key={i}
//                     onClick={() => {
//                       if (mapRef.current) {
//                         mapRef.current.setView([h.lat || h.latitude, h.lon || h.longitude], 16);
//                       }
//                     }}
//                     className="p-4 rounded-2xl bg-slate-800/30 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/80 transition-all cursor-pointer group relative overflow-hidden"
//                   >
//                     <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/0 group-hover:bg-blue-500/50 transition-all" />
//                     <h5 className="text-xs font-black text-slate-100 uppercase tracking-tight truncate leading-tight group-hover:text-blue-400 transition-colors">
//                       {h.name || h.display_name || "Facility"}
//                     </h5>
//                     <div className="flex items-center mt-2 justify-between">
//                       <div className="flex items-center text-[10px] text-slate-500 font-bold">
//                         <Navigation className="w-3 h-3 mr-1 text-slate-600" />
//                         <span>{h.distance ? `${(h.distance / 1000).toFixed(1)} km` : 'Near'}</span>
//                       </div>
//                       <span className="text-[9px] font-black text-white/20 uppercase">PO-12</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </motion.div>

//       <style dangerouslySetInnerHTML={{
//         __html: `
//         .leaflet-container { 
//             background: #020617 !important; 
//             font-family: inherit;
//         }
//         .leaflet-tile-pane { filter: brightness(0.7) contrast(1.2) saturate(0.8) hue-rotate(200deg) invert(0.9); }
//         .leaflet-popup-content-wrapper, .leaflet-popup-tip {
//             background: #0f172a !important;
//             color: white !important;
//             border: 1px solid rgba(255,255,255,0.1);
//             border-radius: 12px;
//         }
//         .leaflet-popup-content { margin: 0; }
//         .custom-div-icon { background: none; border: none; }
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
//       `}} />
//     </motion.div>
//   );
// }

import React, { useEffect, useRef, useState } from 'react';
import { getNearbyHospitals } from '../../services/api';
import { MapPin, Navigation, X, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HospitalMap({ onClose }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    if (!window.L) {
      setError("Leaflet map engine failed to load. Please refresh the page.");
      setLoading(false);
      return;
    }

    // Small delay to ensure container is ready
    const timer = setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await initMap(latitude, longitude);
        },
        (err) => {
          setError("Location access denied. We need your location to find nearby hospitals.");
          setLoading(false);
        }
      );
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const initMap = async (lat, lon) => {
    try {
      const L = window.L;

      if (!containerRef.current) return;

      // Initialize map
      const map = L.map(containerRef.current).setView([lat, lon], 14);
      mapRef.current = map;

      // Use a clean dark map style or standard OSM
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // User Marker
      const userIcon = L.divIcon({
        html: `<div class="w-4 h-4 bg-[#5C766D] rounded-full border-2 border-white shadow-[0_0_15px_rgba(92,118,109,0.9)] animate-pulse"></div>`,
        className: 'custom-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      L.marker([lat, lon], { icon: userIcon }).addTo(map).bindPopup("<b>Your Current Position</b>").openPopup();

      // Fetch hospitals
      const results = await getNearbyHospitals(lat, lon);

      const hospitalList = Array.isArray(results) ? results : Array.isArray(results.places) ? results.places : [];
      setHospitals(hospitalList);

      const hospitalIcon = L.divIcon({
        html: `<div class="text-[#C9996B] bg-white rounded-full p-1.5 shadow-xl border-2 border-[#C9996B] ring-2 ring-[#C9996B]/20"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M8 11h8"/><path d="M12 7v8"/></svg></div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      hospitalList.forEach((h) => {
        const hLat = h.lat || h.latitude;
        const hLon = h.lon || h.longitude;
        const hName = h.name || h.display_name || "Medical Facility";

        if (hLat && hLon) {
          L.marker([hLat, hLon], { icon: hospitalIcon })
            .addTo(map)
            .bindPopup(`
              <div class="p-3 min-w-[200px] bg-white text-[#5C4F4A] rounded-2xl shadow-xl">
                <h4 class="font-bold text-sm uppercase tracking-tight" style="color:#5C4F4A">${hName}</h4>
                <p class="text-xs mt-1" style="color:#5C4F4A80">${h.address || h.display_name || 'Emergency/Medical Care'}</p>
                <div class="mt-4 flex items-center justify-between pt-3 border-t" style="border-color:#EDE9E6">
                   <span class="text-xs font-semibold" style="color:#5C766D">READY FOR CARE</span>
                   <a href="https://www.google.com/maps/dir/?api=1&destination=${hLat},${hLon}" target="_blank" 
                      class="inline-flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-2xl text-white"
                      style="background: linear-gradient(135deg, #C9996B, #5C4F4A);">
                     Route <Navigation class="w-3 h-3" />
                   </a>
                </div>
              </div>
            `);
        }
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch nearby medical facilities accurately.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
    >
      <motion.div
        initial={{ y: 40, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, scale: 0.96 }}
        className="relative w-full max-w-6xl h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ boxShadow: '0 30px 70px -15px rgba(92, 79, 74, 0.3)' }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b flex items-center justify-between" style={{ borderColor: '#EDE9E6' }}>
          <div className="flex items-center gap-4">
            <div
              className="p-4 rounded-2xl shadow-sm"
              style={{ background: 'linear-gradient(135deg, #5C766D 0%, #5C4F4A 100%)' }}
            >
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#5C4F4A' }}>Nearby Hospitals</h2>
              <p className="text-sm" style={{ color: '#5C4F4A80' }}>Live medical facilities near you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl hover:bg-[#EDE9E6] transition-colors"
          >
            <X className="w-6 h-6" style={{ color: '#5C4F4A' }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-[#F8F4F0]">
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-[#EDE9E6] border-t-[#5C766D] rounded-full animate-spin" />
                  <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#5C766D' }} />
                </div>
                <p className="text-lg font-medium" style={{ color: '#5C4F4A' }}>Locating nearby hospitals...</p>
                <p className="text-sm mt-2" style={{ color: '#5C4F4A80' }}>Using your current location</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center p-10 text-center bg-white"
              >
                <div className="p-6 rounded-3xl mb-8" style={{ backgroundColor: '#EDE9E6' }}>
                  <AlertCircle className="w-16 h-16" style={{ color: '#9C6644' }} />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#5C4F4A' }}>Unable to Load Map</h3>
                <p className="max-w-md mb-8" style={{ color: '#5C4F4A80' }}>{error}</p>
                <button
                  onClick={onClose}
                  className="px-10 py-4 rounded-2xl font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #C9996B, #5C4F4A)' }}
                >
                  Close Map
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={containerRef} className="w-full h-full z-10" />

          {/* Sidebar Info (Desktop) */}
          {!loading && !error && hospitals.length > 0 && (
            <div className="absolute top-6 left-6 z-20 w-80 max-h-[75%] hidden lg:flex flex-col bg-white rounded-3xl overflow-hidden border shadow-xl"
              style={{ borderColor: '#EDE9E6' }}>
              <div className="p-6 border-b" style={{ borderColor: '#EDE9E6' }}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{ color: '#5C4F4A' }}>Nearby Facilities</span>
                  <span className="px-4 py-1 text-xs font-medium rounded-full"
                    style={{ backgroundColor: '#EDE9E6', color: '#5C766D' }}>
                    {hospitals.length} found
                  </span>
                </div>
              </div>
              <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {hospitals.map((h, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.setView([h.lat || h.latitude, h.lon || h.longitude], 16);
                      }
                    }}
                    className="p-5 rounded-2xl border hover:shadow-md transition-all cursor-pointer group"
                    style={{ borderColor: '#EDE9E6' }}
                  >
                    <h5 className="font-medium text-base mb-2 group-hover:text-[#C9996B] transition-colors" style={{ color: '#5C4F4A' }}>
                      {h.name || h.display_name || "Facility"}
                    </h5>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5" style={{ color: '#5C4F4A80' }}>
                        <Navigation className="w-4 h-4" />
                        <span>{h.distance ? `${(h.distance / 1000).toFixed(1)} km` : 'Nearby'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .leaflet-container { 
              background: #F8F4F0 !important; 
              font-family: inherit;
          }
          .leaflet-tile-pane { 
              filter: brightness(0.95) contrast(1.05) saturate(0.9); 
          }
          .leaflet-popup-content-wrapper, .leaflet-popup-tip {
              background: white !important;
              color: #5C4F4A !important;
              border-radius: 16px !important;
              box-shadow: 0 10px 30px rgba(92,79,74,0.15) !important;
          }
          .leaflet-popup-content { margin: 0; padding: 0; }
          .custom-div-icon { background: none; border: none; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #C9996B40; border-radius: 10px; }
        `}} />
    </motion.div>
  );
}