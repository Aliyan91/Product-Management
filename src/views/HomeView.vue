<template>
  <div>
    <!-- Top Navigation Bar -->
    <nav class="bg-gray-800 shadow-lg mb-6">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Left side - Logo/Brand -->
          <div class="flex items-center">
            <h1 class="text-white text-xl font-bold">ShopCart</h1>
          </div>

          <!-- Right side - Admin Login -->
          <div class="flex items-center">
            <button @click="goToAdminLogin"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container mx-auto px-4">
      <!-- New Beautiful Header with Gradient -->
      <div class="mb-8 rounded-lg overflow-hidden shadow-2xl">
        <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 relative">
          <div class="absolute inset-0 bg-black opacity-20"></div>
          <div class="relative z-10">
            <h1 class="text-4xl font-bold text-white mb-2">Welcome to ShopCart</h1>
            <p class="text-white text-lg opacity-90 max-w-2xl">
              Discover the latest products and best deals all in one place.
              Your one-stop destination for all your shopping needs.
            </p>
          </div>
        </div>
      </div>

      <!-- Phones Section -->
      <div v-if="hasProducts" class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">Phones</h2>
          <RouterLink :to="{ name: 'products', query: { category: 'Phones' } }"
            class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            View All →
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="product in phoneProducts" :key="product.id"
            class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col cursor-pointer"
            @click="showProductDetails(product)">
            <img :src="product.picture" :alt="product.name" class="w-full h-48 object-cover">
            <div class="p-4 flex-grow">
              <h3 class="text-xl font-semibold text-white mb-2">{{ product.name }}</h3>
              <p class="text-gray-400 mb-2 line-clamp-2">{{ product.description }}</p>
              <p class="text-green-500 font-bold text-lg mb-4">${{ product.price.toFixed(2) }}</p>
            </div>
            <div class="p-4 pt-0">
              <button @click.stop="handleAddToCart(product)"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <!-- Product Details Modal -->
        <ProductDetails v-if="selectedProduct" :product="selectedProduct" @close="selectedProduct = null" />
      </div>
      <div v-else class="text-center py-8">
        <div class="text-white text-xl">Loading products...</div>
      </div>

      <!-- Laptops Section -->
      <div v-if="hasProducts" class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">Laptops</h2>
          <RouterLink :to="{ name: 'products', query: { category: 'Laptops' } }"
            class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            View All →
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="product in laptopProducts" :key="product.id"
            class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col cursor-pointer"
            @click="showProductDetails(product)">
            <img :src="product.picture" :alt="product.name" class="w-full h-48 object-cover">
            <div class="p-4 flex-grow">
              <h3 class="text-xl font-semibold text-white mb-2">{{ product.name }}</h3>
              <p class="text-gray-400 mb-2 line-clamp-2">{{ product.description }}</p>
              <p class="text-green-500 font-bold text-lg mb-4">${{ product.price.toFixed(2) }}</p>
            </div>
            <div class="p-4 pt-0">
              <button @click.stop="handleAddToCart(product)"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <div class="text-white text-xl">Loading products...</div>
      </div>

      <!-- Home Appliances Section -->
      <div v-if="hasProducts" class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">Home Appliances</h2>
          <RouterLink :to="{ name: 'products', query: { category: 'Home Appliances' } }"
            class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            View All →
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="product in tvProducts" :key="product.id"
            class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col cursor-pointer"
            @click="showProductDetails(product)">
            <img :src="product.picture" :alt="product.name" class="w-full h-48 object-cover">
            <div class="p-4 flex-grow">
              <h3 class="text-xl font-semibold text-white mb-2">{{ product.name }}</h3>
              <p class="text-gray-400 mb-2 line-clamp-2">{{ product.description }}</p>
              <p class="text-green-500 font-bold text-lg mb-4">${{ product.price.toFixed(2) }}</p>
            </div>
            <div class="p-4 pt-0">
              <button @click.stop="handleAddToCart(product)"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <div class="text-white text-xl">Loading products...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '@/store/products'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'

const productStore = useProductStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

// Updated computed properties to show only 4 items
const phoneProducts = computed(() => {
  return productStore.products
    .filter(product => product.category === 'Phones')
    .slice(0, 4) // Only take the first 4 items
})

const laptopProducts = computed(() => {
  return productStore.products
    .filter(product => product.category === 'Laptops')
    .slice(0, 4) // Only take the first 4 items
})

const tvProducts = computed(() => {
  return productStore.products
    .filter(product => product.category === 'Home Appliances')
    .slice(0, 4) // Only take the first 4 items
})

const hasProducts = computed(() => {
  return productStore.products && productStore.products.length > 0;
});

const showProductDetails = (product) => {
  router.push({ name: 'product-detail', params: { id: product.id } })
}

const handleAddToCart = (product) => {
  if (!authStore.isAuthenticated) {
    toast.warning('PLEASE LOGIN TO CONTINUE SHOPPING')
    return
  }
  cartStore.addToCart(product)
  toast.success(`${product.name} added to cart!`)
}
</script>
