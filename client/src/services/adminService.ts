import api from "@/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  enabled: boolean;
  createdAt: string;
}

export interface AdminPatient {
  id: number;
  status: string;
  createdAt: string;
  user: AdminUser;
}

export interface AdminDoctor {
  id: number;
  status: string;
  createdAt: string;
  user: AdminUser;
  speciality: { id: number; name: string };
  cabinet: { id: number; name: string; location: string };
}

export interface AdminCabinet {
  id: number;
  name: string;
  location: string;
  createdAt: string;
}

export interface AdminSpeciality {
  id: number;
  name: string;
}

export interface CreateDoctorPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  specialityId: number;
  cabinetId: number;
}

export interface UpdateDoctorPayload {
  firstname?: string;
  lastname?: string;
  status?: string;
  specialityId?: number;
  cabinetId?: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const adminService = {
  // Users
  getAllUsers: async (): Promise<AdminUser[]> => {
    const res = await api.get("/users/admin/all");
    return res.data.data;
  },
  deleteUser: async (id: number) => {
    const res = await api.delete(`/users/admin/${id}`);
    return res.data;
  },

  // Patients
  getAllPatients: async (): Promise<AdminPatient[]> => {
    const res = await api.get("/users/admin/patients");
    return res.data.data;
  },

  // Doctors
  getAllDoctors: async (): Promise<AdminDoctor[]> => {
    const res = await api.get("/doctors");
    return res.data.data;
  },
  createDoctor: async (payload: CreateDoctorPayload): Promise<AdminDoctor> => {
    const res = await api.post("/doctors/admin/create", payload);
    return res.data.data;
  },
  updateDoctor: async (id: number, payload: UpdateDoctorPayload): Promise<AdminDoctor> => {
    const res = await api.put(`/doctors/admin/${id}`, payload);
    return res.data.data;
  },
  deleteDoctor: async (id: number) => {
    const res = await api.delete(`/doctors/admin/${id}`);
    return res.data;
  },

  // Cabinets
  getAllCabinets: async (): Promise<AdminCabinet[]> => {
    const res = await api.get("/cabinets");
    return res.data.data;
  },
  createCabinet: async (payload: { name: string; location: string }): Promise<AdminCabinet> => {
    const res = await api.post("/cabinets", payload);
    return res.data.data;
  },
  updateCabinet: async (id: number, payload: { name: string; location: string }) => {
    const res = await api.put(`/cabinets/${id}`, payload);
    return res.data.data;
  },
  deleteCabinet: async (id: number) => {
    const res = await api.delete(`/cabinets/${id}`);
    return res.data;
  },

  // Specialities
  getAllSpecialities: async (): Promise<AdminSpeciality[]> => {
    const res = await api.get("/specialities/all");
    return res.data.data;
  },
  createSpeciality: async (name: string) => {
    const res = await api.post("/specialities/store", { name });
    return res.data.data;
  },
  deleteSpeciality: async (id: number) => {
    const res = await api.delete(`/specialities/delete/${id}`);
    return res.data;
  },
};
