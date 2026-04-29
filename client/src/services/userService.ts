import api from "@/api/client";

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export const userService = {
  updateProfile: async (data: UpdateProfileData) => {
    const res = await api.put("/users/profile/update", data);
    return res.data;
  },

  getUserById: async (userId: number) => {
    const res = await api.get(`/users/${userId}`);
    return res.data.data;
  },
};
