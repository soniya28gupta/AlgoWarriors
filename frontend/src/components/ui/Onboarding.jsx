// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { saveOnboarding } from '../../services/api';
// import { Target, Activity, Flame, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

// const QUESTIONS = [
//   {
//     id: 'primary_goal',
//     question: "What is your primary health focus?",
//     icon: Target,
//     options: ["Longevity & Anti-aging", "Weight Management", "Pre-emptive Diagnosis", "Cardiovascular Fitness"]
//   },
//   {
//     id: 'activity_level',
//     question: "How would you describe your baseline physical activity?",
//     icon: Activity,
//     options: ["Sedentary", "Lightly Active (1-2x week)", "Moderately Active (3-4x week)", "Highly Active (5+ week)"]
//   },
//   {
//     id: 'stress_level',
//     question: "How would you rate your typical physiological stress levels?",
//     icon: Flame,
//     options: ["Low (Zen)", "Moderate (Manageable)", "High (Tense)", "Severe (Overwhelming)"]
//   }
// ];

// export default function Onboarding({ userId, onComplete }) {
//   const [step, setStep] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [isSaving, setIsSaving] = useState(false);

//   const handleSelect = (option) => {
//     setAnswers({ ...answers, [QUESTIONS[step].id]: option });
//   };

//   const handleNext = async () => {
//     if (step < QUESTIONS.length - 1) {
//       setStep(step + 1);
//     } else {
//       setIsSaving(true);
//       try {
//         await saveOnboarding(userId, answers);
//         onComplete();
//       } catch (err) {
//         console.error(err);
//         setIsSaving(false);
//       }
//     }
//   };

//   const currentQ = QUESTIONS[step];
//   const Icon = currentQ.icon;

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
//       <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-blue-900/10 to-indigo-900/20 -z-10" />

//       <motion.div 
//         key="onboarding"
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="glass-panel w-full max-w-xl p-8 md:p-12 rounded-3xl relative overflow-hidden"
//       >
//         {/* Progress Bar */}
//         <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
//           <motion.div 
//             className="h-full bg-cyan-400 neon-glow-cyan"
//             initial={{ width: 0 }}
//             animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
//             transition={{ duration: 0.5 }}
//           />
//         </div>

//         <div className="text-center mb-8 mt-4">
//           <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
//             <Icon className="w-8 h-8" />
//           </div>
//           <motion.h2 
//             key={step}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
//           >
//             {currentQ.question}
//           </motion.h2>
//         </div>

//         <div className="space-y-4 mb-10">
//           <AnimatePresence mode="popLayout">
//             {currentQ.options.map((opt, idx) => {
//               const isSelected = answers[currentQ.id] === opt;
//               return (
//                 <motion.button
//                   key={`${step}-${idx}`}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.1 } }}
//                   exit={{ opacity: 0, x: 20 }}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => handleSelect(opt)}
//                   className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-200 border flex items-center justify-between
//                     ${isSelected 
//                       ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
//                       : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500'}`}
//                 >
//                   <span>{opt}</span>
//                   {isSelected && <CheckCircle className="w-5 h-5 text-cyan-400" />}
//                 </motion.button>
//               );
//             })}
//           </AnimatePresence>
//         </div>

//         <div className="flex justify-between items-center pt-6 border-t border-slate-700/50">
//           <button
//             onClick={() => setStep(Math.max(0, step - 1))}
//             disabled={step === 0}
//             className={`flex items-center space-x-2 text-sm font-medium ${step === 0 ? 'opacity-0 cursor-default' : 'text-slate-400 hover:text-slate-200'}`}
//           >
//             <ArrowLeft className="w-4 h-4" /> <span>Back</span>
//           </button>

//           <button
//             onClick={handleNext}
//             disabled={!answers[currentQ.id] || isSaving}
//             className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             {isSaving ? (
//               <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
//             ) : (
//               <>
//                 <span>{step === QUESTIONS.length - 1 ? 'Complete Setup' : 'Continue'}</span>
//                 <ArrowRight className="w-4 h-4" />
//               </>
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveOnboarding } from '../../services/api';
import { Target, Activity, Flame, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'primary_goal',
    question: "What is your primary health focus?",
    icon: Target,
    options: ["Longevity & Anti-aging", "Weight Management", "Pre-emptive Diagnosis", "Cardiovascular Fitness"]
  },
  {
    id: 'activity_level',
    question: "How would you describe your baseline physical activity?",
    icon: Activity,
    options: ["Sedentary", "Lightly Active (1-2x week)", "Moderately Active (3-4x week)", "Highly Active (5+ week)"]
  },
  {
    id: 'stress_level',
    question: "How would you rate your typical physiological stress levels?",
    icon: Flame,
    options: ["Low (Zen)", "Moderate (Manageable)", "High (Tense)", "Severe (Overwhelming)"]
  }
];

export default function Onboarding({ userId, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = (option) => {
    setAnswers({ ...answers, [QUESTIONS[step].id]: option });
  };

  const handleNext = async () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setIsSaving(true);
      try {
        await saveOnboarding(userId, answers);
        onComplete();
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const currentQ = QUESTIONS[step];
  const Icon = currentQ.icon;

  return (
    <div className="min-h-screen py-12 px-6" style={{ backgroundColor: '#EDE9E6' }}>
      <div className="max-w-xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold tracking-widest" style={{ color: '#5C4F4A80' }}>
              STEP {step + 1} OF {QUESTIONS.length}
            </span>
            <span className="text-xs font-semibold" style={{ color: '#5C766D' }}>
              {Math.round(((step + 1) / QUESTIONS.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-1.5 bg-[#EDE9E6] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #5C766D, #C9996B)' }}
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.97 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-10 shadow-2xl"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* Icon & Question */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="mx-auto mb-6 p-6 rounded-3xl inline-flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #5C766D 0%, #5C4F4A 100%)',
                boxShadow: '0 10px 30px -10px rgba(92, 118, 109, 0.4)'
              }}
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h2
              key={step}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold leading-tight"
              style={{ color: '#5C4F4A' }}
            >
              {currentQ.question}
            </motion.h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-12">
            <AnimatePresence mode="popLayout">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === opt;
                return (
                  <motion.button
                    key={`${step}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(opt)}
                    className={`w-full p-6 rounded-2xl text-left font-medium transition-all flex items-center justify-between border
                                            ${isSelected
                        ? 'border-[#C9996B] bg-[#C9996B10]'
                        : 'border-[#EDE9E6] hover:border-[#C9996B30] hover:bg-[#F8F4F0]'
                      }`}
                    style={{
                      backgroundColor: isSelected ? '#C9996B10' : '#FFFFFF',
                    }}
                  >
                    <span className="text-base" style={{ color: isSelected ? '#5C4F4A' : '#5C4F4A' }}>
                      {opt}
                    </span>
                    {isSelected && (
                      <CheckCircle
                        className="w-6 h-6 flex-shrink-0"
                        style={{ color: '#5C766D' }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all
                                ${step === 0
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-[#EDE9E6]'
                }`}
              style={{ color: '#5C4F4A' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              disabled={!answers[currentQ.id] || isSaving}
              className="flex items-center gap-3 px-10 py-4 rounded-2xl font-semibold text-white disabled:opacity-50 transition-all"
              style={{
                background: 'linear-gradient(135deg, #C9996B 0%, #5C4F4A 100%)',
                boxShadow: '0 10px 30px -10px rgba(201, 153, 107, 0.4)',
              }}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <span>
                    {step === QUESTIONS.length - 1 ? 'Complete Setup' : 'Continue'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Step Indicator Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {QUESTIONS.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === step
                  ? 'bg-[#5C766D] scale-125'
                  : idx < step
                    ? 'bg-[#C9996B]'
                    : 'bg-[#EDE9E6]'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}