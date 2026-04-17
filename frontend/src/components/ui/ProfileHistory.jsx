import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getHistory } from '../../services/api';
import { Clock, Activity, Target, ArrowLeft, Database, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileHistory({ userId }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const result = await getHistory(userId);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) fetchHistory();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-8 h-8 flex border-2 border-slate-700 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div className="glass-panel p-6 border-red-500/30 bg-red-900/10 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-slate-800 rounded-lg text-white">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 relative z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/5 to-slate-900 -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Diagnostics</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold glow-text">Diagnostic Vault</h1>
            <p className="text-slate-400 text-sm mt-1">Logged in securely as <span className="text-cyan-400 font-semibold">{data.username}</span></p>
          </div>
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 glass-panel border border-slate-700/50 rounded-full">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-300">ATLAS SECURED</span>
          </div>
        </div>

        {/* Onboarding Snapshot */}
        {data.onboarding_data && Object.keys(data.onboarding_data).length > 0 && (
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-cyan-900/5">
            <div className="flex items-center space-x-2 mb-4 text-cyan-400">
              <Target className="w-5 h-5" />
              <h3 className="font-bold">Lifestyle Vector</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(data.onboarding_data).map(([key, val]) => (
                <div key={key} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                   <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">{key.replace('_', ' ')}</p>
                   <p className="text-slate-200 font-medium">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <h3 className="text-xl font-bold flex items-center space-x-2 border-b border-slate-700/50 pb-4">
          <Clock className="w-6 h-6 text-blue-400" />
          <span>Prediction History</span>
        </h3>

        {data.history && data.history.length > 0 ? (
          <div className="space-y-6">
            {data.history.map((pred, i) => {
               const date = new Date(pred.timestamp);
               const isHighRisk = pred.risk_percentage > 70;
               return (
                 <motion.div 
                   key={pred._id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className={`glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between border-l-4 ${isHighRisk ? 'border-l-red-500 bg-red-900/5' : 'border-l-cyan-500'}`}
                 >
                   <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl mt-1 ${isHighRisk ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                         <Activity className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="text-lg font-bold capitalize text-slate-100">{pred.disease} Analysis</h4>
                         <div className="flex items-center space-x-3 text-sm text-slate-400 mt-1">
                            <span className="flex items-center space-x-1"><Calendar className="w-4 h-4" /> <span>{date.toLocaleDateString()}</span></span>
                            <span>•</span>
                            <span>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         </div>
                         <p className="text-sm mt-3 text-slate-300 max-w-xl line-clamp-2 md:line-clamp-none">{pred.care_plan?.analysis}</p>
                      </div>
                   </div>
                   
                   <div className="mt-4 md:mt-0 flex md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto p-4 md:p-0 bg-slate-800/50 md:bg-transparent rounded-xl md:rounded-none">
                      <div className="text-right">
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Base Risk</span>
                         <span className={`text-3xl font-extrabold ${isHighRisk ? 'text-red-400 glow-text-red' : 'text-cyan-400'}`}>{pred.risk_percentage}%</span>
                      </div>
                      {pred.stroke_risk !== undefined && (
                        <div className="text-right md:mt-2">
                           <span className="text-[10px] font-bold text-orange-500/70 border border-orange-500/30 px-2 py-0.5 rounded uppercase tracking-widest block mb-1">Stroke Propensity</span>
                           <span className="text-xl font-bold text-orange-400">{pred.stroke_risk}%</span>
                        </div>
                      )}
                   </div>
                 </motion.div>
               );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-slate-700 border-dashed">
             <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
             <p className="text-slate-400">No predictions recorded yet. Run your first analysis to begin tracking your footprint.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
