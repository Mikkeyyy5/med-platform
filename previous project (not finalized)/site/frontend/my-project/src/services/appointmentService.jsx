import api from './api';

export const appointmentsService = {
  getUserAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await api.put(`/appointments/${appointmentId}/cancel`);
    return response.data;
  },

  rescheduleAppointment: async (appointmentId, newDate) => {
    const response = await api.put(`/appointments/${appointmentId}/reschedule`, { newDate });
    return response.data;
  }
};