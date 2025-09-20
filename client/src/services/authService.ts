// services/authService.ts

import api from "@/api/client";
import { useAuthStore } from "@/stores/authStore";


export interface LoginForm {
    email: string;
    password: string;
}

export interface User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
}

export const authService = {
    login: async (form: LoginForm) => {
        const res = await api.post("/auth/login", form);
        return res.data.data;
    },
    logout: async () => {
        const res = await api.post("/auth/logout");
        return res.data;
    },

    whoami: async (): Promise<User> => {
        const res = await api.get("/auth/whoami");
        return res.data.data;
    },
};