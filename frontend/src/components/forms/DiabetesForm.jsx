
import React from 'react';
import { Activity, Droplet, Hash, Heart, Ruler, Scale, User, FileText } from 'lucide-react';

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
        value={formData[name] ?? ''}
        onChange={onChange}
        className="block w-full pl-12 pr-4 py-4 rounded-2xl font-medium outline-none transition-all"
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #EDE9E6',        // Persistent subtle outline
          color: '#5C4F4A',
        }}
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Pregnancies" name="pregnancies" icon={Hash} placeholder="e.g. 1" formData={formData} onChange={handleChange} />
        <InputField label="Age" name="age" icon={User} placeholder="e.g. 35" formData={formData} onChange={handleChange} />
      </div>

      <div className="relative group">
        <label
          className="block text-sm font-medium mb-2 ml-1 transition-colors"
          style={{ color: '#5C4F4A' }}
        >
          Glucose Level
        </label>
        <div className="relative">
          <input
            type="number"
            name="glucose"
            value={formData.glucose ?? ''}
            onChange={handleChange}
            placeholder="Enter glucose level"
            className="block w-full pl-4 pr-4 py-4 rounded-2xl font-medium outline-none transition-all"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #EDE9E6',        // Persistent outline
              color: '#5C4F4A',
            }}
          />
        </div>
      </div>

      <div className="relative group">
        <label
          className="block text-sm font-medium mb-2 ml-1 transition-colors"
          style={{ color: '#5C4F4A' }}
        >
          Blood Pressure
        </label>
        <div className="relative">
          <input
            type="number"
            name="bp"
            value={formData.bp ?? ''}
            onChange={handleChange}
            placeholder="Enter blood pressure"
            className="block w-full pl-4 pr-4 py-4 rounded-2xl font-medium outline-none transition-all"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #EDE9E6',
              color: '#5C4F4A',
            }}
          />
        </div>
      </div>

      <div className="relative group">
        <label
          className="block text-sm font-medium mb-2 ml-1 transition-colors"
          style={{ color: '#5C4F4A' }}
        >
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
            className="block w-full pl-4 pr-4 py-4 rounded-2xl font-medium outline-none transition-all"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #EDE9E6',
              color: '#5C4F4A',
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Insulin Level" name="insulin" icon={Droplet} placeholder="e.g. 80" formData={formData} onChange={handleChange} />
        <InputField label="Skin Thickness" name="skinThickness" icon={Ruler} placeholder="e.g. 20" formData={formData} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1">
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