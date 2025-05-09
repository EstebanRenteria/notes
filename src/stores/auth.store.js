import { defineStore } from "pinia";
import {
  login as apiLogin,
  logout as apiLogout,
  validateToken,
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
      const token = localStorage.getItem("token");
      if (token) {
        const isValid = await validateToken(token);
        if (isValid) {
          this.token = token;
          return true;
        }
      }
      this.logout();
      return false;
    },

    async logout() {
      try {
        this.token = null;
        this.user = null;
        localStorage.removeItem("apiKey");
        delete axios.defaults.headers.common["Authorization"];
      } catch (error) {
        console.error("Error en logout:", error);
      }
    },
  },
});
