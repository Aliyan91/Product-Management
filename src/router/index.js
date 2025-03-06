import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue"
import ProductsView from "@/views/Products.vue"
import CartView from "@/views/CartView.vue"
<<<<<<< HEAD
import Login from '@/views/login.vue'
import { useAuthStore } from '@/store/auth'
=======
import Login from '@/views/login.vue';
import { useAuthStore } from '@/store/auth';
>>>>>>> 9119742c15ff4eaf95a727614f6216541b5c2b20

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
      meta: { requiresAuth: true }
    },
<<<<<<< HEAD
    {
      path: '/admin-login',
      name: 'AdminLogin',
      component: () => import('@/views/AdminLogin.vue')
    },
    {
      path: '/admin-portal',
      name: 'AdminPortal',
      component: () => import('@/views/AdminPortal.vue'),
    }
  ]
})

// Navigation Guard
=======
  //   {
  //     path: '/',
  //     name: 'dashboard',
  //     component: DashboardView
  //   },
  ]
})

// Updated navigation guard
>>>>>>> 9119742c15ff4eaf95a727614f6216541b5c2b20
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Protect user-authenticated routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  // Prevent logged-in users from accessing login page
  if (authStore.isAuthenticated && to.name === 'login') {
    return next('/')
  }

  // Protect the admin portal
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/admin-login')
  }

  next()
})

export default router
