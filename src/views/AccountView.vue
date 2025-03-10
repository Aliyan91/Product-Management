<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header with Gradient -->
    <div class="mb-8 rounded-lg overflow-hidden shadow-2xl">
      <div class="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 relative">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative z-10 flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold text-white mb-2">My Account</h1>
            <p class="text-white text-lg opacity-90 max-w-2xl">
              View your order history and account details
            </p>
          </div>
          <div class="hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Details -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-gray-800 rounded-lg shadow-xl p-6">
          <div class="flex items-center space-x-4 mb-6">
            <div class="bg-indigo-600 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ authStore.user?.email }}</h2>
              <p class="text-gray-400">Member since {{ memberSince }}</p>
            </div>
          </div>
          <nav class="space-y-2">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="currentTab = tab.id"
              :class="[
                'w-full text-left px-4 py-2 rounded-lg transition-colors duration-200',
                currentTab === tab.id 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-700'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-3">
        <!-- Order History -->
        <div v-if="currentTab === 'orders'" class="bg-gray-800 rounded-lg shadow-xl">
          <div class="p-6">
            <h2 class="text-2xl font-bold text-white mb-6">Order History</h2>
            <div v-if="authStore.orderHistory.length === 0" class="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-gray-400">No orders yet</p>
              <RouterLink 
                to="/products"
                class="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Start Shopping
              </RouterLink>
            </div>
            <div v-else class="space-y-4">
              <div v-for="order in authStore.orderHistory" 
                   :key="order.id" 
                   class="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors duration-200"
              >
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-white font-medium">Order #{{ order.id }}</h3>
                    <p class="text-gray-400">{{ formatDate(order.date) }}</p>
                  </div>
                  <span :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getStatusClass(order.status)
                  ]">
                    {{ order.status }}
                  </span>
                </div>
                
                <!-- Order Items -->
                <div class="space-y-3">
                  <div v-for="item in order.items" 
                       :key="item.id" 
                       class="flex justify-between items-center bg-gray-800 rounded-lg p-3"
                  >
                    <div class="flex items-center space-x-3">
                      <img :src="item.picture" 
                           :alt="item.name" 
                           class="w-16 h-16 rounded-lg object-cover"
                      >
                      <div>
                        <p class="text-white font-medium">{{ item.name }}</p>
                        <p class="text-gray-400">Qty: {{ item.quantity }}</p>
                        <p class="text-gray-400">${{ item.price.toFixed(2) }} each</p>
                      </div>
                    </div>
                    <p class="text-white font-medium">
                      ${{ (item.price * item.quantity).toFixed(2) }}
                    </p>
                  </div>
                </div>
                
                <!-- Order Total -->
                <div class="mt-4 pt-4 border-t border-gray-600 flex justify-between items-center">
                  <span class="text-gray-400">Order Total</span>
                  <span class="text-white font-bold">${{ order.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Settings -->
        <div v-if="currentTab === 'profile'" class="bg-gray-800 rounded-lg shadow-xl p-6">
          <h2 class="text-2xl font-bold text-white mb-6">Profile Settings</h2>
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div>
              <label class="block text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                v-model="profileForm.email" 
                class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
            </div>
            <div>
              <label class="block text-gray-400 mb-2">Name</label>
              <input 
                type="text" 
                v-model="profileForm.name" 
                class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
            </div>
            <button 
              type="submit"
              class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useToast } from 'vue-toastification'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const toast = useToast()

const currentTab = ref('orders')
const tabs = [
  { id: 'orders', name: 'Order History' },
  { id: 'profile', name: 'Profile Settings' }
]

const profileForm = ref({
  email: authStore.user?.email || '',
  name: authStore.user?.name || ''
})

const memberSince = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  })
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-500/20 text-green-500'
    case 'Processing':
      return 'bg-yellow-500/20 text-yellow-500'
    case 'Cancelled':
      return 'bg-red-500/20 text-red-500'
    default:
      return 'bg-gray-500/20 text-gray-500'
  }
}

const updateProfile = () => {
  // Implement profile update logic here
  toast.success('Profile updated successfully!')
}
</script> 