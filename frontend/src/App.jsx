import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Activity, Heart, ShieldAlert, ChevronRight } from 'lucide-react';
import BackgroundScene from './components/ui/BackgroundScene';
import DiabetesForm from './components/forms/DiabetesForm';
import HeartForm from './components/forms/HeartForm';
import CancerForm from './components/forms/CancerForm';
import ResultDashboard from './components/ui/ResultDashboard';
import Loader from './components/ui/Loader';
import { predictRisk } from './services/api';

const DIABETES = 'diabetes';
const HEART = 'heart';
const CANCER = 'cancer';

export default function App() {
  const [activeTab, setActiveTab] = useState(DIABETES);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const tabs = [
    { id: DIABETES, label: 'Diabetes', icon: Activity, color: 'text-blue-400', glowColor: 'neon-glow-blue', badge: 'bg-blue-500' },
    { id: HEART, label: 'Heart Disease', icon: Heart, color: 'text-red-400', glowColor: 'hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]', badge: 'bg-red-500' },
    { id: CANCER, label: 'Cancer Risk', icon: ShieldAlert, color: 'text-purple-400', glowColor: 'neon-glow-purple', badge: 'bg-purple-500' }
  ];

  const handleTabChange = (id) => {
    setActiveTab(id);
    setFormData({}); // Reset form when switching tabs
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const prediction = await predictRisk(activeTab, formData);
      setResult(prediction);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      <BackgroundScene />

      {/* Navbar */}
      <nav className="glass-panel border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center neon-glow-blue">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              NeuraHealth AI
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-400">Hackathon Edition</span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse neon-glow-green" />
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 z-10 max-w-7xl">
        {/* Hero Section */}
        {!result && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              AI Health Risk <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 glow-text">Predictor</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
              Early Detection. Smarter Prevention. Powered by advanced machine learning to analyze your biometrics and identify potential risks before they manifest.
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader />
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <ResultDashboard result={result} onReset={() => setResult(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
              {/* Sidebar Tabs */}
              <div className="lg:col-span-1 space-y-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                        isActive 
                          ? `bg-slate-800/80 shadow-lg ${
                              tab.id === DIABETES ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 
                              tab.id === HEART ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 
                              'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                            } ${tab.color}`
                          : 'glass-panel border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                         <div className={`p-2 rounded-lg ${
                           isActive ? (tab.id === DIABETES ? 'bg-blue-500/20' : tab.id === HEART ? 'bg-red-500/20' : 'bg-purple-500/20') : 'bg-slate-800/80'
                         }`}>
                           <Icon className="w-5 h-5" />
                         </div>
                         <span className="font-semibold tracking-wide">{tab.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-5 h-5" />}
                    </motion.button>
                  )
                })}
                
                {/* Micro-Card info */}
                <div className="glass-panel p-5 rounded-2xl border border-slate-700/50 mt-8 hidden lg:block relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5"></div>
                  <h3 className="font-semibold text-slate-300 mb-2">Secure & Private</h3>
                  <p className="text-sm text-slate-500">Your health data is analyzed locally and never stored. E2E encryption enabled.</p>
                </div>
              </div>

              {/* Form Panel */}
              <div className="lg:col-span-3">
                <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
                  {/* Decorative background glow inside the form panel */}
                  <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full mix-blend-screen filter blur-[80px] opacity-20 ${tabs.find(t=>t.id === activeTab).badge}`}></div>
                  
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700/50">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <span className="capitalize">{activeTab}</span> 
                        <span className="font-light text-slate-400">Analysis</span>
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">Provide clinical parameters for accurate prediction.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {activeTab === DIABETES && <DiabetesForm formData={formData} setFormData={setFormData} />}
                        {activeTab === HEART && <HeartForm formData={formData} setFormData={setFormData} />}
                        {activeTab === CANCER && <CancerForm formData={formData} setFormData={setFormData} />}
                      </motion.div>
                    </AnimatePresence>

                    <div className="mt-10 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className={`group relative px-8 py-3 rounded-xl overflow-hidden font-bold tracking-wide shadow-lg transition-all ${
                          activeTab === DIABETES ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30 glow-button' : 
                          activeTab === HEART ? 'bg-red-600 hover:bg-red-500 shadow-red-500/30' : 
                          'bg-purple-600 hover:bg-purple-500 shadow-purple-500/30'
                        }`}
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative flex items-center space-x-2">
                          <span>Start Analysis</span>
                          <Activity className="w-5 h-5 ml-2" />
                        </span>
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
