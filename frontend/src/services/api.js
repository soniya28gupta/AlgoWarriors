import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/register`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Registration failed";
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Login failed";
  }
};

export const saveOnboarding = async (user_id, onboardingData) => {
  try {
    const response = await axios.post(`${API_URL}/api/onboarding`, { user_id, onboarding: onboardingData });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to save onboarding";
  }
};

export const getHistory = async (user_id) => {
  try {
    const response = await axios.get(`${API_URL}/api/history/${user_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to load history";
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
