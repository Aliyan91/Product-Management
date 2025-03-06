<template>
  <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" @click.self="closeModal">
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div v-if="product" class="flex flex-col md:flex-row">
        <!-- Product Image -->
        <div class="md:w-1/2 p-6">
          <img :src="product.picture" :alt="product.name" class="w-full h-auto object-cover rounded-lg shadow-md">
        </div>
        
        <!-- Product Details -->
        <div class="md:w-1/2 p-6 flex flex-col">
          <div class="flex justify-between items-start">
            <h2 class="text-3xl font-bold text-white mb-2">{{ product.name }}</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="bg-gray-700 rounded-lg px-4 py-2 mb-4 inline-block">
            <span class="text-gray-300">Category: </span>
            <span class="text-white font-medium">{{ product.category }}</span>
          </div>
          
          <p class="text-gray-300 mb-6 flex-grow">{{ product.description }}</p>
          
          <div class="mb-6">
            <div class="flex items-center mb-2">
              <span class="text-3xl font-bold text-green-500">${{ product.price.toFixed(2) }}</span>
              <span v-if="product.isHotSelling" class="ml-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Hot Selling</span>
            </div>
            <div v-if="product.soldCount" class="text-gray-400 text-sm">
              {{ product.soldCount }}+ people purchased this product
            </div>
          </div>
          
          <div class="flex space-x-4">
            <button 
              @click="addToCart(product)" 
              class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useCartStore } from '@/store/cart';
import { useToast } from 'vue-toastification';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);
const cartStore = useCartStore();
const toast = useToast();

const closeModal = () => {
  emit('close');
};

const addToCart = (product) => {
  cartStore.addToCart(product);
  toast.success(`${product.name} added to cart!`);
};
</script>
