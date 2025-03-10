export const isAuthenticated = () => {
  return localStorage.getItem('isAdminAuthenticated') === 'true'
}

export const requireAuth = (to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/admin/login')
  } else {
    next()
  }
} 