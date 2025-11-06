// services/appealService.js
import api from './api';

export const appealService = {
  createAppeal: async (appealData) => {
    const response = await api.post('/appeals', appealData);
    return response.data;
  },

  getAppeals: async () => {
    const response = await api.get('/appeals');
    return response.data;
  },

  analyzeAppeal: async (appealId) => {
    const response = await api.post(`/appeals/${appealId}/analyze`);
    return response.data;
  },

  assignDoctor: async (appealId, doctorId) => {
    const response = await api.post(`/appeals/${appealId}/assign`, { doctorId });
    return response.data;
  }
};