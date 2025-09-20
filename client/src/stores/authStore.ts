import { authService, type LoginForm, type User } from "@/services/authService";
import { create } from "zustand";

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAdmin: boolean;
    login: (form: LoginForm) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    isAdmin: false,
    setUser: (user) => set({ user }),

    login: async (form) => {
        set({ loading: true });
        try {
            const data = await authService.login(form);
            localStorage.setItem("token", data.token);
            const user = await authService.whoami();
            set({ token: data.token, user: user, loading: false,isAdmin: user.role === "ADMIN", });
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    logout: async () => {
        localStorage.removeItem("token");
        await authService.logout();
        set({ user: null, token: null,isAdmin: false });
    },

    fetchUser: async () => {
        try {
            const user = await authService.whoami();
            set({ user });
        } catch (err) {
            console.error("Whoami failed:", err);
        }
    },
}));