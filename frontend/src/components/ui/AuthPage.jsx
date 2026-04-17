// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Activity, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
// import { loginUser, registerUser } from '../../services/api';

// export default function AuthPage({ onLoginSuccess }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState('');

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);
//     setSuccessMsg('');

//     try {
//       if (isLogin) {
//         const data = await loginUser(formData.username, formData.password);
//         onLoginSuccess(data.user_id, false);
//       } else {
//         const data = await registerUser(formData.username, formData.password);
//         setSuccessMsg("Registration successful! Initiating setup...");
//         setTimeout(() => {
//             onLoginSuccess(data.user_id, true);
//         }, 1500);
//       }
//     } catch (err) {
//       setError(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 relative z-10 overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-purple-900/20 -z-10" />

//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="glass-panel w-full max-w-md p-8 rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)]"
//       >
//         {/* Glow Effects */}
//         <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
//         <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />

//         <div className="flex justify-center mb-8">
//           <div className="p-3 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
//             <Activity className="w-10 h-10 text-cyan-400" />
//           </div>
//         </div>

//         <h2 className="text-3xl font-extrabold text-center mb-2 glow-text">
//           {isLogin ? 'Welcome Back' : 'Join NeuraHealth'}
//         </h2>
//         <p className="text-center text-slate-400 mb-8 text-sm">
//           {isLogin ? 'Enter your credentials to access your AI analysis.' : 'Register securely to track your diagnostic footprint.'}
//         </p>

//         <AnimatePresence mode="wait">
//           {error && (
//             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm mb-4 text-center">
//               {error}
//             </motion.div>
//           )}
//           {successMsg && (
//             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm mb-4 text-center flex items-center justify-center space-x-2">
//               <CheckCircle className="w-4 h-4" /> <span>{successMsg}</span>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <User className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
//             </div>
//             <input
//               type="text"
//               name="username"
//               required
//               value={formData.username}
//               onChange={handleChange}
//               placeholder="Username"
//               className="block w-full pl-12 pr-4 py-3.5 border border-slate-700/50 rounded-xl bg-slate-800/40 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all font-medium glow-input outline-none"
//             />
//           </div>

//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
//             </div>
//             <input
//               type="password"
//               name="password"
//               required
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Password"
//               className="block w-full pl-12 pr-4 py-3.5 border border-slate-700/50 rounded-xl bg-slate-800/40 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all font-medium glow-input outline-none"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading || !!successMsg}
//             className="w-full relative flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all overflow-hidden group disabled:opacity-50"
//           >
//             {isLoading ? (
//                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//             ) : (
//                <>
//                  <span>{isLogin ? 'Access Diagnostics' : 'Initialize Profile'}</span>
//                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                </>
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center border-t border-slate-700/50 pt-5">
//           <button
//             type="button"
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors"
//           >
//             {isLogin ? "Don't have an account? Register now." : "Already mapped? Login directly."}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

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
  const [focusedField, setFocusedField] = useState(null);

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: '#EDE9E6' }}
    >
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: '#C9996B' }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-72 h-72 rounded-full opacity-25 blur-3xl"
        style={{ backgroundColor: '#5C766D' }}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: '#5C4F4A' }}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        {/* Main Card */}
        <div
          className="relative p-8 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 25px 50px -12px rgba(92, 79, 74, 0.25), 0 0 0 1px rgba(201, 153, 107, 0.1)',
          }}
        >
          {/* Decorative Corner Accents */}
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full"
            style={{ backgroundColor: '#C9996B' }}
          />
          <div
            className="absolute bottom-0 left-0 w-24 h-24 opacity-10 rounded-tr-full"
            style={{ backgroundColor: '#5C766D' }}
          />

          {/* Logo */}
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="p-4 rounded-2xl shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #5C766D 0%, #5C4F4A 100%)',
                boxShadow: '0 10px 30px -10px rgba(92, 118, 109, 0.5)',
              }}
            >
              <Activity className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Toggle Switch */}
          <div className="flex justify-center mb-6">
            <div
              className="relative flex p-1 rounded-xl"
              style={{ backgroundColor: '#EDE9E6' }}
            >
              <motion.div
                className="absolute top-1 bottom-1 rounded-lg"
                style={{ backgroundColor: '#5C766D', width: 'calc(50% - 4px)' }}
                animate={{ x: isLogin ? 0 : '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${isLogin ? 'text-white' : 'text-[#5C4F4A]'
                  }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${!isLogin ? 'text-white' : 'text-[#5C4F4A]'
                  }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-center mb-6"
            >
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: '#5C4F4A' }}
              >
                {isLogin ? 'Welcome Back' : 'Join NeuraHealth'}
              </h2>
              <p className="text-sm" style={{ color: '#5C4F4A', opacity: 0.7 }}>
                {isLogin
                  ? 'Enter your credentials to continue'
                  : 'Create your account to get started'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-4 p-3 rounded-xl text-sm text-center border"
                style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  borderColor: 'rgba(220, 38, 38, 0.3)',
                  color: '#dc2626',
                }}
              >
                {error}
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-4 p-3 rounded-xl text-sm text-center flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'rgba(92, 118, 109, 0.15)',
                  border: '1px solid rgba(92, 118, 109, 0.3)',
                  color: '#5C766D',
                }}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <motion.div
              className="relative"
              animate={{
                scale: focusedField === 'username' ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div
                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200"
                style={{ color: focusedField === 'username' ? '#C9996B' : '#5C4F4A80' }}
              >
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                placeholder="Username"
                className="block w-full pl-12 pr-4 py-4 rounded-xl font-medium transition-all duration-200 outline-none"
                style={{
                  backgroundColor: '#EDE9E6',
                  color: '#5C4F4A',
                  border: focusedField === 'username' ? '2px solid #C9996B' : '2px solid transparent',
                  boxShadow: focusedField === 'username' ? '0 0 0 4px rgba(201, 153, 107, 0.15)' : 'none',
                }}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              className="relative"
              animate={{
                scale: focusedField === 'password' ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div
                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200"
                style={{ color: focusedField === 'password' ? '#C9996B' : '#5C4F4A80' }}
              >
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Password"
                className="block w-full pl-12 pr-4 py-4 rounded-xl font-medium transition-all duration-200 outline-none"
                style={{
                  backgroundColor: '#EDE9E6',
                  color: '#5C4F4A',
                  border: focusedField === 'password' ? '2px solid #C9996B' : '2px solid transparent',
                  boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(201, 153, 107, 0.15)' : 'none',
                }}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !!successMsg}
              whileHover={{ scale: 1.02, boxShadow: '0 15px 35px -10px rgba(201, 153, 107, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full relative flex items-center justify-center gap-2 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #C9996B 0%, #5C4F4A 100%)',
                boxShadow: '0 10px 30px -10px rgba(201, 153, 107, 0.4)',
              }}
            >
              {/* Button Shine Effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              />

              {isLoading ? (
                <div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Link */}
          <div
            className="mt-6 pt-6 text-center"
            style={{ borderTop: '1px solid rgba(92, 79, 74, 0.1)' }}
          >
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium transition-colors duration-200 hover:underline"
              style={{ color: '#5C766D' }}
            >
              {isLogin
                ? "Don't have an account? Register now"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

