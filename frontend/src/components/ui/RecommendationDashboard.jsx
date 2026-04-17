// import React, { useState } from 'react';
// import { getGeminiRecommendations } from '../../services/api';
// import { getFallbackRecommendations } from '../../utils/mockRecommendations';
// import { Activity, AlertOctagon, CheckCircle, Clock, Calendar, Utensils, HeartPulse, XCircle } from 'lucide-react';
// import { motion } from 'framer-motion';

// export default function RecommendationDashboard({ formData, riskPercentage, diseaseType }) {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);

//   const fetchPlan = async () => {
//     setLoading(true);
//     try {
//       // Attempting real-time Gemini AI integration
//       const result = await getGeminiRecommendations(formData, riskPercentage, diseaseType);
//       setData(result);
//     } catch (err) {
//       console.error("Gemini API Failed:", err);
//       // Seamlessly fall back to local heuristic logic if API is blocked (403/500)
//       const fallback = await getFallbackRecommendations(diseaseType, riskPercentage);
//       setData(fallback);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!data) {
//     return (
//       <div className="flex justify-center p-6 border-t border-slate-700/50 mt-8">
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={fetchPlan}
//           disabled={loading}
//           className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-500/50 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] disabled:opacity-50 flex items-center space-x-2"
//         >
//           {loading ? (
//             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//           ) : (
//             <Activity className="w-5 h-5" />
//           )}
//           <span>{loading ? "Synthesizing True AI Plan..." : "Generate AI Personalized Health Plan"}</span>
//         </motion.button>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-5xl mx-auto space-y-6 mt-12 bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-blue-500/20 shadow-2xl"
//     >
//       <div className="flex items-center justify-center space-x-3 mb-8">
//         <Activity className="w-8 h-8 text-blue-400" />
//         <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
//           Generative AI Care Protocol
//         </h2>
//       </div>

//       {/* 1. Summary Card */}
//       <div className="glass-panel p-6 rounded-2xl bg-blue-900/20 border border-blue-500/30">
//         <h3 className="text-xl font-bold mb-3 flex items-center text-blue-400">
//           <Activity className="w-6 h-6 mr-2" /> Clinical Summary
//         </h3>
//         <p className="text-slate-200 text-sm leading-relaxed">{data.summary}</p>
//       </div>

//       {/* 2. Risk Explanation & Warnings */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
//           <h3 className="font-bold mb-4 flex items-center text-orange-400">
//             <AlertOctagon className="w-5 h-5 mr-2" /> Risk Factors
//           </h3>
//           <ul className="space-y-2">
//             {data.risk_explanation?.map((risk, i) => (
//               <li key={i} className="text-sm text-slate-300 flex items-start break-words">
//                 <span className="text-orange-400 mr-2">•</span> {risk}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {data.warnings?.length > 0 && (
//           <div className="glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-900/10">
//             <h3 className="font-bold mb-4 flex items-center text-red-400">
//               <AlertOctagon className="w-5 h-5 mr-2" /> Urgent Warnings
//             </h3>
//             <ul className="space-y-2">
//               {data.warnings.map((warn, i) => (
//                 <li key={i} className="text-sm text-slate-300 flex items-start text-red-200">
//                   <span className="text-red-500 mr-2">•</span> {warn}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* 3. Do / Don't */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="glass-panel p-6 rounded-2xl border border-green-500/30 bg-green-900/10">
//           <h3 className="font-bold text-green-400 flex items-center mb-4"><CheckCircle className="w-5 h-5 mr-2" /> Recommended (Do)</h3>
//           <ul className="space-y-3">
//             {data.lifestyle_changes?.do?.map((item, i) => (
//               <li key={i} className="text-sm text-slate-300 flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />{item}</li>
//             ))}
//           </ul>
//         </div>
//         <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 bg-rose-900/10">
//           <h3 className="font-bold text-rose-400 flex items-center mb-4"><XCircle className="w-5 h-5 mr-2" /> Avoid (Don't)</h3>
//           <ul className="space-y-3">
//             {data.lifestyle_changes?.dont?.map((item, i) => (
//               <li key={i} className="text-sm text-slate-300 flex items-start"><XCircle className="w-4 h-4 mr-2 text-rose-500 mt-0.5 flex-shrink-0" />{item}</li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* 4. Diet & Exercise */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
//           <h3 className="font-bold mb-4 flex items-center text-emerald-400"><Utensils className="w-5 h-5 mr-2" /> Diet Plan</h3>
//           <ul className="space-y-2">
//             {data.diet_plan?.map((item, i) => (
//               <li key={i} className="text-sm text-slate-300 list-disc ml-5">{item}</li>
//             ))}
//           </ul>
//         </div>
//         <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
//           <h3 className="font-bold mb-4 flex items-center text-cyan-400"><HeartPulse className="w-5 h-5 mr-2" /> Exercise Protocol</h3>
//           <ul className="space-y-2">
//             {data.exercise_plan?.map((item, i) => (
//               <li key={i} className="text-sm text-slate-300 list-disc ml-5">{item}</li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* 5. & 6. Daily Plan Schedule */}
//       <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
//         <h3 className="font-bold mb-6 flex items-center text-purple-400"><Clock className="w-5 h-5 mr-2" /> Detailed Daily Plan</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//           {Object.entries(data.daily_plan || {}).map(([time, tasks]) => (
//             <div key={time} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/30">
//               <h4 className="font-semibold text-slate-200 capitalize mb-3 border-b border-slate-700/50 pb-2">{time}</h4>
//               <ul className="space-y-2">
//                 {tasks.map((t, i) => <li key={i} className="text-xs text-slate-400 leading-relaxed tracking-wide">• {t}</li>)}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>



//     </motion.div>
//   );
// }


import React, { useState } from 'react';
import { getGeminiRecommendations } from '../../services/api';
import { getFallbackRecommendations } from '../../utils/mockRecommendations';
import {
  Activity, AlertOctagon, CheckCircle, Clock,
  Utensils, HeartPulse, XCircle, BrainCircuit
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecommendationDashboard({ formData, riskPercentage, diseaseType }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const result = await getGeminiRecommendations(formData, riskPercentage, diseaseType);
      setData(result);
    } catch (err) {
      console.error("Gemini API Failed:", err);
      const fallback = await getFallbackRecommendations(diseaseType, riskPercentage);
      setData(fallback);
    } finally {
      setLoading(false);
    }
  };

  // Loading / Generate Button State
  if (!data) {
    return (
      <div className="max-w-4xl mx-auto mt-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div
            className="mx-auto mb-6 p-6 rounded-3xl inline-flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #5C766D 0%, #5C4F4A 100%)' }}
          >
            <BrainCircuit className="w-12 h-12 text-white" />
          </div>

          <h3 className="text-2xl font-bold mb-3" style={{ color: '#5C4F4A' }}>
            Personalized AI Care Plan
          </h3>
          <p className="text-sm max-w-sm mx-auto mb-8" style={{ color: '#5C4F4A80' }}>
            Generate a detailed, AI-powered health recommendation based on your analysis
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={fetchPlan}
            disabled={loading}
            className="px-10 py-5 rounded-2xl font-semibold text-white flex items-center gap-3 shadow-xl transition-all mx-auto"
            style={{
              background: 'linear-gradient(135deg, #C9996B 0%, #5C4F4A 100%)',
            }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating AI Plan...</span>
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                <span>Generate AI Personalized Health Plan</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-10 shadow-2xl"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div
            className="p-4 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #5C766D 0%, #5C4F4A 100%)' }}
          >
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: '#5C4F4A' }}>
              AI Personalized Care Protocol
            </h2>
            <p className="text-sm mt-1" style={{ color: '#5C4F4A80' }}>
              Tailored recommendations based on your health profile
            </p>
          </div>
        </div>

        {/* Clinical Summary */}
        <div className="mb-10 p-8 rounded-3xl border" style={{ borderColor: '#EDE9E6' }}>
          <h3 className="font-semibold text-xl mb-4 flex items-center gap-3" style={{ color: '#5C4F4A' }}>
            <BrainCircuit className="w-6 h-6" style={{ color: '#5C766D' }} />
            Clinical Summary
          </h3>
          <p className="text-base leading-relaxed" style={{ color: '#5C4F4A80' }}>
            {data.summary}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Risk Factors */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl border"
            style={{ borderColor: '#EDE9E6' }}
          >
            <h3 className="font-semibold text-xl mb-6 flex items-center gap-3" style={{ color: '#C9996B' }}>
              <AlertOctagon className="w-6 h-6" />
              Key Risk Factors
            </h3>
            <ul className="space-y-4">
              {data.risk_explanation?.map((risk, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#5C4F4A' }}>
                  <span className="text-xl leading-none mt-0.5" style={{ color: '#C9996B' }}>•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Urgent Warnings */}
          {data.warnings?.length > 0 && (
            <motion.div
              whileHover={{ y: -4 }}
              className="p-8 rounded-3xl border"
              style={{ borderColor: '#EDE9E6' }}
            >
              <h3 className="font-semibold text-xl mb-6 flex items-center gap-3" style={{ color: '#9C6644' }}>
                <AlertOctagon className="w-6 h-6" />
                Important Warnings
              </h3>
              <ul className="space-y-4">
                {data.warnings.map((warn, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#5C4F4A' }}>
                    <span className="text-xl leading-none mt-0.5" style={{ color: '#9C6644' }}>•</span>
                    {warn}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Do & Don't */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Recommended (Do) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl border"
            style={{ borderColor: '#5C766D30' }}
          >
            <h3 className="font-semibold text-xl mb-6 flex items-center gap-3" style={{ color: '#5C766D' }}>
              <CheckCircle className="w-6 h-6" />
              Recommended Actions
            </h3>
            <ul className="space-y-4">
              {data.lifestyle_changes?.do?.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#5C4F4A' }}>
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#5C766D' }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Avoid (Don't) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl border"
            style={{ borderColor: '#EDE9E6' }}
          >
            <h3 className="font-semibold text-xl mb-6 flex items-center gap-3" style={{ color: '#9C6644' }}>
              <XCircle className="w-6 h-6" />
              Things to Avoid
            </h3>
            <ul className="space-y-4">
              {data.lifestyle_changes?.dont?.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#5C4F4A' }}>
                  <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#9C6644' }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Diet & Exercise */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Diet Plan */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl border"
            style={{ borderColor: '#EDE9E6' }}
          >
            <h3 className="font-semibold text-xl mb-6 flex items-center gap-3" style={{ color: '#5C766D' }}>
              <Utensils className="w-6 h-6" />
              Diet Recommendations
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: '#5C4F4A' }}>
              {data.diet_plan?.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5" style={{ color: '#C9996B' }}>•</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Exercise Protocol */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl border"
            style={{ borderColor: '#EDE9E6' }}
          >
            <h3 className="font-semibold text-xl mb-6 flex items-center gap-3" style={{ color: '#5C766D' }}>
              <HeartPulse className="w-6 h-6" />
              Exercise Protocol
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: '#5C4F4A' }}>
              {data.exercise_plan?.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5" style={{ color: '#C9996B' }}>•</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Daily Plan Schedule */}
        {data.daily_plan && Object.keys(data.daily_plan).length > 0 && (
          <div className="mt-8 p-8 rounded-3xl border" style={{ borderColor: '#EDE9E6' }}>
            <h3 className="font-semibold text-xl mb-8 flex items-center gap-3" style={{ color: '#5C4F4A' }}>
              <Clock className="w-6 h-6" />
              Suggested Daily Schedule
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(data.daily_plan).map(([time, tasks]) => (
                <motion.div
                  key={time}
                  whileHover={{ y: -3 }}
                  className="p-6 rounded-2xl border transition-all"
                  style={{ borderColor: '#EDE9E6' }}
                >
                  <div className="font-semibold text-lg mb-4 capitalize" style={{ color: '#5C766D' }}>
                    {time}
                  </div>
                  <ul className="space-y-2.5 text-sm" style={{ color: '#5C4F4A80' }}>
                    {tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 text-xs" style={{ color: '#C9996B' }}>●</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}