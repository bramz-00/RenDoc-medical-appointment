import { authService, type LoginForm, type User } from "@/services/authService";
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import Cookies from "js-cookie";

// Custom storage implementation using Cookies
const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string): void => {
    // Set cookie with 7 days expiration and secure flags
    Cookies.set(name, value, { expires: 7, secure: true, sameSite: "strict" });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      isAdmin: false,
      setUser: (user) => set({ user, isAdmin: user?.role === "ADMIN" }),

      login: async (form) => {
        set({ loading: true });
        try {
          const data = await authService.login(form);
          const user = {
            id: data.id,
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            role: data.role,
          };
          set({
            token: data.token,
            user: user,
            loading: false,
            isAdmin: user.role === "ADMIN",
          });
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (e) {
          console.error("Logout error", e);
        } finally {
          Cookies.remove("auth-storage");
          set({ user: null, token: null, isAdmin: false });
        }
      },

      fetchUser: async () => {
        if (!Cookies.get("auth-storage")) return;
        set({ loading: true });
        try {
          const user = await authService.whoami();
          set({ user, isAdmin: user.role === "ADMIN", loading: false });
        } catch (err) {
          console.error("Whoami failed:", err);
          set({ user: null, token: null, isAdmin: false, loading: false });
          Cookies.remove("auth-storage");
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => cookieStorage),
      // Only persist the token. User info will be re-fetched via fetchUser on refresh.
      partialize: (state) => ({ token: state.token }),
    }
  )
);