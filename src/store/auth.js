import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    orderHistory: [],
    registeredUsers: []
  }),
  persist: true,
  actions: {
    register(userData) {
      const existingUser = this.registeredUsers.find(user => user.email === userData.email)
      if (existingUser) {
        return false
      }

      this.registeredUsers.push({
        ...userData,
        id: Date.now(),
        dateJoined: new Date()
      })
      return true
    },
    login(credentials) {
      const user = this.registeredUsers.find(
        user => user.email === credentials.username && user.password === credentials.password
      )

      if (user) {
        this.isAuthenticated = true
        this.user = {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          dateJoined: user.dateJoined
        }
        return true
      }

      // For demo purposes, using hardcoded credentials
      if (credentials.username === '1122' && credentials.password === '1122') {
        this.isAuthenticated = true;
        this.user = {
          email: credentials.username,
          role: 'user'
        }
        return true
      }

      return false
    },
    logout() {
      this.isAuthenticated = false
      this.user = null
      this.orderHistory = []
    },
    addOrder(order) {
      this.orderHistory.unshift(order)
    }
  }
})