import api from "@/api/client";

export interface DashboardStats {
  // Admin stats
  totalDoctors?: number;
  totalPatients?: number;
  totalAppointments?: number;
  totalCabinets?: number;
  
  // Doctor/Patient common stats
  todayAppointments?: number;
  pendingAppointments?: number;
  confirmedAppointments?: number;
  thisWeekAppointments?: number;
  activeClients?: number;
  
  // Patient specific
  upcomingCount?: number;
  totalDoctorsSeen?: number;
  
  // Lists
  recentAppointments?: any[];
  upcomingAppointments?: any[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get("/dashboard/stats");
    return res.data.data;
  },
};
