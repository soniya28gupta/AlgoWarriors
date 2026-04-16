import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle, Info, TrendingUp, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock trend data
const generateTrendData = (currentRisk) => {
  return Array.from({ length: 6 }).map((_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    risk: Math.max(0, currentRisk + (Math.random() * 20 - 10) - (5 - i) * 2),
  }));
};

const CircularProgress = ({ percentage, color }) => {
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
          className="text-slate-700"
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
        <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Risk</span>
      </div>
    </div>
  );
};

export default function ResultDashboard({ result, onReset }) {
  const { risk_percentage, risk_level, reasons, recommendations } = result;

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Score Card */}
        <div className="col-span-1 md:col-span-2 glass-panel rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex flex-col md:flex-row items-center justify-between z-10 relative">
            <div className="space-y-4 mb-6 md:mb-0">
              <div className="flex items-center space-x-3">
                <Activity className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold">Health Assessment</h2>
              </div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-slate-700/50 shadow-lg">
                {iconMap[risk_level]}
                <span className="font-semibold tracking-wide" style={{ color }}>{risk_level} Risk Level</span>
              </div>
              <p className="text-slate-400 max-w-sm mt-4">
                AI Summary: You have a {risk_level.toLowerCase()} probability indication based on your metrics. {risk_level === 'High' ? 'Immediate consultation recommended.' : 'Keep monitoring.'}
              </p>
            </div>
            
            <CircularProgress percentage={risk_percentage} color={color} />
          </div>
        </div>

        {/* Trend Graph */}
        <div className="col-span-1 glass-panel rounded-2xl p-6 flex flex-col">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold">6-Month Trend</h3>
          </div>
          <div className="flex-1 min-h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="risk" stroke={color} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reasons */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 neon-glow-blue"></div>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Info className="w-5 h-5 text-blue-400" />
            <span>Key Factors</span>
          </h3>
          <ul className="space-y-3">
            {reasons?.map((reason, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex items-start space-x-3 text-slate-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0 neon-glow-blue"></div>
                <span>{reason}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 neon-glow-purple"></div>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
            <span>AI Recommendations</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {recommendations?.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx }}
                className="px-4 py-2 rounded-full glass-panel border border-slate-700/50 text-sm font-medium text-slate-200 hover:border-purple-500/50 hover:bg-purple-500/10 transition-colors cursor-default"
              >
                {rec}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="px-8 py-3 rounded-full bg-slate-800 border border-slate-700 text-white font-medium hover:bg-slate-700 transition-colors shadow-lg"
        >
          Run Another Analysis
        </motion.button>
      </div>
    </motion.div>
  );
}
