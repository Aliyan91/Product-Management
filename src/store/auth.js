import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    isAdmin: false,
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
      // For admin login - make sure the password is consistent
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        this.isAuthenticated = true
        this.isAdmin = true
        this.user = {
          email: credentials.username,
          role: 'admin'
        }
        return true
      }

      // For regular user login
      const user = this.registeredUsers.find(
        user => user.email === credentials.username && user.password === credentials.password
      )

      if (user) {
        this.isAuthenticated = true
        this.isAdmin = false
        this.user = {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          dateJoined: user.dateJoined
        }
        return true
      }

      return false
    },
    logout() {
      this.isAuthenticated = false
      this.isAdmin = false
      this.user = null
      this.orderHistory = []
    },
    addOrder(order) {
      this.orderHistory.unshift(order)
    }
  }
})