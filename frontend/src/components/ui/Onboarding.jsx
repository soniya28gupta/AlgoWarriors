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

  const currentQ = QUESTIONS[step];
  const Icon = currentQ.icon;
  const isOptionSelected = Boolean(answers[currentQ.id]);
  const isDisabled = !isOptionSelected || isSaving;

  const handleSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: option }));
  };

  const handleNext = async () => {
    if (!isOptionSelected) return;

    if (step < QUESTIONS.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      setIsSaving(true);
      try {
        await saveOnboarding(userId, answers);
        onComplete();
      } catch (err) {
        console.error("Onboarding save error:", err);
        // Still proceed to dashboard so user is never trapped
        onComplete();
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6" style={{ backgroundColor: '#F6F3F1' }}>
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#7D756F]">
              Sequence {step + 1} / {QUESTIONS.length}
            </span>
            <span className="text-xs font-bold text-[#F47F6B]">
              {Math.round(((step + 1) / QUESTIONS.length) * 100)}% Synchronized
            </span>
          </div>
          <div className="h-2.5 bg-[#EDE8E4] rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #F47F6B 0%, #EA6D58 100%)' }}
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.6, ease: "circOut" }}
            />
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, y: 30, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="neumorphic-card p-8 md:p-12 relative overflow-hidden bg-white shadow-xl rounded-[28px] border border-[#5C4F4A]/10"
        >
          {/* Decorative background element */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 pointer-events-none opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #F47F6B 0%, transparent 70%)' }}
          />

          {/* Question Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
              className="mx-auto mb-6 w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #F47F6B 0%, #EA6D58 100%)',
                boxShadow: '0 12px 28px -6px rgba(244, 127, 107, 0.35)'
              }}
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h2
              key={`title-${step}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl md:text-4xl font-extrabold text-[#2E2E2E] leading-snug tracking-tight"
            >
              {currentQ.question}
            </motion.h2>
          </div>

          {/* Option Cards */}
          <div className="space-y-3.5 mb-12">
            <AnimatePresence mode="popLayout">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === opt;
                return (
                  <motion.button
                    key={`${step}-${idx}`}
                    type="button"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ delay: idx * 0.06, duration: 0.25 }}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleSelect(opt)}
                    className={`w-full p-5 md:p-6 rounded-2xl text-left font-semibold transition-all duration-200 flex items-center justify-between border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F47F6B]/30
                      ${isSelected
                        ? 'border-[#F47F6B] bg-[#FFF8F6] text-[#2E2E2E] shadow-sm shadow-[#F47F6B]/15'
                        : 'border-[#EDE8E4] bg-[#FAF8F6] text-[#5C5550] hover:bg-white hover:border-[#F47F6B]/35 hover:text-[#2E2E2E]'
                      }`}
                  >
                    <span className="text-base md:text-lg">{opt}</span>
                    {isSelected ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0"
                        style={{ backgroundColor: '#F47F6B' }}
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-[#D6D0CA] bg-white/70 flex-shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-between items-center bg-[#FAF8F6] -mx-8 -mb-8 p-6 md:-mx-12 md:-mb-12 md:p-8 border-t border-[#EDE8E4]">
            {/* Previous Step Button */}
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all text-sm md:text-base border border-transparent
                ${step === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'text-[#6B6560] hover:text-[#2E2E2E] hover:bg-white/80 hover:border-[#E8E4DF] active:scale-[0.98] cursor-pointer'
                }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous Step</span>
            </button>

            {/* Next / Complete Setup Button */}
            <motion.button
              type="button"
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              onClick={handleNext}
              disabled={isDisabled}
              className={`flex items-center justify-center gap-3 px-8 md:px-12 py-5 rounded-2xl font-bold text-white transition-all duration-200 min-h-[64px] focus:outline-none focus:ring-4 focus:ring-[#F47F6B]/30 group ${
                isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              style={{
                backgroundColor: isDisabled ? 'rgba(244, 127, 107, 0.45)' : '#F47F6B',
                color: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: isDisabled
                  ? '0 4px 15px -3px rgba(244, 127, 107, 0.2)'
                  : '0 10px 25px -5px rgba(244, 127, 107, 0.4)',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.backgroundColor = '#E06955';
                  e.currentTarget.style.boxShadow = '0 14px 28px -4px rgba(244, 127, 107, 0.48)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.backgroundColor = '#F47F6B';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(244, 127, 107, 0.4)';
                }
              }}
              onMouseDown={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.backgroundColor = '#D65C48';
                }
              }}
              onMouseUp={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.backgroundColor = '#E06955';
                }
              }}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-base md:text-lg">Finalizing...</span>
                </>
              ) : (
                <>
                  <span className="text-base md:text-lg">
                    {step === QUESTIONS.length - 1 ? 'Complete Setup' : 'Next Step'}
                  </span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Step Indicator Dots */}
        <div className="flex justify-center gap-3 mt-10">
          {QUESTIONS.map((_, idx) => (
            <motion.div
              key={idx}
              initial={false}
              animate={{
                width: idx === step ? 32 : 10,
                backgroundColor: idx === step ? '#F47F6B' : (idx < step ? '#F8ADA0' : '#DCD7D2')
              }}
              className="h-2.5 rounded-full shadow-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
