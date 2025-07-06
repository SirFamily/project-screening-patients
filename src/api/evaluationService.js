import { API_URL } from '@env';

export const saveEvaluation = async (patientData) => {
  try {
    const response = await fetch(`${API_URL}/evaluations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save evaluation');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

export const getSavedPatients = async () => {
  try {
    const response = await fetch(`${API_URL}/patients`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch patients');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
