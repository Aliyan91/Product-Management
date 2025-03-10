import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProductDetails from '../views/ProductDetails.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import ProductManagement from '../views/ProductManagement.vue'
import UserManagement from '../views/UserManagement.vue'
import OrderManagement from '../views/OrderManagement.vue'
import CategoryManagement from '../views/CategoryManagement.vue'
import AdminLogin from '../views/AdminLogin.vue'
import { requireAuth } from '../utils/authGuard'
import { useProductStore } from '@/store/products'

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
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetailView,
      meta: { requiresAuth: false }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/AccountView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    //   {
    //     path: '/',
    //     name: 'dashboard',
    //     component: DashboardView
    //   },
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


// Updated navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const productStore = useProductStore()

  // Initialize product store
  productStore.initialize()

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
