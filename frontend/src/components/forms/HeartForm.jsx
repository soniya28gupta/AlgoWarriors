// import React, { useState } from 'react';
// import { Activity, HeartPulse, User, PlusCircle, MinusCircle, Info } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const InputField = ({ label, name, type = "number", icon: Icon, placeholder, step, formData, onChange }) => (
//   <div className="relative group">
//     <label className="block text-sm font-medium text-slate-400 mb-1 ml-1 group-focus-within:text-blue-400 transition-colors">{label}</label>
//     <div className="relative">
//       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//         <Icon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
//       </div>
//       <input
//         type={type}
//         name={name}
//         step={step}
//         value={formData[name] || ''}
//         onChange={onChange}
//         className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium glow-input hover:border-slate-600"
//         placeholder={placeholder}
//       />
//     </div>
//   </div>
// );

// const SelectMenu = ({ label, name, options, formData, onChange }) => (
//   <div className="relative group">
//     <label className="block text-sm font-medium text-slate-400 mb-1 ml-1 group-focus-within:text-blue-400 transition-colors">{label}</label>
//     <select
//       name={name}
//       value={formData[name] || ''}
//       onChange={onChange}
//       className="block w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium glow-input hover:border-slate-600 appearance-none"
//     >
//       <option value="" disabled>Select Option</option>
//       {options.map(opt => (
//         <option key={opt.value} value={opt.value}>{opt.label}</option>
//       ))}
//     </select>
//   </div>
// );

// const ToggleBtn = ({ name, label, formData, setFormData }) => {
//   const isYes = formData[name] === '1';
//   return (
//     <div className="flex flex-col space-y-2">
//       <span className="text-sm font-medium text-slate-400">{label}</span>
//       <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700">
//         <button
//           type="button"
//           onClick={() => setFormData({ ...formData, [name]: '1' })}
//           className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${isYes ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
//         >
//           Yes
//         </button>
//         <button
//           type="button"
//           onClick={() => setFormData({ ...formData, [name]: '0' })}
//           className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${!isYes && formData[name] !== undefined ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
//         >
//           No
//         </button>
//       </div>
//     </div>
//   );
// };

// export default function HeartForm({ formData, setFormData }) {
//   const [showAdvanced, setShowAdvanced] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-2 gap-4">
//         <InputField label="Age" name="age" icon={User} placeholder="e.g. 45" formData={formData} onChange={handleChange} />
//         <SelectMenu 
//           label="Sex" 
//           name="sex" 
//           options={[
//             { label: 'Male', value: 'Male' },
//             { label: 'Female', value: 'Female' }
//           ]} 
//           formData={formData} onChange={handleChange}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <SelectMenu 
//           label="Chest Pain Type" 
//           name="chest_pain_type" 
//           options={[
//             { label: 'Typical angina', value: 'Typical angina' },
//             { label: 'Atypical angina', value: 'Atypical angina' },
//             { label: 'Non-anginal pain', value: 'Non-anginal pain' },
//             { label: 'Asymptomatic', value: 'Asymptomatic' }
//           ]} 
//           formData={formData} onChange={handleChange}
//         />
//         <SelectMenu 
//           label="Fasting Blood Sugar" 
//           name="fasting_blood_sugar" 
//           options={[
//             { label: 'Lower than 120 mg/ml', value: 'Lower than 120 mg/ml' },
//             { label: 'Greater than 120 mg/ml', value: 'Greater than 120 mg/ml' }
//           ]} 
//           formData={formData} onChange={handleChange}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <InputField label="Resting Blood Pressure" name="resting_blood_pressure" icon={Activity} placeholder="Sys mmHg" formData={formData} onChange={handleChange} />
//         <InputField label="Cholesterol" name="cholestoral" icon={Activity} placeholder="mg/dl" formData={formData} onChange={handleChange} />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <InputField label="Max Heart Rate" name="Max_heart_rate" icon={HeartPulse} placeholder="bpm" formData={formData} onChange={handleChange} />
//         <InputField label="Oldpeak (ST Depression)" name="oldpeak" icon={Activity} placeholder="e.g. 1.5" step="0.1" formData={formData} onChange={handleChange} />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <SelectMenu 
//           label="Resting ECG" 
//           name="rest_ecg" 
//           options={[
//             { label: 'Normal', value: 'Normal' },
//             { label: 'ST-T wave abnormality', value: 'ST-T wave abnormality' },
//             { label: 'Left ventricular hypertrophy', value: 'Left ventricular hypertrophy' }
//           ]} 
//           formData={formData} onChange={handleChange}
//         />
//         <SelectMenu 
//           label="Exercise Induced Angina" 
//           name="exercise_induced_angina" 
//           options={[
//             { label: 'Yes', value: 'Yes' },
//             { label: 'No', value: 'No' },
//           ]} 
//           formData={formData} onChange={handleChange}
//         />
//       </div>

//       <div className="grid grid-cols-3 gap-4">
//         <SelectMenu 
//           label="Peak Exercise ST Slope" 
//           name="slope" 
//           options={[
//             { label: 'Upsloping', value: 'Upsloping' },
//             { label: 'Flat', value: 'Flat' },
//             { label: 'Downsloping', value: 'Downsloping' }
//           ]} 
//           formData={formData} onChange={handleChange}
//         />
//         <SelectMenu 
//           label="Major Vessels" 
//           name="vessels_colored_by_flourosopy" 
//           options={[
//             { label: 'Zero', value: 'Zero' },
//             { label: 'One', value: 'One' },
//             { label: 'Two', value: 'Two' },
//             { label: 'Three', value: 'Three' },
//             { label: 'Four', value: 'Four' }
//           ]} 
//           formData={formData} onChange={handleChange}
//         />
//         <SelectMenu 
//           label="Thalassemia" 
//           name="thalassemia" 
//           options={[
//             { label: 'Normal', value: 'Normal' },
//             { label: 'Fixed Defect', value: 'Fixed Defect' },
//             { label: 'Reversable Defect', value: 'Reversable Defect' },
//             { label: 'No', value: 'No' }
//           ]} 
//           formData={formData} onChange={handleChange}
//         />
//       </div>

//       {/* Advanced Stroke Indicators Section */}
//       <div className="pt-4 border-t border-slate-700/50">
//         <button
//           type="button"
//           onClick={() => setShowAdvanced(!showAdvanced)}
//           className="flex items-center space-x-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
//         >
//           {showAdvanced ? <MinusCircle className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
//           <span>Advanced Near-Future Stroke Indicators</span>
//         </button>

//         <AnimatePresence>
//           {showAdvanced && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="overflow-hidden"
//             >
//               <div className="p-4 mt-4 glass-panel rounded-xl border-blue-500/30 neon-glow-blue space-y-4">
//                 <div className="flex items-start space-x-2 mb-2 text-blue-300 min-w-0">
//                   <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                   <p className="text-xs break-words">These optional metrics specifically calculate acute cerebrovascular stroke risk mapping.</p>
//                 </div>

//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
//                   <ToggleBtn name="currentSmoker" label="Current Smoker" formData={formData} setFormData={setFormData} />
//                   <ToggleBtn name="BPMeds" label="On BP Meds" formData={formData} setFormData={setFormData} />
//                   <ToggleBtn name="prevalentStroke" label="Prior Stroke" formData={formData} setFormData={setFormData} />
//                   <ToggleBtn name="prevalentHyp" label="Hypertension" formData={formData} setFormData={setFormData} />
//                 </div>

//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                   <SelectMenu
//                     label="Education Level"
//                     name="education"
//                     options={[
//                       { label: 'Some High School', value: '1' },
//                       { label: 'High School Grad', value: '2' },
//                       { label: 'Some College', value: '3' },
//                       { label: 'College Grad+', value: '4' }
//                     ]}
//                     formData={formData} onChange={handleChange}
//                   />
//                   <InputField label="Cigs Per Day" name="cigsPerDay" icon={Activity} placeholder="e.g. 10" formData={formData} onChange={handleChange} />
//                   <InputField label="Diastolic BP" name="diaBP" icon={Activity} placeholder="Dia mmHg" formData={formData} onChange={handleChange} />
//                   <InputField label="BMI" name="BMI" icon={User} placeholder="e.g. 24.5" step="0.1" formData={formData} onChange={handleChange} />
//                   <InputField label="Glucose Level" name="glucose" icon={Activity} placeholder="mg/dl" formData={formData} onChange={handleChange} />
//                   <ToggleBtn name="diabetes" label="Has Diabetes"  formData={formData} setFormData={setFormData}/>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// // }


// import React, { useState } from 'react';
// import { Activity, HeartPulse, User, PlusCircle, MinusCircle, Info } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const InputField = ({ label, name, type = "number", icon: Icon, placeholder, step, formData, onChange }) => (
//   <div className="relative group">
//     <label
//       className="block text-sm font-medium mb-2 ml-1 transition-colors"
//       style={{ color: '#5C4F4A' }}
//     >
//       {label}
//     </label>
//     <div className="relative">
//       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//         <Icon className="h-5 w-5" style={{ color: '#5C4F4A80' }} />
//       </div>
//       <input
//         type={type}
//         name={name}
//         step={step}
//         value={formData[name] || ''}
//         onChange={onChange}
//         className="block w-full pl-12 pr-4 py-4 rounded-2xl font-medium outline-none transition-all"
//         style={{
//           backgroundColor: '#FFFFFF',
//           border: '2px solid transparent',
//           color: '#5C4F4A',
//         }}
//         placeholder={placeholder}
//       />
//     </div>
//   </div>
// );

// const SelectMenu = ({ label, name, options, formData, onChange }) => (
//   <div className="relative group">
//     <label
//       className="block text-sm font-medium mb-2 ml-1 transition-colors"
//       style={{ color: '#5C4F4A' }}
//     >
//       {label}
//     </label>
//     <select
//       name={name}
//       value={formData[name] || ''}
//       onChange={onChange}
//       className="block w-full px-5 py-4 rounded-2xl font-medium outline-none transition-all appearance-none"
//       style={{
//         backgroundColor: '#FFFFFF',
//         border: '2px solid transparent',
//         color: '#5C4F4A',
//       }}
//     >
//       <option value="" disabled>Select Option</option>
//       {options.map(opt => (
//         <option key={opt.value} value={opt.value}>{opt.label}</option>
//       ))}
//     </select>
//   </div>
// );

// const ToggleBtn = ({ name, label, formData, setFormData }) => {
//   const isYes = formData[name] === '1';
//   return (
//     <div className="flex flex-col space-y-2">
//       <span className="text-sm font-medium" style={{ color: '#5C4F4A' }}>{label}</span>
//       <div
//         className="flex rounded-2xl p-1 border"
//         style={{ backgroundColor: '#EDE9E6', borderColor: '#EDE9E6' }}
//       >
//         <button
//           type="button"
//           onClick={() => setFormData({ ...formData, [name]: '1' })}
//           className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${isYes
//             ? 'bg-[#5C766D] text-white shadow-sm'
//             : 'text-[#5C4F4A] hover:bg-white'
//             }`}
//         >
//           Yes
//         </button>
//         <button
//           type="button"
//           onClick={() => setFormData({ ...formData, [name]: '0' })}
//           className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${!isYes && formData[name] !== undefined
//             ? 'bg-[#EDE9E6] text-[#5C4F4A] shadow-sm'
//             : 'text-[#5C4F4A] hover:bg-white'
//             }`}
//         >
//           No
//         </button>
//       </div>
//     </div>
//   );
// };

// export default function HeartForm({ formData, setFormData }) {
//   const [showAdvanced, setShowAdvanced] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
//   };

//   return (
//     <div className="space-y-8">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <InputField label="Age" name="age" icon={User} placeholder="e.g. 45" formData={formData} onChange={handleChange} />
//         <SelectMenu
//           label="Sex"
//           name="sex"
//           options={[
//             { label: 'Male', value: 'Male' },
//             { label: 'Female', value: 'Female' }
//           ]}
//           formData={formData} onChange={handleChange}
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <SelectMenu
//           label="Chest Pain Type"
//           name="chest_pain_type"
//           options={[
//             { label: 'Typical angina', value: 'Typical angina' },
//             { label: 'Atypical angina', value: 'Atypical angina' },
//             { label: 'Non-anginal pain', value: 'Non-anginal pain' },
//             { label: 'Asymptomatic', value: 'Asymptomatic' }
//           ]}
//           formData={formData} onChange={handleChange}
//         />
//         <SelectMenu
//           label="Fasting Blood Sugar"
//           name="fasting_blood_sugar"
//           options={[
//             { label: 'Lower than 120 mg/ml', value: 'Lower than 120 mg/ml' },
//             { label: 'Greater than 120 mg/ml', value: 'Greater than 120 mg/ml' }
//           ]}
//           formData={formData} onChange={handleChange}
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <InputField label="Resting Blood Pressure" name="resting_blood_pressure" icon={Activity} placeholder="Sys mmHg" formData={formData} onChange={handleChange} />
//         <InputField label="Cholesterol" name="cholestoral" icon={Activity} placeholder="mg/dl" formData={formData} onChange={handleChange} />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <InputField label="Max Heart Rate" name="Max_heart_rate" icon={HeartPulse} placeholder="bpm" formData={formData} onChange={handleChange} />
//         <InputField label="Oldpeak (ST Depression)" name="oldpeak" icon={Activity} placeholder="e.g. 1.5" step="0.1" formData={formData} onChange={handleChange} />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <SelectMenu
//           label="Resting ECG"
//           name="rest_ecg"
//           options={[
//             { label: 'Normal', value: 'Normal' },
//             { label: 'ST-T wave abnormality', value: 'ST-T wave abnormality' },
//             { label: 'Left ventricular hypertrophy', value: 'Left ventricular hypertrophy' }
//           ]}
//           formData={formData} onChange={handleChange}
//         />
//         <SelectMenu
//           label="Exercise Induced Angina"
//           name="exercise_induced_angina"
//           options={[
//             { label: 'Yes', value: 'Yes' },
//             { label: 'No', value: 'No' },
//           ]}
//           formData={formData} onChange={handleChange}
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <SelectMenu
//           label="Peak Exercise ST Slope"
//           name="slope"
//           options={[
//             { label: 'Upsloping', value: 'Upsloping' },
//             { label: 'Flat', value: 'Flat' },
//             { label: 'Downsloping', value: 'Downsloping' }
//           ]}
//           formData={formData} onChange={handleChange}
//         />
//         <SelectMenu
//           label="Major Vessels"
//           name="vessels_colored_by_flourosopy"
//           options={[
//             { label: 'Zero', value: 'Zero' },
//             { label: 'One', value: 'One' },
//             { label: 'Two', value: 'Two' },
//             { label: 'Three', value: 'Three' },
//             { label: 'Four', value: 'Four' }
//           ]}
//           formData={formData} onChange={handleChange}
//         />
//         <SelectMenu
//           label="Thalassemia"
//           name="thalassemia"
//           options={[
//             { label: 'Normal', value: 'Normal' },
//             { label: 'Fixed Defect', value: 'Fixed Defect' },
//             { label: 'Reversable Defect', value: 'Reversable Defect' },
//             { label: 'No', value: 'No' }
//           ]}
//           formData={formData} onChange={handleChange}
//         />
//       </div>

//       {/* Advanced Stroke Indicators Section */}
//       <div className="pt-6 border-t" style={{ borderColor: '#EDE9E6' }}>
//         <button
//           type="button"
//           onClick={() => setShowAdvanced(!showAdvanced)}
//           className="flex items-center gap-3 text-sm font-semibold transition-colors"
//           style={{ color: '#5C766D' }}
//         >
//           {showAdvanced ? <MinusCircle className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
//           <span>Advanced Near-Future Stroke Indicators</span>
//         </button>

//         <AnimatePresence>
//           {showAdvanced && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.4 }}
//               className="overflow-hidden"
//             >
//               <div
//                 className="mt-6 p-8 rounded-3xl border"
//                 style={{
//                   backgroundColor: '#FFFFFF',
//                   borderColor: '#EDE9E6'
//                 }}
//               >
//                 <div className="flex items-start gap-3 mb-6">
//                   <div className="p-2 rounded-xl" style={{ backgroundColor: '#EDE9E6' }}>
//                     <Info className="w-5 h-5" style={{ color: '#5C766D' }} />
//                   </div>
//                   <p className="text-sm leading-relaxed" style={{ color: '#5C4F4A80' }}>
//                     These optional metrics help calculate acute cerebrovascular stroke risk mapping.
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
//                   <ToggleBtn name="currentSmoker" label="Current Smoker" formData={formData} setFormData={setFormData} />
//                   <ToggleBtn name="BPMeds" label="On BP Meds" formData={formData} setFormData={setFormData} />
//                   <ToggleBtn name="prevalentStroke" label="Prior Stroke" formData={formData} setFormData={setFormData} />
//                   <ToggleBtn name="prevalentHyp" label="Hypertension" formData={formData} setFormData={setFormData} />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <SelectMenu
//                     label="Education Level"
//                     name="education"
//                     options={[
//                       { label: 'Some High School', value: '1' },
//                       { label: 'High School Grad', value: '2' },
//                       { label: 'Some College', value: '3' },
//                       { label: 'College Grad+', value: '4' }
//                     ]}
//                     formData={formData} onChange={handleChange}
//                   />
//                   <InputField label="Cigs Per Day" name="cigsPerDay" icon={Activity} placeholder="e.g. 10" formData={formData} onChange={handleChange} />
//                   <InputField label="Diastolic BP" name="diaBP" icon={Activity} placeholder="Dia mmHg" formData={formData} onChange={handleChange} />
//                   <InputField label="BMI" name="BMI" icon={User} placeholder="e.g. 24.5" step="0.1" formData={formData} onChange={handleChange} />
//                   <InputField label="Glucose Level" name="glucose" icon={Activity} placeholder="mg/dl" formData={formData} onChange={handleChange} />
//                   <ToggleBtn name="diabetes" label="Has Diabetes" formData={formData} setFormData={setFormData} />
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Activity, HeartPulse, User, PlusCircle, MinusCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({ label, name, type = "number", icon: Icon, placeholder, step, formData, onChange }) => (
  <div className="relative group">
    <label
      className="block text-sm font-medium mb-2 ml-1 transition-colors"
      style={{ color: '#5C4F4A' }}
    >
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5" style={{ color: '#5C4F4A80' }} />
      </div>
      <input
        type={type}
        name={name}
        step={step}
        value={formData[name] || ''}
        onChange={onChange}
        className="block w-full pl-12 pr-4 py-4 rounded-2xl font-medium outline-none transition-all"
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid transparent',
          color: '#5C4F4A',
        }}
        placeholder={placeholder}
      />
    </div>
  </div>
);

const SelectMenu = ({ label, name, options, formData, onChange }) => (
  <div className="relative group">
    <label
      className="block text-sm font-medium mb-2 ml-1 transition-colors"
      style={{ color: '#5C4F4A' }}
    >
      {label}
    </label>
    <select
      name={name}
      value={formData[name] || ''}
      onChange={onChange}
      className="block w-full px-5 py-4 rounded-2xl font-medium outline-none transition-all appearance-none"
      style={{
        backgroundColor: '#FFFFFF',
        border: '2px solid transparent',
        color: '#5C4F4A',
      }}
    >
      <option value="" disabled>Select Option</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const ToggleBtn = ({ name, label, formData, setFormData }) => {
  const isYes = formData[name] === '1';
  return (
    <div className="flex flex-col space-y-2">
      <span className="text-sm font-medium" style={{ color: '#5C4F4A' }}>{label}</span>
      <div
        className="flex rounded-2xl p-1 border"
        style={{ backgroundColor: '#EDE9E6', borderColor: '#EDE9E6' }}
      >
        <button
          type="button"
          onClick={() => setFormData({ ...formData, [name]: '1' })}
          className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${isYes
            ? 'bg-[#5C766D] text-white shadow-sm'
            : 'text-[#5C4F4A] hover:bg-white'
            }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, [name]: '0' })}
          className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${!isYes && formData[name] !== undefined
            ? 'bg-[#EDE9E6] text-[#5C4F4A] shadow-sm'
            : 'text-[#5C4F4A] hover:bg-white'
            }`}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default function HeartForm({ formData, setFormData }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Age" name="age" icon={User} placeholder="e.g. 45" formData={formData} onChange={handleChange} />
        <SelectMenu
          label="Sex"
          name="sex"
          options={[
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' }
          ]}
          formData={formData} onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectMenu
          label="Chest Pain Type"
          name="chest_pain_type"
          options={[
            { label: 'Typical angina', value: 'Typical angina' },
            { label: 'Atypical angina', value: 'Atypical angina' },
            { label: 'Non-anginal pain', value: 'Non-anginal pain' },
            { label: 'Asymptomatic', value: 'Asymptomatic' }
          ]}
          formData={formData} onChange={handleChange}
        />
        <SelectMenu
          label="Fasting Blood Sugar"
          name="fasting_blood_sugar"
          options={[
            { label: 'Lower than 120 mg/ml', value: 'Lower than 120 mg/ml' },
            { label: 'Greater than 120 mg/ml', value: 'Greater than 120 mg/ml' }
          ]}
          formData={formData} onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Resting Blood Pressure" name="resting_blood_pressure" icon={Activity} placeholder="Sys mmHg" formData={formData} onChange={handleChange} />
        <InputField label="Cholesterol" name="cholestoral" icon={Activity} placeholder="mg/dl" formData={formData} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Max Heart Rate" name="Max_heart_rate" icon={HeartPulse} placeholder="bpm" formData={formData} onChange={handleChange} />
        <InputField label="Oldpeak (ST Depression)" name="oldpeak" icon={Activity} placeholder="e.g. 1.5" step="0.1" formData={formData} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectMenu
          label="Resting ECG"
          name="rest_ecg"
          options={[
            { label: 'Normal', value: 'Normal' },
            { label: 'ST-T wave abnormality', value: 'ST-T wave abnormality' },
            { label: 'Left ventricular hypertrophy', value: 'Left ventricular hypertrophy' }
          ]}
          formData={formData} onChange={handleChange}
        />
        <SelectMenu
          label="Exercise Induced Angina"
          name="exercise_induced_angina"
          options={[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ]}
          formData={formData} onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SelectMenu
          label="Peak Exercise ST Slope"
          name="slope"
          options={[
            { label: 'Upsloping', value: 'Upsloping' },
            { label: 'Flat', value: 'Flat' },
            { label: 'Downsloping', value: 'Downsloping' }
          ]}
          formData={formData} onChange={handleChange}
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
          formData={formData} onChange={handleChange}
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
          formData={formData} onChange={handleChange}
        />
      </div>

      {/* Advanced Stroke Indicators Section */}
      <div className="pt-6 border-t" style={{ borderColor: '#EDE9E6' }}>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-3 text-sm font-semibold transition-colors"
          style={{ color: '#5C766D' }}
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
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div
                className="mt-6 p-8 rounded-3xl border"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#EDE9E6'
                }}
              >
                <div className="flex items-start gap-3 mb-6">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: '#EDE9E6' }}>
                    <Info className="w-5 h-5" style={{ color: '#5C766D' }} />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#5C4F4A80' }}>
                    These optional metrics help calculate acute cerebrovascular stroke risk mapping.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <ToggleBtn name="currentSmoker" label="Current Smoker" formData={formData} setFormData={setFormData} />
                  <ToggleBtn name="BPMeds" label="On BP Meds" formData={formData} setFormData={setFormData} />
                  <ToggleBtn name="prevalentStroke" label="Prior Stroke" formData={formData} setFormData={setFormData} />
                  <ToggleBtn name="prevalentHyp" label="Hypertension" formData={formData} setFormData={setFormData} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SelectMenu
                    label="Education Level"
                    name="education"
                    options={[
                      { label: 'Some High School', value: '1' },
                      { label: 'High School Grad', value: '2' },
                      { label: 'Some College', value: '3' },
                      { label: 'College Grad+', value: '4' }
                    ]}
                    formData={formData} onChange={handleChange}
                  />
                  <InputField label="Cigs Per Day" name="cigsPerDay" icon={Activity} placeholder="e.g. 10" formData={formData} onChange={handleChange} />
                  <InputField label="Diastolic BP" name="diaBP" icon={Activity} placeholder="Dia mmHg" formData={formData} onChange={handleChange} />
                  <InputField label="BMI" name="BMI" icon={User} placeholder="e.g. 24.5" step="0.1" formData={formData} onChange={handleChange} />
                  <InputField label="Glucose Level" name="glucose" icon={Activity} placeholder="mg/dl" formData={formData} onChange={handleChange} />
                  <ToggleBtn name="diabetes" label="Has Diabetes" formData={formData} setFormData={setFormData} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}