import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        value={formData[name] || ''}
        onChange={onChange}
        step={step}
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

export default function CancerForm({ formData, setFormData }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Age" name="AGE" icon={User} placeholder="e.g. 50" formData={formData} onChange={handleChange} />

        <div className="relative group">
          <label
            className="block text-sm font-medium mb-2 ml-1 transition-colors"
            style={{ color: '#5C4F4A' }}
          >
            Gender
          </label>
          <select
            name="GENDER"
            value={formData.GENDER || ''}
            onChange={handleChange}
            className="block w-full px-5 py-4 rounded-2xl font-medium outline-none transition-all appearance-none"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid transparent',
              color: '#5C4F4A',
            }}
          >
            <option value="" disabled>Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <ToggleBtn name="SMOKING" label="Smoking" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="YELLOW_FINGERS" label="Yellow Fingers" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="ANXIETY" label="Anxiety" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="PEER_PRESSURE" label="Peer Pressure" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="CHRONIC_DISEASE" label="Chronic Disease" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="FATIGUE" label="Fatigue" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="ALLERGY" label="Allergy" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="WHEEZING" label="Wheezing" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="ALCOHOL_CONSUMING" label="Alcohol Consuming" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="COUGHING" label="Coughing" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="SHORTNESS_OF_BREATH" label="Shortness of Breath" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="SWALLOWING_DIFFICULTY" label="Swallowing Diff." formData={formData} setFormData={setFormData} />
        <ToggleBtn name="CHEST_PAIN" label="Chest Pain" formData={formData} setFormData={setFormData} />
      </div>

      {/* Advanced Section */}
      <div className="pt-6 border-t" style={{ borderColor: '#EDE9E6' }}>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-3 text-sm font-semibold transition-colors"
          style={{ color: '#5C766D' }}
        >
          {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <span>Advanced Diagnostic Metrics</span>
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
                    These metrics are optional fine-tuning parameters from cellular imaging data.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Radius" name="radius" icon={Info} placeholder="Mean Radius" step="0.01" formData={formData} onChange={handleChange} />
                  <InputField label="Texture" name="texture" icon={Info} placeholder="Mean Texture" step="0.01" formData={formData} onChange={handleChange} />
                  <InputField label="Area" name="area" icon={Info} placeholder="Mean Area" step="0.1" formData={formData} onChange={handleChange} />
                  <InputField label="Smoothness" name="smoothness" icon={Info} placeholder="Mean Smoothness" step="0.001" formData={formData} onChange={handleChange} />
                  <InputField label="Concavity" name="concavity" icon={Info} placeholder="Mean Concavity" step="0.001" formData={formData} onChange={handleChange} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}