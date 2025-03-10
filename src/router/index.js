import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue"
import ProductsView from "@/views/Products.vue";
import CartView from "@/views/CartView.vue"
import Login from '@/views/login.vue';
import { useAuthStore } from '@/store/auth';
import ProductDetailView from "@/views/ProductDetailView.vue"
import { useProductStore } from '@/store/products';

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
  //   {
  //     path: '/',
  //     name: 'dashboard',
  //     component: DashboardView
  //   },
  ]
})

// Updated navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const productStore = useProductStore()
  
  // Initialize product store
  productStore.initialize()
  
  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  }
  // If user is authenticated and trying to access login page
  else if (authStore.isAuthenticated && to.name === 'login') {
    next('/')
  }
  else {
    next()
  }
})

export default router