import { useAuthStore } from '../stores/auth'

export const isAuthenticated = () => {
  const authStore = useAuthStore()
  return authStore.isAuthenticated
}

export const isAdmin = () => {
  const authStore = useAuthStore()
  return authStore.isAdmin
}

export const requireAuth = (to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else if (to.meta.requiresAdmin && !isAdmin()) {
    next('/admin/login')
  } else {
    next()
  }
} 