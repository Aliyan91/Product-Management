<template>
  <div class="container mx-auto px-4 py-8">
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

    <!-- Hot Selling Products Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-300 mb-4">Trending Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="product in hotSellingProducts" 
          :key="product.id" 
          class="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col cursor-pointer"
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
              @click.stop="handleAddToCart(product)" 
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details Modal -->
    <ProductDetails 
      v-if="selectedProduct" 
      :product="selectedProduct" 
      @close="selectedProduct = null" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '@/store/products'
import { useCartStore } from '@/store/cart'
import { useToast } from 'vue-toastification'
import ProductDetails from '@/components/ProductDetails.vue'
import { useAuthStore } from '@/store/auth'

const store = useProductStore()
const cartStore = useCartStore()
const toast = useToast()
const authStore = useAuthStore()
const selectedProduct = ref(null)

// Category filtering
const selectedCategory = ref('all')
const categories = computed(() => store.getAllCategories)

// Products
const hotSellingProducts = computed(() => store.getHotSellingProducts)
const filteredProducts = computed(() => store.getProductsByCategory(selectedCategory.value))

// Statistics
const totalSales = computed(() => 
  hotSellingProducts.value.reduce((sum, product) => sum + product.soldCount, 0)
)

const averagePrice = computed(() => {
  const total = hotSellingProducts.value.reduce((sum, product) => sum + product.price, 0)
  return total / hotSellingProducts.value.length || 0
})

// Cart functionality
const handleAddToCart = (product) => {
  if (!authStore.isAuthenticated) {
    toast.warning('PLEASE LOGIN TO CONTINUE SHOPPING')
    return
  }
  cartStore.addToCart(product)
  toast.success(`${product.name} added to cart!`)
}

// Product details functionality
const showProductDetails = (product) => {
  selectedProduct.value = product
}
</script>