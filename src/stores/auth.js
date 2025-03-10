import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null
  }),

  actions: {
    login(credentials) {
      // For demo purposes, using simple authentication
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        this.isAuthenticated = true
        this.user = {
          username: credentials.username,
          role: 'admin'
        }
        return true
      }
      return false
    },

    logout() {
      this.isAuthenticated = false
      this.user = null
    }
  },

  persist: true
}) 