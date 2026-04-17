// import React, { useState, useEffect, useMemo } from 'react';
// import { analyzeSymptoms } from '../../services/api';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     Stethoscope, Activity, AlertCircle, CheckCircle2,
//     ChevronRight, Info, BrainCircuit, Heart, FlameKindling,
//     Search, ShieldAlert, Zap, Thermometer, Filter,
//     Wind, Droplets, Dumbbell, Eye, ZapOff
// } from 'lucide-react';

// export default function SymptomChecker({ userId, onComplete }) {
//     const [library, setLibrary] = useState([]);
//     const [selections, setSelections] = useState([]); // Array of { id, severity }
//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [evaluating, setEvaluating] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [activeCategory, setActiveCategory] = useState("all");

//     // Load symptom library on mount
//     useEffect(() => {
//         const fetchLibrary = async () => {
//             try {
//                 const response = await analyzeSymptoms([]); // Empty call to get library
//                 setLibrary(response.symptom_library || []);
//             } catch (err) {
//                 console.error("Library load failed", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchLibrary();
//     }, []);

//     // Compute unified list for search and grid
//     const allSymptoms = useMemo(() => {
//         const list = (library || []).flatMap(d =>
//             d.symptoms.map(s => ({ ...s, category: d.name, categoryId: d.id }))
//         );
//         // Deduplicate if any symptom appears in multiple diseases
//         return Array.from(new Map(list.map(s => [s.id, s])).values());
//     }, [library]);

//     const filteredSymptoms = useMemo(() => {
//         return allSymptoms.filter(s => {
//             const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 s.desc.toLowerCase().includes(searchQuery.toLowerCase());
//             const matchesCat = activeCategory === "all" || s.categoryId === activeCategory;
//             return matchesSearch && matchesCat;
//         });
//     }, [allSymptoms, searchQuery, activeCategory]);

//     // Update results live as symptoms change
//     useEffect(() => {
//         const debounceTimer = setTimeout(async () => {
//             if (selections.length === 0) {
//                 setResults([]);
//                 return;
//             }

//             setEvaluating(true);
//             try {
//                 const response = await analyzeSymptoms(selections, userId);
//                 setResults(response.results || []);
//             } catch (err) {
//                 console.error("Analysis failed", err);
//             } finally {
//                 setEvaluating(false);
//             }
//         }, 400);

//         return () => clearTimeout(debounceTimer);
//     }, [selections, userId]);

//     const toggleSymptom = (id) => {
//         setSelections(prev => {
//             const exists = prev.find(s => s.id === id);
//             if (exists) return prev.filter(s => s.id !== id);
//             return [...prev, { id, severity: 'mild' }];
//         });
//     };

//     const updateSeverity = (id, severity) => {
//         setSelections(prev => prev.map(s => s.id === id ? { ...s, severity } : s));
//     };

//     const getSymptomIcon = (name) => {
//         const n = name.toLowerCase();
//         if (n.includes('breath') || n.includes('cough')) return <Wind className="w-5 h-5 text-sky-400" />;
//         if (n.includes('heart') || n.includes('chest')) return <Heart className="w-5 h-5 text-rose-500" />;
//         if (n.includes('weight') || n.includes('thirst')) return <Droplets className="w-5 h-5 text-blue-400" />;
//         if (n.includes('vision') || n.includes('eye')) return <Eye className="w-5 h-5 text-purple-400" />;
//         if (n.includes('fatigue') || n.includes('weak')) return <ZapOff className="w-5 h-5 text-amber-400" />;
//         if (n.includes('dizz') || n.includes('faint')) return <Zap className="w-5 h-5 text-yellow-400" />;
//         return <Activity className="w-5 h-5 text-slate-400" />;
//     };

//     if (loading) return (
//         <div className="flex flex-col items-center justify-center p-32 space-y-6">
//             <div className="relative">
//                 <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
//                 <div className="absolute inset-0 flex items-center justify-center">
//                     <Stethoscope className="w-6 h-6 text-blue-500/50" />
//                 </div>
//             </div>
//             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Diagnostic Terminal...</p>
//         </div>
//     );

//     return (
//         <div className="max-w-7xl mx-auto px-6 py-12">
//             {/* Header Deck */}
//             <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
//                 <div className="space-y-2">
//                     <div className="flex items-center space-x-2 text-blue-500">
//                         <Stethoscope className="w-5 h-5" />
//                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">Diagnostic Intake</span>
//                     </div>
//                     <h1 className="text-4xl font-black text-white tracking-tighter">Unified Symptom Inventory</h1>
//                     <p className="text-slate-400 max-w-xl font-medium">Select clinical markers present in your current profile. We use weighted pattern matching to estimate risk pathology.</p>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-4">
//                     <div className="relative group">
//                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
//                         <input
//                             type="text"
//                             placeholder="Search indicators..."
//                             className="bg-slate-900 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all w-full sm:w-64"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

//                 {/* Main Grid Area */}
//                 <div className="lg:col-span-8 space-y-8">

//                     {/* Category Tabs */}
//                     <div className="flex flex-wrap gap-2 pb-4 border-b border-white/5">
//                         <button
//                             onClick={() => setActiveCategory('all')}
//                             className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-900 text-slate-500 border border-white/5 hover:border-white/10'
//                                 }`}
//                         >
//                             Global List
//                         </button>
//                         {library.map(cat => (
//                             <button
//                                 key={cat.id}
//                                 onClick={() => setActiveCategory(cat.id)}
//                                 className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900 text-slate-500 border border-white/5 hover:border-white/10'
//                                     }`}
//                             >
//                                 {cat.name}
//                             </button>
//                         ))}
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <AnimatePresence mode="popLayout">
//                             {filteredSymptoms.map((s) => {
//                                 const isSelected = selections.find(item => item.id === s.id);
//                                 const currentSeverity = isSelected?.severity || 'mild';

//                                 return (
//                                     <motion.div
//                                         key={s.id}
//                                         layout
//                                         initial={{ opacity: 0, scale: 0.95 }}
//                                         animate={{ opacity: 1, scale: 1 }}
//                                         exit={{ opacity: 0, scale: 0.95 }}
//                                         whileHover={{ scale: 1.01 }}
//                                         className={`relative p-5 rounded-[2rem] border transition-all cursor-pointer group ${isSelected
//                                                 ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.1)] ring-1 ring-blue-500/20'
//                                                 : 'bg-slate-900/40 border-white/5 hover:border-white/10 shadow-sm'
//                                             }`}
//                                         onClick={() => toggleSymptom(s.id)}
//                                     >
//                                         <div className="flex items-start space-x-4">
//                                             <div className={`p-3 rounded-2xl transition-all ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
//                                                 {getSymptomIcon(s.name)}
//                                             </div>
//                                             <div className="flex-1">
//                                                 <div className="flex items-center justify-between">
//                                                     <span className={`text-base font-black tracking-tight ${isSelected ? 'text-white' : 'text-slate-200 uppercase text-sm font-extrabold'}`}>
//                                                         {s.name}
//                                                     </span>
//                                                     {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
//                                                 </div>
//                                                 <p className="text-[11px] text-slate-500 mt-1.5 font-bold leading-relaxed opacity-70">
//                                                     {s.desc}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         {/* Severity Selector (Shown only when selected) */}
//                                         {isSelected && (
//                                             <motion.div
//                                                 initial={{ opacity: 0, y: 5 }}
//                                                 animate={{ opacity: 1, y: 0 }}
//                                                 className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between"
//                                                 onClick={(e) => e.stopPropagation()} // Prevent toggling selection when clicking severity
//                                             >
//                                                 <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Mark Severity</span>
//                                                 <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
//                                                     {['mild', 'moderate', 'severe'].map((sev) => (
//                                                         <button
//                                                             key={sev}
//                                                             onClick={() => updateSeverity(s.id, sev)}
//                                                             className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all ${currentSeverity === sev
//                                                                     ? 'bg-blue-500 text-white shadow-lg'
//                                                                     : 'text-slate-600 hover:text-slate-400'
//                                                                 }`}
//                                                         >
//                                                             {sev[0]}
//                                                         </button>
//                                                     ))}
//                                                 </div>
//                                             </motion.div>
//                                         )}
//                                     </motion.div>
//                                 );
//                             })}
//                         </AnimatePresence>
//                     </div>
//                 </div>

//                 {/* Live Side Statistics */}
//                 <div className="lg:col-span-4 relative">
//                     <div className="sticky top-10 space-y-6">
//                         <div className="bg-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl overflow-hidden relative">
//                             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px]" />
//                             <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-[60px]" />

//                             <div className="relative z-10">
//                                 <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
//                                     <div>
//                                         <h3 className="text-xl font-black text-white flex items-center">
//                                             <BrainCircuit className="w-6 h-6 mr-2 text-purple-400" />
//                                             Live Profile
//                                         </h3>
//                                         <span className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black">Algorithmic Match Engine</span>
//                                     </div>
//                                     {evaluating && (
//                                         <div className="flex items-center space-x-2 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
//                                             <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="space-y-6">
//                                     {results.length === 0 ? (
//                                         <div className="py-16 text-center">
//                                             <ZapOff className="w-12 h-12 text-slate-800 mx-auto mb-4" />
//                                             <p className="text-slate-600 text-xs font-bold uppercase tracking-widest leading-relaxed">
//                                                 Selection Required to Initiate <br />
//                                                 Differential Diagnosis
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-6">
//                                             {results.map((res, i) => (
//                                                 <motion.div
//                                                     key={res.id}
//                                                     initial={{ opacity: 0, x: 20 }}
//                                                     animate={{ opacity: 1, x: 0 }}
//                                                     className={`p-5 rounded-2xl border transition-all ${i === 0 ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-800/40 border-white/5'
//                                                         }`}
//                                                 >
//                                                     <div className="flex justify-between items-center mb-3">
//                                                         <span className="text-xs font-black text-white uppercase tracking-tight">{res.name}</span>
//                                                         <span className="text-2xl font-black text-white">{Math.round(res.probability)}%</span>
//                                                     </div>
//                                                     <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
//                                                         <motion.div
//                                                             initial={{ width: 0 }}
//                                                             animate={{ width: `${res.probability}%` }}
//                                                             className={`h-full rounded-full ${res.probability > 50 ? 'bg-rose-500' : res.probability > 20 ? 'bg-amber-500' : 'bg-emerald-500'
//                                                                 }`}
//                                                         />
//                                                     </div>
//                                                     {res.confidence.is_low && (
//                                                         <div className="mt-3 flex items-center space-x-2">
//                                                             <ShieldAlert className="w-3 h-3 text-amber-500" />
//                                                             <span className="text-[9px] font-bold text-amber-500/80 uppercase">Low Confidence Match</span>
//                                                         </div>
//                                                     )}
//                                                 </motion.div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         <motion.button
//                             whileHover={{ scale: 1.02, y: -2 }}
//                             whileTap={{ scale: 0.98 }}
//                             disabled={selections.length === 0}
//                             onClick={() => onComplete(results, selections)}
//                             className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center space-x-3 group"
//                         >
//                             <span className="uppercase tracking-tighter">Finalize Clinical Report</span>
//                             <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
//                         </motion.button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// import React, { useState, useEffect, useMemo } from 'react';
// import { analyzeSymptoms } from '../../services/api';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     Stethoscope, CheckCircle2, Search, ChevronRight,
//     BrainCircuit, ShieldAlert
// } from 'lucide-react';

// export default function SymptomChecker({ userId, onComplete }) {
//     const [library, setLibrary] = useState([]);
//     const [selections, setSelections] = useState([]);
//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [evaluating, setEvaluating] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [activeCategory, setActiveCategory] = useState("all");

//     useEffect(() => {
//         const fetchLibrary = async () => {
//             try {
//                 const response = await analyzeSymptoms([]);
//                 setLibrary(response.symptom_library || []);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchLibrary();
//     }, []);

//     const allSymptoms = useMemo(() => {
//         const list = (library || []).flatMap(d =>
//             d.symptoms.map(s => ({ ...s, categoryId: d.id }))
//         );
//         return Array.from(new Map(list.map(s => [s.id, s])).values());
//     }, [library]);

//     const filteredSymptoms = useMemo(() => {
//         return allSymptoms.filter(s =>
//             (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 s.desc.toLowerCase().includes(searchQuery.toLowerCase())) &&
//             (activeCategory === "all" || s.categoryId === activeCategory)
//         );
//     }, [allSymptoms, searchQuery, activeCategory]);

//     useEffect(() => {
//         const t = setTimeout(async () => {
//             if (!selections.length) return setResults([]);
//             setEvaluating(true);
//             try {
//                 const res = await analyzeSymptoms(selections, userId);
//                 setResults(res.results || []);
//             } finally {
//                 setEvaluating(false);
//             }
//         }, 400);
//         return () => clearTimeout(t);
//     }, [selections, userId]);

//     const toggleSymptom = (id) => {
//         setSelections(prev =>
//             prev.find(s => s.id === id)
//                 ? prev.filter(s => s.id !== id)
//                 : [...prev, { id, severity: 'mild' }]
//         );
//     };

//     const updateSeverity = (id, severity) => {
//         setSelections(prev => prev.map(s => s.id === id ? { ...s, severity } : s));
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center text-sm"
//                 style={{ backgroundColor: '#EDE9E6', color: '#5C4F4A' }}>
//                 Loading...
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen px-6 py-10" style={{ backgroundColor: '#EDE9E6' }}>

//             {/* HEADER */}
//             <div className="max-w-6xl mx-auto mb-8">
//                 <h1 className="text-2xl font-bold mb-2" style={{ color: '#5C4F4A' }}>
//                     Symptom Checker
//                 </h1>
//                 <p className="text-sm" style={{ color: '#5C4F4A80' }}>
//                     Select symptoms to generate your analysis
//                 </p>
//             </div>

//             <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">

//                 {/* LEFT */}
//                 <div className="lg:col-span-2 space-y-4">

//                     {/* SEARCH */}
//                     <div className="relative">
//                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
//                             style={{ color: '#5C4F4A80' }} />
//                         <input
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             placeholder="Search symptoms..."
//                             className="w-full pl-10 pr-4 py-3 rounded-xl outline-none"
//                             style={{
//                                 backgroundColor: '#ffffff',
//                                 border: '1px solid rgba(92,79,74,0.1)'
//                             }}
//                         />
//                     </div>

//                     {/* CATEGORY (SMALL, NOT BIG TABS) */}
//                     <div className="flex gap-2 flex-wrap">
//                         <button
//                             onClick={() => setActiveCategory('all')}
//                             className="px-3 py-1 text-xs rounded-lg"
//                             style={{
//                                 background: activeCategory === 'all' ? '#5C766D' : '#fff',
//                                 color: activeCategory === 'all' ? '#fff' : '#5C4F4A'
//                             }}
//                         >
//                             All
//                         </button>

//                         {library.map(cat => (
//                             <button
//                                 key={cat.id}
//                                 onClick={() => setActiveCategory(cat.id)}
//                                 className="px-3 py-1 text-xs rounded-lg"
//                                 style={{
//                                     background: activeCategory === cat.id ? '#5C766D' : '#fff',
//                                     color: activeCategory === cat.id ? '#fff' : '#5C4F4A'
//                                 }}
//                             >
//                                 {cat.name}
//                             </button>
//                         ))}
//                     </div>

//                     {/* SYMPTOMS */}
//                     <div className="grid sm:grid-cols-2 gap-4">
//                         {filteredSymptoms.map(s => {
//                             const selected = selections.find(x => x.id === s.id);

//                             return (
//                                 <div
//                                     key={s.id}
//                                     onClick={() => toggleSymptom(s.id)}
//                                     className="p-4 rounded-xl cursor-pointer transition"
//                                     style={{
//                                         background: selected ? '#C9996B20' : '#fff',
//                                         border: selected ? '1px solid #C9996B' : '1px solid rgba(92,79,74,0.1)'
//                                     }}
//                                 >
//                                     <div className="flex justify-between items-center">
//                                         <span style={{ color: '#5C4F4A', fontWeight: 600 }}>
//                                             {s.name}
//                                         </span>
//                                         {selected && <CheckCircle2 size={16} color="#5C766D" />}
//                                     </div>

//                                     <p className="text-xs mt-1" style={{ color: '#5C4F4A80' }}>
//                                         {s.desc}
//                                     </p>

//                                     {selected && (
//                                         <div className="mt-3 flex gap-2">
//                                             {['mild', 'moderate', 'severe'].map(sev => (
//                                                 <button
//                                                     key={sev}
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         updateSeverity(s.id, sev);
//                                                     }}
//                                                     className="px-2 py-1 text-xs rounded-md"
//                                                     style={{
//                                                         background: selected.severity === sev ? '#5C766D' : '#EDE9E6',
//                                                         color: selected.severity === sev ? '#fff' : '#5C4F4A'
//                                                     }}
//                                                 >
//                                                     {sev}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* RIGHT PANEL */}
//                 <div className="space-y-4">

//                     <div className="p-5 rounded-2xl"
//                         style={{
//                             background: '#fff',
//                             border: '1px solid rgba(92,79,74,0.1)'
//                         }}>
//                         <div className="flex justify-between mb-4">
//                             <h3 style={{ color: '#5C4F4A', fontWeight: 600 }}>
//                                 Analysis
//                             </h3>
//                             {evaluating && <span className="text-xs">...</span>}
//                         </div>

//                         {results.length === 0 ? (
//                             <p className="text-sm" style={{ color: '#5C4F4A80' }}>
//                                 No results yet
//                             </p>
//                         ) : (
//                             results.map(r => (
//                                 <div key={r.id} className="mb-4">
//                                     <div className="flex justify-between text-sm">
//                                         <span>{r.name}</span>
//                                         <span>{Math.round(r.probability)}%</span>
//                                     </div>

//                                     <div className="h-2 rounded-full mt-1"
//                                         style={{ background: '#EDE9E6' }}>
//                                         <div
//                                             className="h-2 rounded-full"
//                                             style={{
//                                                 width: `${r.probability}%`,
//                                                 background: '#5C766D'
//                                             }}
//                                         />
//                                     </div>

//                                     {r.confidence.is_low && (
//                                         <div className="text-xs mt-1 flex items-center gap-1"
//                                             style={{ color: '#C9996B' }}>
//                                             <ShieldAlert size={12} />
//                                             Low confidence
//                                         </div>
//                                     )}
//                                 </div>
//                             ))
//                         )}
//                     </div>

//                     <button
//                         disabled={!selections.length}
//                         onClick={() => onComplete(results, selections)}
//                         className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
//                         style={{
//                             background: 'linear-gradient(135deg,#C9996B,#5C4F4A)'
//                         }}
//                     >
//                         Continue
//                         <ChevronRight size={18} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }



// import React, { useState, useEffect, useMemo } from 'react';
// import { analyzeSymptoms } from '../../services/api';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     Stethoscope, Activity, CheckCircle2,
//     ChevronRight, BrainCircuit,
//     Search, ShieldAlert,
//     Wind, Droplets, Eye, ZapOff, Heart
// } from 'lucide-react';

// export default function SymptomChecker({ userId, onComplete }) {
//     const [library, setLibrary] = useState([]);
//     const [selections, setSelections] = useState([]);
//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [evaluating, setEvaluating] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [activeCategory, setActiveCategory] = useState("all");

//     useEffect(() => {
//         const fetchLibrary = async () => {
//             try {
//                 const response = await analyzeSymptoms([]);
//                 setLibrary(response.symptom_library || []);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchLibrary();
//     }, []);

//     const allSymptoms = useMemo(() => {
//         const list = (library || []).flatMap(d =>
//             d.symptoms.map(s => ({ ...s, categoryId: d.id }))
//         );
//         return Array.from(new Map(list.map(s => [s.id, s])).values());
//     }, [library]);

//     const filteredSymptoms = useMemo(() => {
//         return allSymptoms.filter(s =>
//             (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 s.desc.toLowerCase().includes(searchQuery.toLowerCase())) &&
//             (activeCategory === "all" || s.categoryId === activeCategory)
//         );
//     }, [allSymptoms, searchQuery, activeCategory]);

//     useEffect(() => {
//         const t = setTimeout(async () => {
//             if (!selections.length) return setResults([]);
//             setEvaluating(true);
//             try {
//                 const res = await analyzeSymptoms(selections, userId);
//                 setResults(res.results || []);
//             } finally {
//                 setEvaluating(false);
//             }
//         }, 400);
//         return () => clearTimeout(t);
//     }, [selections, userId]);

//     const toggleSymptom = (id) => {
//         setSelections(prev =>
//             prev.find(s => s.id === id)
//                 ? prev.filter(s => s.id !== id)
//                 : [...prev, { id, severity: 'mild' }]
//         );
//     };

//     const updateSeverity = (id, severity) => {
//         setSelections(prev => prev.map(s => s.id === id ? { ...s, severity } : s));
//     };

//     const getSymptomIcon = (name) => {
//         const n = name.toLowerCase();
//         if (n.includes('breath') || n.includes('cough')) return <Wind className="w-5 h-5 text-sky-400" />;
//         if (n.includes('heart') || n.includes('chest')) return <Heart className="w-5 h-5 text-rose-400" />;
//         if (n.includes('weight') || n.includes('thirst')) return <Droplets className="w-5 h-5 text-blue-400" />;
//         if (n.includes('vision') || n.includes('eye')) return <Eye className="w-5 h-5 text-purple-400" />;
//         if (n.includes('fatigue')) return <ZapOff className="w-5 h-5 text-yellow-400" />;
//         return <Activity className="w-5 h-5 text-slate-400" />;
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-[60vh] text-slate-400 text-lg">
//                 Loading symptoms...
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-6xl mx-auto px-4 py-8">

//             {/* HEADER */}
//             <div className="mb-8">
//                 <h1 className="text-2xl font-semibold text-white mb-1">
//                     Symptom Checker
//                 </h1>
//                 <p className="text-slate-400 text-sm">
//                     Select your symptoms to get instant analysis
//                 </p>
//             </div>

//             {/* SEARCH */}
//             <div className="relative mb-6">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
//                 <input
//                     type="text"
//                     placeholder="Search symptoms..."
//                     className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//             </div>

//             <div className="grid lg:grid-cols-3 gap-6">

//                 {/* LEFT */}
//                 <div className="lg:col-span-2 space-y-5">

//                     {/* CATEGORY */}
//                     <div className="flex flex-wrap gap-2">
//                         <button
//                             onClick={() => setActiveCategory('all')}
//                             className={`px-3 py-1.5 text-sm rounded-lg ${activeCategory === 'all'
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-slate-800 text-slate-300'
//                                 }`}
//                         >
//                             All
//                         </button>

//                         {library.map(cat => (
//                             <button
//                                 key={cat.id}
//                                 onClick={() => setActiveCategory(cat.id)}
//                                 className={`px-3 py-1.5 text-sm rounded-lg ${activeCategory === cat.id
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-slate-800 text-slate-300'
//                                     }`}
//                             >
//                                 {cat.name}
//                             </button>
//                         ))}
//                     </div>

//                     {/* SYMPTOMS */}
//                     <div className="grid sm:grid-cols-2 gap-4">
//                         <AnimatePresence>
//                             {filteredSymptoms.map(s => {
//                                 const selected = selections.find(x => x.id === s.id);

//                                 return (
//                                     <motion.div
//                                         key={s.id}
//                                         layout
//                                         initial={{ opacity: 0 }}
//                                         animate={{ opacity: 1 }}
//                                         exit={{ opacity: 0 }}
//                                         onClick={() => toggleSymptom(s.id)}
//                                         className={`p-4 rounded-xl cursor-pointer border transition ${selected
//                                             ? 'bg-blue-600/10 border-blue-500'
//                                             : 'bg-slate-900 border-slate-700 hover:border-slate-500'
//                                             }`}
//                                     >
//                                         <div className="flex gap-3">
//                                             {getSymptomIcon(s.name)}

//                                             <div className="flex-1">
//                                                 <div className="flex justify-between items-center">
//                                                     <span className="text-white text-sm font-medium">
//                                                         {s.name}
//                                                     </span>
//                                                     {selected && <CheckCircle2 size={16} className="text-blue-400" />}
//                                                 </div>

//                                                 <p className="text-xs text-slate-400 mt-1">
//                                                     {s.desc}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         {/* SEVERITY */}
//                                         {selected && (
//                                             <div
//                                                 className="mt-3 flex gap-2"
//                                                 onClick={(e) => e.stopPropagation()}
//                                             >
//                                                 {['mild', 'moderate', 'severe'].map(sev => (
//                                                     <button
//                                                         key={sev}
//                                                         onClick={() => updateSeverity(s.id, sev)}
//                                                         className={`px-2 py-1 text-xs rounded-md ${selected.severity === sev
//                                                             ? 'bg-blue-600 text-white'
//                                                             : 'bg-slate-800 text-slate-300'
//                                                             }`}
//                                                     >
//                                                         {sev}
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </motion.div>
//                                 );
//                             })}
//                         </AnimatePresence>
//                     </div>
//                 </div>

//                 {/* RIGHT PANEL */}
//                 <div className="space-y-4">

//                     <div className="p-5 rounded-xl bg-slate-900 border border-slate-700">
//                         <div className="flex justify-between mb-4">
//                             <h3 className="text-white font-medium">
//                                 Analysis
//                             </h3>
//                             {evaluating && <span className="text-xs text-slate-400">...</span>}
//                         </div>

//                         {results.length === 0 ? (
//                             <p className="text-sm text-slate-400">
//                                 No results yet
//                             </p>
//                         ) : (
//                             results.map(r => (
//                                 <div key={r.id} className="mb-4">
//                                     <div className="flex justify-between text-sm text-white">
//                                         <span>{r.name}</span>
//                                         <span>{Math.round(r.probability)}%</span>
//                                     </div>

//                                     <div className="h-2 bg-slate-700 rounded-full mt-1">
//                                         <div
//                                             className="h-2 bg-blue-500 rounded-full"
//                                             style={{ width: `${r.probability}%` }}
//                                         />
//                                     </div>

//                                     {r.confidence.is_low && (
//                                         <div className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
//                                             <ShieldAlert size={12} />
//                                             Low confidence
//                                         </div>
//                                     )}
//                                 </div>
//                             ))
//                         )}
//                     </div>

//                     <button
//                         disabled={!selections.length}
//                         onClick={() => onComplete(results, selections)}
//                         className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
//                     >
//                         Continue
//                         <ChevronRight size={18} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect, useMemo } from 'react';
import { analyzeSymptoms } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Stethoscope, CheckCircle2, Search, ChevronRight,
    BrainCircuit, ShieldAlert, Activity, Wind,
    Droplets, Eye, ZapOff, Heart
} from 'lucide-react';

export default function SymptomChecker({ userId, onComplete }) {
    const [library, setLibrary] = useState([]);
    const [selections, setSelections] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [evaluating, setEvaluating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [focusedField, setFocusedField] = useState(null);

    // Fetch symptom library
    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const response = await analyzeSymptoms([]);
                setLibrary(response.symptom_library || []);
            } catch (err) {
                console.error("Failed to load symptom library", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLibrary();
    }, []);

    // Unified symptom list
    const allSymptoms = useMemo(() => {
        const list = (library || []).flatMap(d =>
            d.symptoms.map(s => ({ ...s, categoryId: d.id }))
        );
        return Array.from(new Map(list.map(s => [s.id, s])).values());
    }, [library]);

    // Filtered symptoms
    const filteredSymptoms = useMemo(() => {
        return allSymptoms.filter(s =>
            (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.desc.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (activeCategory === "all" || s.categoryId === activeCategory)
        );
    }, [allSymptoms, searchQuery, activeCategory]);

    // Live analysis
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!selections.length) {
                setResults([]);
                return;
            }
            setEvaluating(true);
            try {
                const res = await analyzeSymptoms(selections, userId);
                setResults(res.results || []);
            } catch (err) {
                console.error("Analysis failed", err);
            } finally {
                setEvaluating(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [selections, userId]);

    const toggleSymptom = (id) => {
        setSelections(prev =>
            prev.find(s => s.id === id)
                ? prev.filter(s => s.id !== id)
                : [...prev, { id, severity: 'mild' }]
        );
    };

    const updateSeverity = (id, severity) => {
        setSelections(prev => prev.map(s => s.id === id ? { ...s, severity } : s));
    };

    const getSymptomIcon = (name) => {
        const n = name.toLowerCase();
        if (n.includes('breath') || n.includes('cough')) return <Wind className="w-5 h-5" style={{ color: '#5C766D' }} />;
        if (n.includes('heart') || n.includes('chest')) return <Heart className="w-5 h-5" style={{ color: '#C9996B' }} />;
        if (n.includes('weight') || n.includes('thirst')) return <Droplets className="w-5 h-5" style={{ color: '#5C4F4A' }} />;
        if (n.includes('vision') || n.includes('eye')) return <Eye className="w-5 h-5" style={{ color: '#5C766D' }} />;
        if (n.includes('fatigue')) return <ZapOff className="w-5 h-5" style={{ color: '#C9996B' }} />;
        return <Activity className="w-5 h-5" style={{ color: '#5C4F4A80' }} />;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDE9E6' }}>
                <div className="flex flex-col items-center">
                    <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #5C766D 0%, #5C4F4A 100%)' }}>
                        <Stethoscope className="w-10 h-10 text-white" />
                    </div>
                    <p className="mt-6 text-sm" style={{ color: '#5C4F4A', opacity: 0.7 }}>
                        Loading symptom library...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 px-6" style={{ backgroundColor: '#EDE9E6' }}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <div className="flex justify-center mb-4">
                        <div
                            className="p-4 rounded-2xl shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, #5C766D 0%, #5C4F4A 100%)',
                            }}
                        >
                            <Stethoscope className="w-9 h-9 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: '#5C4F4A' }}>
                        Symptom Checker
                    </h1>
                    <p className="text-sm max-w-md mx-auto" style={{ color: '#5C4F4A', opacity: 0.7 }}>
                        Select symptoms you're experiencing. Our AI will analyze patterns in real-time.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Search Bar */}
                        <motion.div
                            className="relative"
                            animate={{ scale: focusedField === 'search' ? 1.01 : 1 }}
                        >
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Search className="w-5 h-5" style={{ color: focusedField === 'search' ? '#C9996B' : '#5C4F4A80' }} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search symptoms or conditions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setFocusedField('search')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl font-medium outline-none transition-all"
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    border: focusedField === 'search' ? '2px solid #C9996B' : '2px solid transparent',
                                    boxShadow: focusedField === 'search' ? '0 0 0 4px rgba(201, 153, 107, 0.15)' : 'none',
                                    color: '#5C4F4A',
                                }}
                            />
                        </motion.div>

                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`px-5 py-2 text-sm font-semibold rounded-2xl transition-all`}
                                style={{
                                    background: activeCategory === 'all' ? '#5C766D' : '#FFFFFF',
                                    color: activeCategory === 'all' ? '#FFFFFF' : '#5C4F4A',
                                    border: activeCategory === 'all' ? 'none' : '1px solid rgba(92,79,74,0.1)',
                                }}
                            >
                                All Symptoms
                            </button>
                            {library.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-5 py-2 text-sm font-semibold rounded-2xl transition-all`}
                                    style={{
                                        background: activeCategory === cat.id ? '#5C766D' : '#FFFFFF',
                                        color: activeCategory === cat.id ? '#FFFFFF' : '#5C4F4A',
                                        border: activeCategory === cat.id ? 'none' : '1px solid rgba(92,79,74,0.1)',
                                    }}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Symptoms Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <AnimatePresence mode="popLayout">
                                {filteredSymptoms.map((s) => {
                                    const selected = selections.find(x => x.id === s.id);
                                    const currentSeverity = selected?.severity || 'mild';

                                    return (
                                        <motion.div
                                            key={s.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            onClick={() => toggleSymptom(s.id)}
                                            className={`p-6 rounded-3xl cursor-pointer transition-all border group`}
                                            style={{
                                                backgroundColor: selected ? '#C9996B10' : '#FFFFFF',
                                                border: selected
                                                    ? '2px solid #C9996B'
                                                    : '2px solid rgba(92,79,74,0.08)',
                                            }}
                                        >
                                            <div className="flex gap-4">
                                                <div className={`p-3 rounded-2xl transition-all flex-shrink-0 ${selected ? 'bg-[#C9996B20]' : 'bg-[#EDE9E6]'}`}>
                                                    {getSymptomIcon(s.name)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <span className="font-semibold text-lg leading-tight" style={{ color: '#5C4F4A' }}>
                                                            {s.name}
                                                        </span>
                                                        {selected && <CheckCircle2 className="w-5 h-5 mt-1" style={{ color: '#5C766D' }} />}
                                                    </div>
                                                    <p className="text-sm mt-2 leading-relaxed" style={{ color: '#5C4F4A80' }}>
                                                        {s.desc}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Severity Selector */}
                                            {selected && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-5 pt-4 border-t border-[#C9996B30] flex flex-wrap gap-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {['mild', 'moderate', 'severe'].map((sev) => (
                                                        <button
                                                            key={sev}
                                                            onClick={() => updateSeverity(s.id, sev)}
                                                            className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all`}
                                                            style={{
                                                                background: currentSeverity === sev ? '#5C766D' : '#EDE9E6',
                                                                color: currentSeverity === sev ? '#FFFFFF' : '#5C4F4A',
                                                            }}
                                                        >
                                                            {sev.charAt(0).toUpperCase() + sev.slice(1)}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Live Analysis Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-8 space-y-6">
                            {/* Analysis Card */}
                            <div
                                className="rounded-3xl p-8 shadow-xl overflow-hidden"
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    boxShadow: '0 25px 50px -12px rgba(92, 79, 74, 0.15)',
                                }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <BrainCircuit className="w-6 h-6" style={{ color: '#5C766D' }} />
                                        <h3 className="font-bold text-xl" style={{ color: '#5C4F4A' }}>Live Analysis</h3>
                                    </div>
                                    {evaluating && (
                                        <div className="text-xs px-3 py-1 rounded-full" style={{ background: '#C9996B20', color: '#C9996B' }}>
                                            Analyzing...
                                        </div>
                                    )}
                                </div>

                                {results.length === 0 ? (
                                    <div className="py-16 text-center">
                                        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#EDE9E6' }}>
                                            <Activity className="w-8 h-8" style={{ color: '#5C4F4A80' }} />
                                        </div>
                                        <p className="text-sm" style={{ color: '#5C4F4A80' }}>
                                            Select symptoms to see potential conditions
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {results.map((res, i) => (
                                            <motion.div
                                                key={res.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-5 rounded-2xl border"
                                                style={{
                                                    borderColor: i === 0 ? '#C9996B40' : 'rgba(92,79,74,0.1)',
                                                    background: i === 0 ? '#C9996B05' : '#F8F4F0',
                                                }}
                                            >
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="font-semibold" style={{ color: '#5C4F4A' }}>{res.name}</span>
                                                    <span className="text-2xl font-bold" style={{ color: '#5C4F4A' }}>
                                                        {Math.round(res.probability)}%
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-[#EDE9E6] rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${res.probability}%` }}
                                                        className="h-full rounded-full"
                                                        style={{ background: '#C9996B' }}
                                                    />
                                                </div>
                                                {res.confidence?.is_low && (
                                                    <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: '#C9996B' }}>
                                                        <ShieldAlert size={14} />
                                                        Low confidence match
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Continue Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={!selections.length}
                                onClick={() => onComplete(results, selections)}
                                className="w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                                style={{
                                    background: 'linear-gradient(135deg, #C9996B 0%, #5C4F4A 100%)',
                                    color: '#FFFFFF',
                                    boxShadow: '0 15px 35px -10px rgba(201, 153, 107, 0.4)',
                                }}
                            >
                                Generate Full Report
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}