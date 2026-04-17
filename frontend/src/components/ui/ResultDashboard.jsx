import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Activity, AlertTriangle, CheckCircle, Info, TrendingUp, XCircle, BrainCircuit, Apple, HeartPulse, Moon, Stethoscope, Hexagon, FileText, Download, FlameKindling, Info as InfoIcon } from 'lucide-react';
import { getHistory } from '../../services/api';
import { generateDoctorReport } from '../../utils/pdfGenerator';
import RecommendationDashboard from './RecommendationDashboard';
import HospitalMap from './HospitalMap';

const generateTrendData = (currentRisk) => {
  return Array.from({ length: 6 }).map((_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    risk: Math.max(0, currentRisk + (Math.random() * 20 - 10) - (5 - i) * 2),
  }));
};

const CircularProgress = ({ percentage, color, label = "Risk" }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = percentage / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= percentage) {
        setVal(percentage);
        clearInterval(timer);
      } else {
        setVal(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [percentage]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (val / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-48 h-48">
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-slate-700/50"
        />
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="drop-shadow-[0_0_10px_rgba(currentColor,0.5)] transition-all duration-300"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight glow-text" style={{ color }}>
          {Math.round(val)}%
        </span>
        <span className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-bold">{label}</span>
      </div>
    </div>
  );
};

export default function ResultDashboard({ result, formData, diseaseType, onReset }) {
  const { risk_percentage, risk_level, care_plan, stroke_risk } = result;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const colorMap = {
    Low: '#22c55e',    // Green
    Medium: '#eab308', // Yellow
    High: '#ef4444',   // Red
  };

  const iconMap = {
    Low: <CheckCircle className="w-6 h-6 text-green-500" />,
    Medium: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
    High: <XCircle className="w-6 h-6 text-red-500" />,
  };

  const color = colorMap[risk_level] || colorMap.Low;
  const trendData = generateTrendData(risk_percentage);

  // Stroke color stratifier
  const strokeColor = stroke_risk > 70 ? '#ef4444' : stroke_risk > 35 ? '#f97316' : '#3b82f6';
  const strokeLabel = stroke_risk > 70 ? 'CRITICAL' : stroke_risk > 35 ? 'ELEVATED' : 'LOW';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.6 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  };

  const guidanceCards = care_plan ? [
    { title: "Dietary Adjustments", text: care_plan.diet, icon: Apple, color: "text-green-400", border: "border-green-500/30" },
    { title: "Exercise Protocol", text: care_plan.exercise, icon: HeartPulse, color: "text-rose-400", border: "border-rose-500/30" },
    { title: "Lifestyle Habit Changes", text: care_plan.lifestyle, icon: Moon, color: "text-indigo-400", border: "border-indigo-500/30" },
    { title: "Medical Consultation", text: care_plan.medical, icon: Stethoscope, color: "text-blue-400", border: "border-blue-500/30" }
  ] : [];

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const userId = localStorage.getItem('user_id');
      let historyData = [];
      let username = "Anonymous";

      if (userId) {
        const apiRes = await getHistory(userId);
        historyData = apiRes.history || [];
        username = apiRes.username || "Anonymous";
      }

      generateDoctorReport(username, diseaseType || "Health", formData || {}, result, historyData);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Score Card */}
        <div className="col-span-1 xl:col-span-2 glass-panel rounded-2xl p-8 relative overflow-hidden group border border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="flex flex-col md:flex-row items-center justify-between z-10 relative">
            <div className="space-y-4 mb-6 md:mb-0 max-w-sm">
              <div className="flex items-center space-x-3">
                <Activity className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold">Health Assessment</h2>
              </div>

              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-slate-700/50 shadow-lg">
                {iconMap[risk_level]}
                <span className="font-semibold tracking-wide" style={{ color }}>{risk_level} Risk Stage</span>
              </div>

              <p className="text-slate-300 mt-4 text-sm leading-relaxed border-l-2 border-blue-500/50 pl-4 py-1">
                {result.is_symptom_only ?
                  "Statistical weighted match based on clinical symptom protocols." :
                  (care_plan?.analysis || "NeuraHealth engine complete. Analysis computed securely against population baselines.")
                }
              </p>
            </div>

            <div className="flex space-x-6 items-center">
              <CircularProgress percentage={risk_percentage} color={color} label="Base Risk" />

              {/* Optional Stroke Risk */}
              {stroke_risk !== undefined && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="hidden md:flex flex-col items-center bg-slate-800/40 p-4 border border-slate-700/50 rounded-2xl relative"
                >
                  <Hexagon className="absolute text-slate-700 w-full h-full opacity-20" />
                  <span className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Stroke Propensity</span>
                  <span className="text-3xl font-extrabold tracking-tighter" style={{ color: strokeColor }}>
                    {stroke_risk}%
                  </span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-black/30 rounded mt-2 border" style={{ borderColor: strokeColor, color: strokeColor }}>
                    {strokeLabel}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Cross-Disease Analysis (Symptom Mode Only) */}
        {result.is_symptom_only && result.all_symptom_matches?.length > 1 && (
          <div className="col-span-1 xl:col-span-3 glass-panel rounded-2xl p-6 border border-white/5 bg-slate-900/60 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -z-10" />
            <div className="flex items-center space-x-2 mb-4">
              <FlameKindling className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Associated Risk Patterns Detected</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.all_symptom_matches.slice(1).map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">{m.name}</span>
                    <span className="text-lg font-black text-white">{Math.round(m.probability)}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" style={{ width: `${m.probability}%` }} />
                  </div>
                  <div className="mt-3">
                    <p className="text-[10px] text-slate-500 line-clamp-1 italic">Common: {m.matched_symptoms.slice(0, 3).join(", ")}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center space-x-2">
              <InfoIcon className="w-4 h-4 text-slate-500" />
              <p className="text-[10px] text-slate-500 italic uppercase font-bold tracking-tight">System identified overlapping indicators across multiple diagnostic sectors.</p>
            </div>
          </div>
        )}


      </div>

      {stroke_risk !== undefined && stroke_risk > 35 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="glass-panel p-6 border-red-500/40 bg-red-900/10 rounded-2xl flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0"
        >
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 neon-glow-red">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-400 mb-1">Near-Future Stroke Warning Triggered</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              The advanced cerebrovascular mapping model has detected an elevated stroke vulnerability pattern explicitly linked to your profile parameters. Immediate review of the actionable items below is strongly advised.
            </p>
          </div>
        </motion.div>
      )}

      {/* Logics & Computations (Symptom Assessments only) */}


      {/* AI Personalized Care Plan */}
      <div className="glass-panel rounded-2xl p-8 relative overflow-hidden border border-slate-700/50">
        <motion.div
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-cyan-400 to-transparent neon-glow-cyan opacity-50"
        />

        <div className="flex items-center space-x-3 mb-8 border-b border-slate-700/50 pb-4">
          <div className="p-2 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            AI Synchronized Care Plan
          </h3>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {guidanceCards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`flex flex-col space-y-3 bg-slate-800/40 p-5 rounded-xl border ${card.border} hover:bg-slate-700/40 transition-colors`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <card.icon className={`w-5 h-5 ${card.color}`} />
                <h4 className="font-semibold text-slate-200 tracking-wide">{card.title}</h4>
              </div>
              <p className="text-slate-400 leading-relaxed font-light text-sm pl-8 border-l-2 border-slate-700/50">{card.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Emergency Map Launcher */}
      <div className="flex justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMap(true)}
          className="group relative flex items-center space-x-4 px-12 py-5 bg-slate-900 border border-rose-500/30 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(244,63,94,0.15)] transition-all hover:border-rose-500/60 hover:shadow-[0_0_40px_rgba(244,63,94,0.25)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
            <MapPin className="w-7 h-7 text-rose-500 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 leading-none mb-1.5">Critical Infrastructure</span>
            <span className="block text-lg font-extrabold text-white tracking-tight">Locate Nearest Hospital Now</span>
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {showMap && <HospitalMap onClose={() => setShowMap(false)} />}
      </AnimatePresence>

      <RecommendationDashboard formData={formData} riskPercentage={risk_percentage} diseaseType={diseaseType} />

      <div className="flex flex-col sm:flex-row items-center justify-center pt-4 space-y-4 sm:space-y-0 sm:space-x-6 border-t border-slate-700/50 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="flex items-center space-x-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 border border-purple-500/50 text-white font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-50"
        >
          {isGeneratingPdf ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span>Download Doctor-Ready PDF</span>
              <Download className="w-4 h-4 ml-1 opacity-70" />
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="px-8 py-3.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-colors"
        >
          Run Another Analysis
        </motion.button>
      </div>
    </motion.div>
  );
}
