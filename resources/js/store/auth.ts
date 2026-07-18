import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/lib/permissions";
import axios from "axios";

export interface SessionUser {
  id: string | number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthState {
  user: SessionUser | null;
  token: string | null;
  setUser: (user: SessionUser | null) => void;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      login: async (email, password = "password") => {
        try {
          await axios.get("/sanctum/csrf-cookie");
          const res = await axios.post("/api/v1/auth/login", { email, password });
          const { token, user } = res.data.data;
          
          // Save token to localStorage for axios interceptor
          localStorage.setItem("auth_token", token);
          
          // Normalize backend role name to match frontend Role type
          let backendRole = user.role.toLowerCase().replace(/ /g, "_");
          if (backendRole === "organization_admin") backendRole = "ceo";
          if (backendRole === "hr_manager") backendRole = "hr";
          
          // Validate role
          const validRole = ["super_admin", "ceo", "sales", "project_manager", "team_leader", "developer", "designer", "qa", "accountant", "hr", "support", "client"].includes(backendRole) ? backendRole : "client";

          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: validRole as Role,
            },
            token,
          });
        } catch (error) {
          console.error("Login failed", error);
          throw error;
        }
      },
      logout: async () => {
        try {
          await axios.post("/api/v1/auth/logout");
        } catch (error) {
          console.error("Logout failed on server", error);
        }
        localStorage.removeItem("auth_token");
        set({ user: null, token: null });
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: "knower-auth" },
  ),
);
