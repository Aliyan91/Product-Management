<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="product" class="bg-gray-800 rounded-lg shadow-xl">
      <!-- Breadcrumb Navigation -->
      <div class="p-4 border-b border-gray-700">
        <div class="flex items-center text-sm text-gray-400">
          <RouterLink to="/" class="hover:text-white">Home</RouterLink>
          <span class="mx-2">›</span>
          <RouterLink :to="{ name: 'products', query: { category: product.category }}" class="hover:text-white">
            {{ product.category }}
          </RouterLink>
          <span class="mx-2">›</span>
          <span class="text-white">{{ product.name }}</span>
        </div>
      </div>

      <!-- Product Content -->
      <div class="flex flex-col lg:flex-row">
        <!-- Product Image -->
        <div class="lg:w-2/5 p-6">
          <img :src="product.picture" :alt="product.name" class="w-full h-auto object-cover rounded-lg shadow-md">
        </div>
        
        <!-- Product Details -->
        <div class="lg:w-3/5 p-6">
          <h1 class="text-3xl font-bold text-white mb-2">{{ product.name }}</h1>
          
          <div class="bg-gray-700 rounded-lg px-4 py-2 mb-4 inline-block">
            <span class="text-gray-300">Category: </span>
            <span class="text-white font-medium">{{ product.category }}</span>
          </div>
          
          <div class="mb-6">
            <div class="flex items-center mb-2">
              <span class="text-3xl font-bold text-green-500">${{ product.price.toFixed(2) }}</span>
              <span v-if="product.isHotSelling" class="ml-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Hot Selling</span>
            </div>
            <div v-if="product.soldCount" class="text-gray-400 text-sm">
              {{ product.soldCount }}+ people purchased this product
            </div>
          </div>
          
          <!-- Quantity Selector -->
          <div class="mb-6">
            <label class="block text-white mb-2">Quantity:</label>
            <div class="flex items-center">
              <button 
                @click="decreaseQuantity" 
                class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-l-md"
                :disabled="quantity <= 1"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                </svg>
              </button>
              
              <input 
                type="number" 
                v-model="quantity" 
                min="1" 
                class="w-16 bg-gray-700 text-white text-center py-2 border-x-0 border-gray-600 focus:outline-none"
              >
              
              <button 
                @click="increaseQuantity" 
                class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-r-md"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Add to Cart Button -->
          <button 
            @click="addToCart()" 
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center mb-6"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
      
      <!-- About This Product Section -->
      <div class="p-6 border-t border-gray-700">
        <h2 class="text-2xl font-bold text-white mb-4">About This Product</h2>
        <div class="text-gray-300 space-y-4">
          <p>{{ product.description }}</p>
          
          <!-- Additional product details can be added here -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div class="bg-gray-700 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-white mb-2">Key Features</h3>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>High-quality product</li>
                <li>Durable construction</li>
                <li>Easy to use</li>
                <li>Modern design</li>
              </ul>
            </div>
            
            <div class="bg-gray-700 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-white mb-2">Specifications</h3>
              <div class="grid grid-cols-2 gap-2">
                <div class="text-gray-400">Brand:</div>
                <div class="text-white">Premium Brand</div>
                
                <div class="text-gray-400">Model:</div>
                <div class="text-white">{{ product.name }}</div>
                
                <div class="text-gray-400">Category:</div>
                <div class="text-white">{{ product.category }}</div>
                
                <div class="text-gray-400">Warranty:</div>
                <div class="text-white">1 Year</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Related Products Section -->
      <div class="p-6 border-t border-gray-700">
        <h2 class="text-2xl font-bold text-white mb-4">You May Also Like</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id" 
            class="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
            @click="navigateToProduct(relatedProduct.id)"
          >
            <img :src="relatedProduct.picture" :alt="relatedProduct.name" class="w-full h-48 object-cover">
            <div class="p-4 flex-grow">
              <h3 class="text-xl font-semibold text-white mb-2">{{ relatedProduct.name }}</h3>
              <p class="text-gray-400 mb-2 line-clamp-2">{{ relatedProduct.description }}</p>
              <p class="text-green-500 font-bold text-lg">${{ relatedProduct.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading or Not Found States -->
    <div v-else-if="loading" class="flex justify-center items-center h-64">
      <div class="text-white text-xl">Loading product details...</div>
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <div class="text-white text-xl">Product not found</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/store/products';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const toast = useToast();

const loading = ref(true);
const quantity = ref(1);

// Get product ID from route params
const productId = computed(() => parseInt(route.params.id));

// Get the product details
const product = computed(() => {
  const foundProduct = productStore.products.find(p => p.id === productId.value);
  loading.value = false;
  return foundProduct;
});

// Get related products (same category, excluding current product)
const relatedProducts = computed(() => {
  if (!product.value) return [];
  
  return productStore.products
    .filter(p => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 4);
});

// Quantity methods
const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// Add to cart with selected quantity
const addToCart = () => {
  if (!authStore.isAuthenticated) {
    toast.warning('Please login to continue shopping');
    router.push('/login');
    return;
  }
  
  // Add product to cart with the selected quantity
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addToCart(product.value);
  }
  
  toast.success(`${quantity.value} ${product.value.name}${quantity.value > 1 ? 's' : ''} added to cart!`);
};

// Navigate to another product detail page
const navigateToProduct = (id) => {
  router.push({ name: 'product-detail', params: { id } });
};

onMounted(() => {
  // Scroll to top when component mounts
  window.scrollTo(0, 0);
});
</script> 