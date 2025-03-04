<template>
  <div class="min-h-screen bg-gray-900">
    <div class="w-full px-6 py-8 bg-gray-800">
      <div class="max-w-7xl mx-auto">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">Dashboard</h1>
            <p class="mt-2 text-sm text-gray-400">
              View your product inventory with ease
            </p>
          </div>
          
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-200"
        >
          <div class="aspect-w-16 aspect-h-9">
            <img
              :src="product.image || 'https://placehold.co/600x400?text=Product+Image'"
              :alt="product.name"
              class="w-full h-48 object-cover"
            />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-white mb-2">{{ product.name }}</h3>
            <p class="text-gray-400 mb-4">{{ product.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-indigo-400">${{ product.price }}</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Local state for products
const products = ref([
  {
    id: 1,
    name: 'Sample Product 1',
    description: 'This is a sample product description.',
    price: 99.99,
    image: 'https://placehold.co/600x400?text=Product+1'
  },
  {
    id: 2,
    name: 'Sample Product 2',
    description: 'This is another sample product description.',
    price: 49.99,
    image: 'https://placehold.co/600x400?text=Product+2'
  },
  {
    id: 3,
    name: 'Sample Product 3',
    description: 'This is yet another sample product description.',
    price: 29.99,
    image: 'https://placehold.co/600x400?text=Product+3'
  },
  // Add more sample products as needed
]);
</script>

<style scoped>
/* Add any additional styles here */
</style>