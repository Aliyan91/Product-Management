import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    orderHistory: []
  }),
  persist: true,
  actions: {
    login(credentials) {
      // For demo purposes, using hardcoded credentials
      if (credentials.username === '1122' && credentials.password === '1122') {
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
      this.orderHistory = [];
    },
    addOrder(order) {
      this.orderHistory.unshift(order);
    }
  }
})