import { defineStore } from "pinia";
import {
  login as apiLogin,
  logout as apiLogout,
} from "@/api/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    apiKey: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.apiKey,
  },

  actions: {
    async login(credentials) {
      const data = await apiLogin(credentials);
      this.apiKey = data.apiKey;
      this.user = data.user;
      localStorage.setItem("apiKey", data.apiKey);
    },

    async checkAuth() {
      const token = localStorage.getItem("apiKey");
      if (token) {
        this.apiKey = token;
        return true;
      }
      this.logout();
      return false;
    },

    async logout() {
      try {
        this.apiKey = null;
        this.user = null;
        router.push('/login')
        apiLogout();
      } catch (error) {
        console.error("Error en logout:", error);
      }
    },
  },
  persist: true
});
