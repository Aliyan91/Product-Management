<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header Section -->
    <div class="w-full px-6 py-8 bg-gray-800">
      <div class="max-w-7xl mx-auto">
        <div class="sm:flex sm:items-center">
          <div>
            <h1 class="text-3xl font-bold text-white">Product Dashboard</h1>
            <p class="mt-2 text-sm text-gray-400">
              Overview of all available products
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-white">Loading...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center h-64">
      <div class="text-red-500">{{ error }}</div>
    </div>

    <!-- Products Grid -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-200 flex flex-col"
        >
          <div class="aspect-w-16 aspect-h-9">
            <img
              :src="product.picture || 'https://placehold.co/600x400?text=Product+Image'"
              :alt="product.name"
              class="w-full h-48 object-cover"
            />
          </div>
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="text-xl font-semibold text-white mb-2">{{ product.name }}</h3>
            <p class="text-gray-400 mb-4">{{ product.description }}</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-2xl font-bold text-indigo-400">${{ product.price }}</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock
              </span>
            </div>
          </div>
          <button
            @click="addToCart(product)"
            class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useCartStore } from '@/store/cart';

const products = ref([]);
const loading = ref(false);
const error = ref(null);
const cartStore = useCartStore();

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('/goods');
    products.value = response.data;
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = 'Failed to load products';
  } finally {
    loading.value = false;
  }
};

const addToCart = (product) => {
  cartStore.addToCart(product);
};

onMounted(() => {
  fetchProducts();
});
</script>