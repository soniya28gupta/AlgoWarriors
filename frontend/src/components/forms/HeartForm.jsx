import React, { useState } from 'react';
import { Activity, HeartPulse, User, PlusCircle, MinusCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeartForm({ formData, setFormData }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const InputField = ({ label, name, type = "number", icon: Icon, placeholder, step }) => (
    <div className="relative group">
      <label className="block text-sm font-medium text-slate-400 mb-1 ml-1 group-focus-within:text-blue-400 transition-colors">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
        </div>
        <input
          type={type}
          name={name}
          step={step}
          value={formData[name] || ''}
          onChange={handleChange}
          className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium glow-input hover:border-slate-600"
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  const SelectMenu = ({ label, name, options }) => (
    <div className="relative group">
      <label className="block text-sm font-medium text-slate-400 mb-1 ml-1 group-focus-within:text-blue-400 transition-colors">{label}</label>
      <select
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        className="block w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium glow-input hover:border-slate-600 appearance-none"
      >
        <option value="" disabled>Select Option</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  const ToggleBtn = ({ name, label }) => {
    const isYes = formData[name] === '1';
    return (
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium text-slate-400">{label}</span>
        <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, [name]: '1' })}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${isYes ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, [name]: '0' })}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${!isYes && formData[name] !== undefined ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            No
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Age" name="age" icon={User} placeholder="e.g. 45" />
        <SelectMenu 
          label="Sex" 
          name="sex" 
          options={[
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' }
          ]} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectMenu 
          label="Chest Pain Type" 
          name="chest_pain_type" 
          options={[
            { label: 'Typical angina', value: 'Typical angina' },
            { label: 'Atypical angina', value: 'Atypical angina' },
            { label: 'Non-anginal pain', value: 'Non-anginal pain' },
            { label: 'Asymptomatic', value: 'Asymptomatic' }
          ]} 
        />
        <SelectMenu 
          label="Fasting Blood Sugar" 
          name="fasting_blood_sugar" 
          options={[
            { label: 'Lower than 120 mg/ml', value: 'Lower than 120 mg/ml' },
            { label: 'Greater than 120 mg/ml', value: 'Greater than 120 mg/ml' }
          ]} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Resting Blood Pressure" name="resting_blood_pressure" icon={Activity} placeholder="Sys mmHg" />
        <InputField label="Cholesterol" name="cholestoral" icon={Activity} placeholder="mg/dl" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Max Heart Rate" name="Max_heart_rate" icon={HeartPulse} placeholder="bpm" />
        <InputField label="Oldpeak (ST Depression)" name="oldpeak" icon={Activity} placeholder="e.g. 1.5" step="0.1" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectMenu 
          label="Resting ECG" 
          name="rest_ecg" 
          options={[
            { label: 'Normal', value: 'Normal' },
            { label: 'ST-T wave abnormality', value: 'ST-T wave abnormality' },
            { label: 'Left ventricular hypertrophy', value: 'Left ventricular hypertrophy' }
          ]} 
        />
        <SelectMenu 
          label="Exercise Induced Angina" 
          name="exercise_induced_angina" 
          options={[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ]} 
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <SelectMenu 
          label="Peak Exercise ST Slope" 
          name="slope" 
          options={[
            { label: 'Upsloping', value: 'Upsloping' },
            { label: 'Flat', value: 'Flat' },
            { label: 'Downsloping', value: 'Downsloping' }
          ]} 
        />
        <SelectMenu 
          label="Major Vessels" 
          name="vessels_colored_by_flourosopy" 
          options={[
            { label: 'Zero', value: 'Zero' },
            { label: 'One', value: 'One' },
            { label: 'Two', value: 'Two' },
            { label: 'Three', value: 'Three' },
            { label: 'Four', value: 'Four' }
          ]} 
        />
        <SelectMenu 
          label="Thalassemia" 
          name="thalassemia" 
          options={[
            { label: 'Normal', value: 'Normal' },
            { label: 'Fixed Defect', value: 'Fixed Defect' },
            { label: 'Reversable Defect', value: 'Reversable Defect' },
            { label: 'No', value: 'No' }
          ]} 
        />
      </div>

      {/* Advanced Stroke Indicators Section */}
      <div className="pt-4 border-t border-slate-700/50">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          {showAdvanced ? <MinusCircle className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
          <span>Advanced Near-Future Stroke Indicators</span>
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 mt-4 glass-panel rounded-xl border-blue-500/30 neon-glow-blue space-y-4">
                <div className="flex items-start space-x-2 mb-2 text-blue-300 min-w-0">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs break-words">These optional metrics specifically calculate acute cerebrovascular stroke risk mapping.</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <ToggleBtn name="currentSmoker" label="Current Smoker" />
                  <ToggleBtn name="BPMeds" label="On BP Meds" />
                  <ToggleBtn name="prevalentStroke" label="Prior Stroke" />
                  <ToggleBtn name="prevalentHyp" label="Hypertension" />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <SelectMenu
                    label="Education Level"
                    name="education"
                    options={[
                      { label: 'Some High School', value: '1' },
                      { label: 'High School Grad', value: '2' },
                      { label: 'Some College', value: '3' },
                      { label: 'College Grad+', value: '4' }
                    ]}
                  />
                  <InputField label="Cigs Per Day" name="cigsPerDay" icon={Activity} placeholder="e.g. 10" />
                  <InputField label="Diastolic BP" name="diaBP" icon={Activity} placeholder="Dia mmHg" />
                  <InputField label="BMI" name="BMI" icon={User} placeholder="e.g. 24.5" step="0.1" />
                  <InputField label="Glucose Level" name="glucose" icon={Activity} placeholder="mg/dl" />
                  <ToggleBtn name="diabetes" label="Has Diabetes" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
