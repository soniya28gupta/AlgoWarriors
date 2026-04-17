import React from 'react';
import { Activity, Droplet, Hash, Heart, Ruler, Scale, User, FileText } from 'lucide-react';

const InputField = ({ label, name, type = "number", icon: Icon, placeholder, step, formData, onChange }) => (
  <div className="relative group">
    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1 group-focus-within:text-blue-400 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
      </div>
      <input
        type={type}
        name={name}
        step={step}
        value={formData[name] ?? ''}
        onChange={onChange}
        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium glow-input hover:border-slate-600"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default function DiabetesForm({ formData, setFormData }) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Pregnancies" name="pregnancies" icon={Hash} placeholder="e.g. 1" formData={formData} onChange={handleChange} />
        <InputField label="Age" name="age" icon={User} placeholder="e.g. 35" formData={formData} onChange={handleChange} />
      </div>

      <div className="relative group">
        <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">
          Glucose Level
        </label>
        <div className="relative">
          <input
            type="number"
            name="glucose"
            value={formData.glucose ?? ''}
            onChange={handleChange}
            placeholder="Enter glucose level"
            className="block w-full pl-3 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-slate-100 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="relative group">
        <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">
          Blood Pressure
        </label>
        <div className="relative">
          <input
            type="number"
            name="bp"
            value={formData.bp ?? ''}
            onChange={handleChange}
            placeholder="Enter blood pressure"
            className="block w-full pl-3 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-slate-100 focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="relative group">
        <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">
          BMI
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.1"
            name="bmi"
            value={formData.bmi ?? ''}
            onChange={handleChange}
            placeholder="Enter BMI"
            className="block w-full pl-3 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-slate-100 focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Insulin Level" name="insulin" icon={Droplet} placeholder="e.g. 80" formData={formData} onChange={handleChange} />
        <InputField label="Skin Thickness" name="skinThickness" icon={Ruler} placeholder="e.g. 20" formData={formData} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:col-span-2">
        <InputField
          label="Diabetes Pedigree Function"
          name="diabetes_pedigree"
          icon={FileText}
          placeholder="e.g. 0.5"
          step="0.01"
          formData={formData} 
          onChange={handleChange}
        />
      </div>
    </div>
  );
}