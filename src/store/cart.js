import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    orders: []
  }),
  persist: true,
  getters: {
    cartTotal: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },
    cartCount: (state) => {
      return state.items.reduce((count, item) => count + item.quantity, 0)
    }
  },
  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          ...product,
          quantity: 1
        })
      }
    },
    removeFromCart(productId) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
      }
    },
    clearCart() {
      this.items = []
    },
    checkout() {
      const order = {
        id: `ORD${Date.now()}`,
        date: new Date(),
        status: 'Processing',
        items: [...this.items],
        total: this.cartTotal
      }
      
      this.orders.push(order)
      this.clearCart()
      return order
    }
  }
})
