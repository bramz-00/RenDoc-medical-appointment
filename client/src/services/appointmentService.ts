import api from "@/api/client";

export interface CreateAppointmentData {
  patientId: number;
  doctorId: number;
  availabilityId: number;
  notes?: string;
}

export const appointmentService = {
  createAppointment: async (data: CreateAppointmentData) => {
    const res = await api.post("/appointments/create", data);
    return res.data;
  },

  getAppointmentsByPatient: async (patientId: number) => {
    const res = await api.get(`/appointments/patient/${patientId}`);
    return res.data.data;
  },

  cancelAppointment: async (id: number) => {
    const res = await api.put(`/appointments/cancel/${id}`);
    return res.data;
  },
};
