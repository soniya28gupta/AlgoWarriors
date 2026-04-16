import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

export const predictRisk = async (diseaseType, data) => {
  try {
    const response = await axios.post(`${API_URL}/predict`, {
      type: diseaseType,
      ...data
    });
    return response.data;
  } catch (error) {
    console.error("Error predicting risk:", error);
    if (error.response && error.response.data && error.response.data.error) {
       throw new Error(error.response.data.error);
    }
    throw new Error('Failed to connect to the prediction servers.');
  }
};
