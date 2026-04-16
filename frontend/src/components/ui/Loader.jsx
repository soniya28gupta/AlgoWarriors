import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative w-24 h-24">
        {/* Outer glowing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t-4 border-blue-500 border-r-4 border-r-transparent opacity-70 neon-glow-blue"
        />
        {/* Middle reverse ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-t-4 border-purple-500 border-l-4 border-l-transparent opacity-70 neon-glow-purple"
        />
        {/* Inner pulsing core */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-6 rounded-full bg-cyan-500/50 neon-glow-green blur-sm"
        />
      </div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-6 text-lg font-medium tracking-widest text-blue-400 neon-text-glow"
      >
        AI THINKING...
      </motion.p>
    </div>
  );
}
