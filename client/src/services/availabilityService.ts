import api from "@/api/client";

export interface Availability {
  id?: number;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
}

export const availabilityService = {
  addAvailability: async (doctorId: number, data: Availability) => {
    const res = await api.post(`/availabilities/doctor/${doctorId}`, data);
    return res.data.data;
  },
  getDoctorAvailability: async (doctorId: number) => {
    const res = await api.get(`/availabilities/doctor/${doctorId}`);
    return res.data.data as Availability[];
  },
  getAvailableSlots: async (doctorId: number) => {
    const res = await api.get(`/availabilities/doctor/${doctorId}/available`);
    return res.data.data as Availability[];
  },
  deleteAvailability: async (id: number) => {
    const res = await api.delete(`/availabilities/${id}`);
    return res.data;
  }
};
