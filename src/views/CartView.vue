<template>
  <div class="min-h-screen bg-gray-900">
    <div class="w-full px-6 py-8 bg-gray-800">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-white">Shopping Cart</h1>
        <p class="mt-2 text-sm text-gray-400">
          Review and manage your cart items
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="!cartStore.items.length" class="text-center text-gray-400">
        Your cart is empty
      </div>
      
      <div v-else>
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <div v-for="item in cartStore.items" :key="item.id" class="flex items-center justify-between py-4 border-b border-gray-700">
              <div class="flex items-center space-x-4">
                <img :src="item.picture" :alt="item.name" class="w-16 h-16 object-cover rounded">
                <div>
                  <h3 class="text-lg font-medium text-white">{{ item.name }}</h3>
                  <p class="text-sm text-gray-400">${{ item.price }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="updateQuantity(item.id, Math.max(0, item.quantity - 1))"
                    class="p-1 rounded-full hover:bg-gray-700"
                  >
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                  </button>
                  
                  <span class="text-white">{{ item.quantity }}</span>
                  
                  <button 
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    class="p-1 rounded-full hover:bg-gray-700"
                  >
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </button>
                </div>
                
                <button 
                  @click="removeFromCart(item.id)"
                  class="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
            
            <div class="mt-6 flex justify-between items-center">
              <div class="text-lg text-white">
                Total: <span class="font-bold">${{ cartStore.cartTotal.toFixed(2) }}</span>
              </div>
              
              <button 
                @click="clearCart"
                class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/store/cart'

const cartStore = useCartStore()

const removeFromCart = (productId) => {
  cartStore.removeFromCart(productId)
}

const updateQuantity = (productId, quantity) => {
  if (quantity === 0) {
    cartStore.removeFromCart(productId)
  } else {
    cartStore.updateQuantity(productId, quantity)
  }
}

const clearCart = () => {
  cartStore.clearCart()
}
</script>
