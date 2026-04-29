import api from "@/api/client";

export interface Doctor {
  id: number;
  user: {
    id: number;
    firstname: string;
    lastname: string;
  };
  speciality: {
    name: string;
  };
}

export const doctorService = {
  getAllDoctors: async () => {
    const res = await api.get("/doctors");
    return res.data.data as Doctor[];
  },
  getDoctorById: async (id: number) => {
    const res = await api.get(`/doctors/${id}`);
    return res.data.data as Doctor;
  }
};
