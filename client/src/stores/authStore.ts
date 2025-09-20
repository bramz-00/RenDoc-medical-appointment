import { authService, type LoginForm, type User } from "@/services/authService";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (form: LoginForm) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: false,

  login: async (form) => {
    set({ loading: true });
    try {
      const data = await authService.login(form);
      localStorage.setItem("token", data.token);
      set({ token: data.token, user: data.user, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  logout: async() => {
    localStorage.removeItem("token");
    await authService.logout();
    set({ user: null, token: null });
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