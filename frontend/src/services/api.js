import axios from 'axios';

// Automatically point to local backend if running on localhost to avoid DNS resolution errors
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:5000' : 'https://algowarriors.onrender.com');

const formatError = (error, fallback) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.status === 500) {
    return "Server Error (500): Backend database is not configured. Please ensure MONGO_URI is set on Render.";
  }
  if (error.response?.status === 401) {
    return "Invalid credentials. Please verify your username and password.";
  }
  if (error.response?.status === 404) {
    return "Resource not found.";
  }
  if (error.code === 'ERR_NETWORK') {
    return "Network Error: Unable to reach backend server. Please verify your connection or backend status.";
  }
  return error.message || fallback;
};

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/register`, { username, password });
    return response.data;
  } catch (error) {
    throw formatError(error, "Registration failed");
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, { username, password });
    return response.data;
  } catch (error) {
    throw formatError(error, "Login failed");
  }
};

export const saveOnboarding = async (user_id, onboardingData) => {
  try {
    const response = await axios.post(`${API_URL}/api/onboarding`, { user_id, onboarding: onboardingData });
    return response.data;
  } catch (error) {
    throw formatError(error, "Failed to save onboarding");
  }
};

export const getHistory = async (user_id) => {
  try {
    const response = await axios.get(`${API_URL}/api/history/${user_id}`);
    return response.data;
  } catch (error) {
    throw formatError(error, "Failed to load history");
  }
};

export const predictRisk = async (diseaseType, data, user_id = null) => {
  try {
    const payload = {
      type: diseaseType,
      ...data
    };
    if (user_id) {
      payload.user_id = user_id;
    }
    const response = await axios.post(`${API_URL}/predict`, payload);
    return response.data;
  } catch (error) {
    console.error("Error predicting risk:", error);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to connect to the prediction servers.');
  }
};

export const getGeminiRecommendations = async (formData, riskPercentage, diseaseType) => {
  try {
    const payload = { ...formData, risk_percentage: riskPercentage, disease: diseaseType };
    const response = await axios.post(`${API_URL}/api/recommendations`, payload);
    return response.data;
  } catch (error) {
    throw formatError(error, "Failed to fetch LLM recommendations");
  }
};

export const getNearbyHospitals = async (lat, lon) => {
  try {
    const response = await axios.get(`${API_URL}/api/nearby-hospitals?lat=${lat}&lon=${lon}`);
    return response.data;
  } catch (error) {
    throw formatError(error, "Failed to find nearby hospitals");
  }
};

export const analyzeSymptoms = async (selected_symptoms, user_id = null) => {
  try {
    const response = await axios.post(`${API_URL}/api/analyze-symptoms`, { selected_symptoms, user_id });
    return response.data;
  } catch (error) {
    throw formatError(error, "Symptom analysis failed");
  }
};
