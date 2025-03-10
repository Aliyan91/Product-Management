import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/login.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import ProductManagement from '../views/ProductManagement.vue'
import UserManagement from '../views/UserManagement.vue'
import OrderManagement from '../views/OrderManagement.vue'
import CategoryManagement from '../views/CategoryManagement.vue'
import AdminLogin from '../views/AdminLogin.vue'
import { requireAuth } from '../utils/authGuard'
import { useProductStore } from '@/store/products'
import ProductsView from '@/views/Products.vue'
import CartView from '@/views/CartView.vue'
import AccountView from '@/views/AccountView.vue'
import AdminPortalView from '../views/AdminPortal.vue'

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
      component: AdminPortalView,
      meta: { requiresAdmin: true }
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'UserManagement',
      component: UserManagement
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresAuth: false }
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
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetailView,
      meta: { requiresAuth: false }
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
      meta: { requiresAuth: true }
    }
  ]
})

// Updated navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const productStore = useProductStore()

  // Check if initialize method exists before calling it
  if (typeof productStore.initialize === 'function') {
    productStore.initialize()
  }

  // If user is authenticated and trying to access login or register
  if (authStore.isAuthenticated && (to.name === 'login' || to.name === 'register')) {
    next('/')
  }
  // If route requires auth and user is not authenticated
  else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  }
  else {
    next()
  }
})

// Add navigation guard
router.beforeEach(requireAuth)

export default router
