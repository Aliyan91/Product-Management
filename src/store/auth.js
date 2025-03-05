import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null
  }),
  actions: {
    login(credentials) {
      // For demo purposes, using hardcoded credentials
      if (credentials.username === 'user@example.com' && credentials.password === 'userpassword') {
        this.isAuthenticated = true;
        this.user = {
          email: credentials.username,
          role: 'user'
        };
        return true;
      }
      return false;
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
    }
  }
})