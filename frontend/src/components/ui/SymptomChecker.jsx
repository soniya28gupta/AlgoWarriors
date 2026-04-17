import React, { useState, useEffect, useMemo } from 'react';
import { analyzeSymptoms } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Stethoscope, CheckCircle, Search, ChevronRight,
    Activity, Wind, Droplets, Eye, ZapOff, Heart,
    ShieldAlert, BrainCircuit, Flame, Thermometer
} from 'lucide-react';

// ── Colour tokens ─────────────────────────────────────────────────
const C = {
    bg: '#EDE9E6',
    text: '#5C4F4A',
    textMuted: 'rgba(92,79,74,0.55)',
    green: '#5C766D',
    gold: '#C9996B',
    white: '#FFFFFF',
    card: '#F7F3EF',
    border: 'rgba(92,79,74,0.10)',
    borderStrong: 'rgba(92,79,74,0.20)',
};

// ── Icon helper ────────────────────────────────────────────────────
function getIcon(name = '') {
    const n = name.toLowerCase();
    if (n.includes('breath') || n.includes('cough') || n.includes('lung') || n.includes('wind'))
        return <Wind className="w-5 h-5" style={{ color: C.green }} />;
    if (n.includes('heart') || n.includes('chest') || n.includes('pal'))
        return <Heart className="w-5 h-5" style={{ color: C.gold }} />;
    if (n.includes('weight') || n.includes('thirst') || n.includes('urin') || n.includes('drop'))
        return <Droplets className="w-5 h-5" style={{ color: C.text }} />;
    if (n.includes('vision') || n.includes('eye') || n.includes('blur'))
        return <Eye className="w-5 h-5" style={{ color: C.green }} />;
    if (n.includes('fatigue') || n.includes('weak') || n.includes('tired'))
        return <ZapOff className="w-5 h-5" style={{ color: C.gold }} />;
    if (n.includes('fever') || n.includes('temp'))
        return <Thermometer className="w-5 h-5" style={{ color: C.gold }} />;
    if (n.includes('burn') || n.includes('hot'))
        return <Flame className="w-5 h-5" style={{ color: C.gold }} />;
    return <Activity className="w-5 h-5" style={{ color: C.textMuted }} />;
}

// ── Main Component ─────────────────────────────────────────────────
export default function SymptomChecker({ userId, onComplete }) {
    const [library, setLibrary]       = useState([]);
    const [selections, setSelections] = useState([]);   // [{id, severity}]
    const [results, setResults]       = useState([]);
    const [loading, setLoading]       = useState(true);
    const [evaluating, setEvaluating] = useState(false);
    const [searchQuery, setSearch]    = useState('');
    const [activeCategory, setActiveCat] = useState('all');
    const [searchFocused, setSearchFocused] = useState(false);

    /* ---------- load library ---------- */
    useEffect(() => {
        (async () => {
            try {
                const res = await analyzeSymptoms([]);
                setLibrary(res.symptom_library || []);
            } catch (e) {
                console.error('Failed to load symptom library', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* ---------- flat deduped list ---------- */
    const allSymptoms = useMemo(() => {
        const list = (library || []).flatMap(d =>
            d.symptoms.map(s => ({ ...s, categoryId: d.id }))
        );
        return Array.from(new Map(list.map(s => [s.id, s])).values());
    }, [library]);

    /* ---------- filtered ---------- */
    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return allSymptoms.filter(s =>
            (s.name.toLowerCase().includes(q) || (s.desc || '').toLowerCase().includes(q)) &&
            (activeCategory === 'all' || s.categoryId === activeCategory)
        );
    }, [allSymptoms, searchQuery, activeCategory]);

    /* ---------- live analysis (debounced 400 ms) ---------- */
    useEffect(() => {
        const t = setTimeout(async () => {
            if (!selections.length) { setResults([]); return; }
            setEvaluating(true);
            try {
                const res = await analyzeSymptoms(selections, userId);
                setResults(res.results || []);
            } catch (e) {
                console.error('Analysis failed', e);
            } finally {
                setEvaluating(false);
            }
        }, 400);
        return () => clearTimeout(t);
    }, [selections, userId]);

    /* ---------- handlers ---------- */
    const toggle = (id) =>
        setSelections(prev =>
            prev.find(s => s.id === id)
                ? prev.filter(s => s.id !== id)
                : [...prev, { id, severity: 'mild' }]
        );

    const setSeverity = (id, severity) =>
        setSelections(prev => prev.map(s => s.id === id ? { ...s, severity } : s));

    /* ---------- loading screen ---------- */
    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-5">
                <div className="p-4 rounded-2xl shadow-lg" style={{ background: `linear-gradient(135deg, ${C.green} 0%, ${C.text} 100%)` }}>
                    <Stethoscope className="w-9 h-9 text-white" />
                </div>
                <p className="text-sm animate-pulse" style={{ color: C.textMuted }}>Loading symptom library…</p>
            </div>
        </div>
    );

    /* ---------- category chip styles ---------- */
    const chipStyle = (id) => ({
        background: activeCategory === id ? C.green : C.white,
        color:      activeCategory === id ? C.white : C.text,
        border:     activeCategory === id ? 'none' : `1px solid ${C.border}`,
        fontWeight: 600,
        borderRadius: '9999px',
        padding: '8px 20px',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
    });

    return (
        <div className="grid lg:grid-cols-12 gap-8">

            {/* ═══════════════ LEFT — search + categories + symptom grid ═══════════════ */}
            <div className="lg:col-span-8 space-y-6">

                {/* Search bar */}
                <motion.div
                    className="relative"
                    animate={{ scale: searchFocused ? 1.005 : 1 }}
                    transition={{ duration: 0.15 }}
                >
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="w-5 h-5" style={{ color: searchFocused ? C.gold : C.textMuted }} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search symptoms or conditions..."
                        value={searchQuery}
                        onChange={e => setSearch(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl font-medium outline-none transition-all"
                        style={{
                            backgroundColor: C.white,
                            border: searchFocused
                                ? `2px solid ${C.gold}`
                                : '2px solid transparent',
                            boxShadow: searchFocused
                                ? `0 0 0 4px rgba(201,153,107,0.15), 0 4px 24px rgba(92,79,74,0.08)`
                                : '0 2px 12px rgba(92,79,74,0.06)',
                            color: C.text,
                        }}
                    />
                </motion.div>

                {/* Category chips */}
                <div className="flex flex-wrap gap-2">
                    <button style={chipStyle('all')} onClick={() => setActiveCat('all')}>
                        All Symptoms
                    </button>
                    {library.map(cat => (
                        <button key={cat.id} style={chipStyle(cat.id)} onClick={() => setActiveCat(cat.id)}>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Symptom cards — 2-col grid */}
                <AnimatePresence mode="popLayout">
                    <div className="grid sm:grid-cols-2 gap-4">
                        {filtered.map(s => {
                            const sel = selections.find(x => x.id === s.id);
                            return (
                                <motion.div
                                    key={s.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.18 }}
                                    onClick={() => toggle(s.id)}
                                    className="cursor-pointer rounded-3xl p-5 transition-all"
                                    style={{
                                        backgroundColor: sel ? 'rgba(201,153,107,0.06)' : C.white,
                                        border: sel
                                            ? `2px solid ${C.gold}`
                                            : `2px solid ${C.border}`,
                                        boxShadow: sel
                                            ? '0 8px 30px rgba(201,153,107,0.12)'
                                            : '0 2px 12px rgba(92,79,74,0.04)',
                                    }}
                                >
                                    <div className="flex gap-4">
                                        {/* Icon bubble */}
                                        <div
                                            className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                                            style={{ background: sel ? 'rgba(201,153,107,0.15)' : C.bg }}
                                        >
                                            {getIcon(s.name)}
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="font-semibold text-base leading-snug" style={{ color: C.text }}>
                                                    {s.name}
                                                </span>
                                                {sel && <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: C.green }} />}
                                            </div>
                                            <p className="text-sm mt-1 leading-relaxed" style={{ color: C.textMuted }}>
                                                {s.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Severity row (only when selected) */}
                                    <AnimatePresence>
                                        {sel && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 pt-4 flex gap-2"
                                                style={{ borderTop: `1px solid rgba(201,153,107,0.25)` }}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                {['Mild', 'Moderate', 'Severe'].map(sev => {
                                                    const active = sel.severity === sev.toLowerCase();
                                                    return (
                                                        <button
                                                            key={sev}
                                                            onClick={() => setSeverity(s.id, sev.toLowerCase())}
                                                            className="px-4 py-1.5 text-xs font-semibold rounded-xl transition-all"
                                                            style={{
                                                                background: active ? C.green : C.bg,
                                                                color: active ? C.white : C.text,
                                                            }}
                                                        >
                                                            {sev}
                                                        </button>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </AnimatePresence>

                {filtered.length === 0 && !loading && (
                    <div className="py-20 text-center">
                        <p className="text-sm" style={{ color: C.textMuted }}>No symptoms found. Try a different search.</p>
                    </div>
                )}
            </div>

            {/* ═══════════════ RIGHT — Live Analysis + CTA ═══════════════ */}
            <div className="lg:col-span-4">
                <div className="sticky top-28 space-y-5">

                    {/* Live Analysis card */}
                    <div
                        className="rounded-3xl p-7 overflow-hidden"
                        style={{
                            backgroundColor: C.white,
                            boxShadow: '0 20px 60px -15px rgba(92,79,74,0.14)',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <BrainCircuit className="w-5 h-5" style={{ color: C.green }} />
                                <h3 className="font-bold text-lg" style={{ color: C.text }}>Live Analysis</h3>
                            </div>
                            {evaluating && (
                                <span
                                    className="text-xs font-semibold px-3 py-1 rounded-full"
                                    style={{ background: 'rgba(201,153,107,0.15)', color: C.gold }}
                                >
                                    Analyzing…
                                </span>
                            )}
                        </div>

                        {/* Empty state */}
                        {results.length === 0 ? (
                            <div className="py-14 flex flex-col items-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center"
                                    style={{ background: C.bg }}
                                >
                                    <Activity className="w-8 h-8" style={{ color: C.textMuted }} />
                                </div>
                                <p className="text-sm text-center" style={{ color: C.textMuted }}>
                                    Select symptoms to see<br />potential conditions
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {results.map((res, i) => (
                                    <motion.div
                                        key={res.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-2xl"
                                        style={{
                                            background: i === 0 ? 'rgba(201,153,107,0.05)' : C.card,
                                            border: `1px solid ${i === 0 ? 'rgba(201,153,107,0.35)' : C.border}`,
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-sm" style={{ color: C.text }}>
                                                {res.name}
                                            </span>
                                            <span className="text-xl font-bold" style={{ color: C.text }}>
                                                {Math.round(res.probability)}%
                                            </span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.bg }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${res.probability}%` }}
                                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                                className="h-full rounded-full"
                                                style={{ background: C.gold }}
                                            />
                                        </div>

                                        {/* Low confidence badge */}
                                        {res.confidence?.is_low && (
                                            <div className="mt-2.5 flex items-center gap-1.5 text-xs" style={{ color: C.gold }}>
                                                <ShieldAlert className="w-3.5 h-3.5" />
                                                Low confidence match
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Generate Full Report button */}
                    <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!selections.length}
                        onClick={() => onComplete(results, selections)}
                        className="w-full py-5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all"
                        style={{
                            background: selections.length
                                ? 'linear-gradient(135deg, #C9996B 0%, #5C4F4A 100%)'
                                : '#d4ccc7',
                            color: C.white,
                            boxShadow: selections.length
                                ? '0 15px 35px -8px rgba(201,153,107,0.40)'
                                : 'none',
                            cursor: selections.length ? 'pointer' : 'not-allowed',
                        }}
                    >
                        Generate Full Report
                        <ChevronRight className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}