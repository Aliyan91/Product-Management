<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header with Gradient -->
    <div class="mb-8 rounded-lg overflow-hidden shadow-2xl">
      <div class="bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 p-8 relative">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative z-10 flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold text-white mb-2">Your Shopping Cart</h1>
            <p class="text-white text-lg opacity-90 max-w-2xl">
              Review your items and proceed to checkout
            </p>
          </div>
          <div class="hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Cart State -->
    <div v-if="!cartStore.items.length" class="bg-gray-800 rounded-lg p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h2 class="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
      <p class="text-gray-400 mb-6">Looks like you haven't added any items to your cart yet</p>
      <RouterLink 
        to="/products" 
        class="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300"
      >
        Continue Shopping
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </RouterLink>
    </div>
      
    <!-- Cart Items -->
    <div v-else class="space-y-6">
      <!-- Cart Items List -->
      <div class="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div class="p-6">
          <div v-for="item in cartStore.items" 
               :key="item.id" 
               class="flex flex-col md:flex-row md:items-center md:justify-between py-6 border-b border-gray-700 last:border-b-0 gap-4">
            <!-- Product Info -->
            <div class="flex items-center space-x-4">
              <img :src="item.picture" :alt="item.name" class="w-24 h-24 object-cover rounded-lg">
              <div>
                <h3 class="text-xl font-medium text-white">{{ item.name }}</h3>
                <p class="text-gray-400">Category: {{ item.category }}</p>
                <p class="text-lg font-semibold text-green-500">${{ item.price.toFixed(2) }}</p>
              </div>
            </div>
              
            <!-- Quantity Controls and Remove -->
            <div class="flex items-center space-x-6">
              <div class="flex items-center bg-gray-700 rounded-lg">
                <button 
                  @click="updateQuantity(item.id, Math.max(1, item.quantity - 1))"
                  class="p-2 hover:bg-gray-600 rounded-l-lg transition-colors duration-200"
                >
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                  </svg>
                </button>
                  
                <span class="w-12 text-center text-white font-medium">{{ item.quantity }}</span>
                  
                <button 
                  @click="updateQuantity(item.id, item.quantity + 1)"
                  class="p-2 hover:bg-gray-600 rounded-r-lg transition-colors duration-200"
                >
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </button>
              </div>
                
              <button 
                @click="removeFromCart(item.id)"
                class="flex items-center text-red-500 hover:text-red-400 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="bg-gray-800 rounded-lg shadow-xl p-6">
        <div class="space-y-4">
          <div class="flex justify-between text-lg text-gray-400">
            <span>Subtotal</span>
            <span>${{ cartStore.cartTotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-lg text-gray-400">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div class="border-t border-gray-700 pt-4">
            <div class="flex justify-between text-xl font-bold text-white">
              <span>Total</span>
              <span>${{ cartStore.cartTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <button 
          @click="clearCart"
          class="w-full sm:w-auto px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear Cart
        </button>

        <button 
          @click="proceedToCheckout"
          class="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
        >
          Proceed to Checkout
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

const removeFromCart = (productId) => {
  cartStore.removeFromCart(productId)
  toast.success('Item removed from cart')
}

const updateQuantity = (productId, quantity) => {
  if (quantity === 0) {
    cartStore.removeFromCart(productId)
    toast.success('Item removed from cart')
  } else {
    cartStore.updateQuantity(productId, quantity)
    toast.success('Quantity updated')
  }
}

const clearCart = () => {
  cartStore.clearCart()
  toast.success('Cart cleared')
}

const proceedToCheckout = () => {
  // Create new order object
  const order = {
    id: `ORD${Date.now()}`,
    date: new Date(),
    status: 'Processing',
    items: cartStore.items.map(item => ({
      ...item,
      orderPrice: item.price // Store the price at time of purchase
    })),
    total: cartStore.cartTotal
  }

  // Add order to user's history
  authStore.addOrder(order)
  
  // Clear the cart
  cartStore.clearCart()
  
  // Show success message
  toast.success('Order placed successfully! 🎉')
  
  // Redirect to account page
  router.push('/account')
}
</script>
