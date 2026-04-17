import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { loginUser, registerUser } from '../../services/api';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setSuccessMsg('');

    try {
      if (isLogin) {
        const data = await loginUser(formData.username, formData.password);
        onLoginSuccess(data.user_id, false);
      } else {
        const data = await registerUser(formData.username, formData.password);
        setSuccessMsg("Registration successful! Initiating setup...");
        setTimeout(() => {
            onLoginSuccess(data.user_id, true);
        }, 1500);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-purple-900/20 -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-8 rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)]"
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="flex justify-center mb-8">
          <div className="p-3 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Activity className="w-10 h-10 text-cyan-400" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-2 glow-text">
          {isLogin ? 'Welcome Back' : 'Join NeuraHealth'}
        </h2>
        <p className="text-center text-slate-400 mb-8 text-sm">
          {isLogin ? 'Enter your credentials to access your AI analysis.' : 'Register securely to track your diagnostic footprint.'}
        </p>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm mb-4 text-center">
              {error}
            </motion.div>
          )}
          {successMsg && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm mb-4 text-center flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4" /> <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="block w-full pl-12 pr-4 py-3.5 border border-slate-700/50 rounded-xl bg-slate-800/40 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all font-medium glow-input outline-none"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="block w-full pl-12 pr-4 py-3.5 border border-slate-700/50 rounded-xl bg-slate-800/40 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all font-medium glow-input outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !!successMsg}
            className="w-full relative flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all overflow-hidden group disabled:opacity-50"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <>
                 <span>{isLogin ? 'Access Diagnostics' : 'Initialize Profile'}</span>
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-700/50 pt-5">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Register now." : "Already mapped? Login directly."}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
