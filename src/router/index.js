import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AdminPortal from '../views/AdminPortal.vue'
import ProductDetails from '../views/ProductDetails.vue'
import ProductManagement from '../views/ProductManagement.vue'
import UserManagement from '../views/UserManagement.vue'
import OrderManagement from '../views/OrderManagement.vue'
import CategoryManagement from '../views/CategoryManagement.vue'
import AdminLogin from '../views/AdminLogin.vue'
import { requireAuth } from '../utils/authGuard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/admin/login',
      name: 'AdminLogin',
      component: AdminLogin
    },
    {
      path: '/admin',
      name: 'AdminPortal',
      component: () => import('../views/AdminPortal.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/product/:id',
      name: 'product-details',
      component: ProductDetails
    },
    {
      path: '/products',
      name: 'ProductManagement',
      component: ProductManagement
    },
    {
      path: '/users',
      name: 'UserManagement',
      component: UserManagement
    },
    {
      path: '/orders',
      name: 'OrderManagement',
      component: OrderManagement
    },
    {
      path: '/categories',
      name: 'CategoryManagement',
      component: CategoryManagement,
    }
  ]
})

// Add navigation guard
router.beforeEach(requireAuth)

export default router
