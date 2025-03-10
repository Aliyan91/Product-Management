<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation Header -->
    <nav class="bg-gray-800 border-b border-gray-700">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <!-- Cart Icon -->
              <svg class="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h1 class="text-2xl font-bold text-white">ShopCart</h1>
            </div>
            
            <!-- Conditionally Render Search Bar -->
            <div v-if="$route.name !== 'login'" class="hidden md:flex ml-6 flex-1 max-w-xl">
              <div class="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search products..."
                  class="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  v-model="searchQuery"
                  @keyup.enter="handleSearch"
                />
                <!-- Search Icon -->
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Desktop Navigation Links -->
            <div class="hidden md:block ml-6">
              <div class="flex items-baseline space-x-4">
                <RouterLink 
                  to="/" 
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  active-class="bg-gray-900 text-white"
                >
                  Home
                </RouterLink>
                <RouterLink 
                  v-if="authStore.isAuthenticated"
                  to="/products" 
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  active-class="bg-gray-900 text-white"
                >
                  Products
                </RouterLink>
              </div>
            </div>

            <!-- Add this between the navigation links and the account/cart icons in the desktop navbar -->
            
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button 
              @click="isMenuOpen = !isMenuOpen" 
              class="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  v-if="!isMenuOpen" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path 
                  v-else 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Desktop Cart and Login/Logout -->
          <div class="hidden md:flex items-center space-x-4">
            <!-- Account Icon -->
            <RouterLink 
              v-if="authStore.isAuthenticated"
              to="/account" 
              class="relative text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </RouterLink>

            <!-- Cart Icon -->
            <RouterLink 
              v-if="authStore.isAuthenticated"
              to="/cart" 
              class="relative text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span 
                v-if="cartStore.cartCount" 
                class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {{ cartStore.cartCount }}
              </span>
            </RouterLink>
            
            <!-- Navigation Links -->
            <div class="flex items-center space-x-4">
              <!-- Regular auth buttons -->
              <RouterLink 
                v-if="!authStore.isAuthenticated"
                to="/login" 
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                Login
              </RouterLink>
              
              <!-- Admin Login Button -->
              <RouterLink 
                to="/admin/login"
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                Admin Login
              </RouterLink>
              
              <button 
                v-if="authStore.isAuthenticated"
                @click="handleLogout" 
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu, show/hide based on menu state -->
      <div 
        v-if="isMenuOpen" 
        class="md:hidden bg-gray-800 border-t border-gray-700"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <RouterLink 
            to="/" 
            class="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-gray-900 text-white"
            @click="isMenuOpen = false"
          >
            Home
          </RouterLink>
          <RouterLink 
            v-if="authStore.isAuthenticated"
            to="/products" 
            class="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-gray-900 text-white"
            @click="isMenuOpen = false"
          >
            Products
          </RouterLink>
          
          <!-- Mobile Search -->
          <div class="px-3 py-2">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search products..."
                class="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                v-model="searchQuery"
                @keyup.enter="handleSearch"
              >
              <!-- Search Icon -->
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <RouterLink 
            v-if="authStore.isAuthenticated"
            to="/account" 
            class="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            @click="isMenuOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            My Account
          </RouterLink>
          
          <RouterLink 
            v-if="authStore.isAuthenticated"
            to="/cart" 
            class="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            @click="isMenuOpen = false"
          >
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
            <span 
              v-if="cartStore.cartCount" 
              class="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              {{ cartStore.cartCount }}
            </span>
          </RouterLink>
          
          <!-- Mobile Login Link when not authenticated -->
          <RouterLink 
            v-if="!authStore.isAuthenticated"
            to="/login" 
            class="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-base font-medium"
            @click="isMenuOpen = false"
          >
            Login
          </RouterLink>
          
          <!-- Mobile Logout Button when authenticated -->
          <button 
            v-if="authStore.isAuthenticated"
            @click="handleLogout" 
            class="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Search Results Modal -->
    <div v-if="showSearchResults && searchResults.length > 0" class="container mx-auto px-4 py-4">
      <div class="bg-gray-800 rounded-lg shadow-lg p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Search Results for "{{ searchQuery }}"</h2>
          <button @click="clearSearch" class="text-gray-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div 
            v-for="product in searchResults" 
            :key="product.id" 
            class="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
            @click="showProductDetails(product)"
          >
            <img :src="product.picture" :alt="product.name" class="w-full h-48 object-cover">
            <div class="p-4 flex-grow">
              <h3 class="text-xl font-semibold text-white mb-2">{{ product.name }}</h3>
              <p class="text-gray-400 mb-2 line-clamp-2">{{ product.description }}</p>
              <p class="text-green-500 font-bold text-lg mb-4">${{ product.price.toFixed(2) }}</p>
            </div>
            <div class="p-4 pt-0">
              <button 
                @click.stop="addToCart(product)" 
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="searchResults.length === 0" class="text-center py-8">
          <p class="text-gray-400">No products found matching "{{ searchQuery }}"</p>
        </div>
      </div>
    </div>

    <RouterView v-if="!showSearchResults" />
    
    <!-- Product Details Modal for search results -->
    <ProductDetails 
      v-if="selectedProduct" 
      :product="selectedProduct" 
      @close="selectedProduct = null" 
    />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { useProductStore } from '@/store/products'
import { useToast } from 'vue-toastification'
import { ref, computed } from 'vue'
import ProductDetails from '@/components/ProductDetails.vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const productStore = useProductStore()
const toast = useToast()

const searchQuery = ref('')
const isMenuOpen = ref(false)
const showSearchResults = ref(false)
const selectedProduct = ref(null)

// Search functionality
const searchResults = ref([])

const handleSearch = () => {
  if (searchQuery.value.trim() === '') {
    showSearchResults.value = false
    return
  }
  
  const query = searchQuery.value.toLowerCase()
  searchResults.value = productStore.products.filter(product => 
    product.name.toLowerCase().includes(query) || 
    product.description.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  )
  
  showSearchResults.value = true
  
  if (searchResults.value.length === 0) {
    toast.info(`No products found matching "${searchQuery.value}"`)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  showSearchResults.value = false
  searchResults.value = []
}

const showProductDetails = (product) => {
  selectedProduct.value = product
}

const addToCart = (product) => {
  cartStore.addToCart(product)
  toast.success(`${product.name} added to cart!`)
}

const handleLogout = () => {
  authStore.logout()
  toast.info('Logged out successfully')
  router.push('/login')
  isMenuOpen.value = false
  clearSearch()
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>