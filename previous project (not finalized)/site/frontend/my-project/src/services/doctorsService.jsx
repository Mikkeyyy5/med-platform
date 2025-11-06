import api from './api';

export const doctorsService = {
  getDoctors: async (format = null) => {
    const params = format ? { format } : {};
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  getDoctor: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  }
};