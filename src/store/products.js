import { defineStore } from 'pinia'

// Simple ID generation function
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [
      // Phones
      {
        id: 1,
        name: 'iPhone 14 Pro',
        description: 'Latest iPhone with A16 Bionic chip, 48MP camera system, and Dynamic Island',
        price: 999.99,
        category: 'Phones',
        picture: 'https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg',
        isHotSelling: true,
        soldCount: 150
      },
      {
        id: 2,
        name: 'Samsung Galaxy S23 Ultra',
        description: '200MP camera, S Pen functionality, and powerful Snapdragon processor',
        price: 1199.99,
        category: 'Phones',
        picture: 'https://inovi.pk/wp-content/uploads/2023/11/Samsung-S23-Ultra-600x600.jpg',
        isHotSelling: true,
        soldCount: 120
      },
      {
        id: 3,
        name: 'Google Pixel 7 Pro',
        description: 'Advanced AI photography, clean Android experience, and Tensor G2 chip',
        price: 899.99,
        category: 'Phones',
        picture: 'https://www.droid-life.com/wp-content/uploads/2022/09/Pixel-7-Pro-Black-980x642.jpg'
      },
      {
        id: 4,
        name: 'OnePlus 11',
        description: 'Hasselblad camera system, fast charging, and smooth performance',
        price: 699.99,
        category: 'Phones',
        picture: 'https://img.cdndtl.co.uk/q6b740ajikod/4TUFVP9Qxc1NSIHsJeppqK/d522a4bade21e4acf693a7abe3acfa31/OnePlus_11_2.jpg?h=700&fit=fill&bg=fff&auto=format&s=aee84c137537b63329b062b2f318a2c3'
      },

      // Laptops
      {
        id: 5,
        name: 'MacBook Pro 16"',
        description: 'M2 Pro chip, up to 22 hours battery life, and stunning Liquid Retina XDR display',
        price: 2499.99,
        category: 'Laptops',
        picture: 'https://intaglaptops.com/cdn/shop/files/s-l1600.webp?v=1730468299',
        isHotSelling: true,
        soldCount: 85
      },
      {
        id: 6,
        name: 'Dell XPS 15',
        description: 'Intel Core i9, RTX 4070, and InfinityEdge display',
        price: 2199.99,
        category: 'Laptops',
        picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMT-uJkAwCDlp2dt-fX6ScQjjVIdgCmKnUzw&s'
      },
      {
        id: 7,
        name: 'Lenovo ThinkPad X1 Carbon',
        description: 'Business laptop with legendary reliability and performance',
        price: 1799.99,
        category: 'Laptops',
        picture: 'https://wajiz.pk/wp-content/uploads/2024/04/L-X1-CARBON.2.jpg'
      },
      {
        id: 8,
        name: 'ASUS ROG Zephyrus',
        description: 'Gaming powerhouse with RTX 4080 and AMD Ryzen 9',
        price: 2299.99,
        category: 'Laptops',
        picture: 'https://m.media-amazon.com/images/I/61PouaE9IaL._AC_SL1500_.jpg'
      },

      // Audio
      {
        id: 9,
        name: 'AirPods Pro 2',
        description: 'Active noise cancellation, spatial audio, and adaptive transparency',
        price: 249.99,
        category: 'Audio',
        picture: 'https://pctech.pk/cdn/shop/files/62_3e239595-8b2d-4078-b424-0884a82068d6.png?v=1723212590',
        isHotSelling: true,
        soldCount: 200
      },
      {
        id: 10,
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise cancellation and exceptional sound quality',
        price: 399.99,
        category: 'Audio',
        picture: 'https://static3.webx.pk/files/19643/Images/sony-wh-1000xm5-silver-headphones-price-in-pakistan-19643-2088078-220524100332877.jpg'
      },

      // Tablets
      {
        id: 11,
        name: 'iPad Pro 12.9"',
        description: 'M2 chip, Liquid Retina XDR display, and Apple Pencil support',
        price: 1099.99,
        category: 'Tablets',
        isHotSelling: true,
        picture: 'https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/1/6/16567278-myshop-pk-1.jpg'
      },
      {
        id: 12,
        name: 'Samsung Galaxy Tab S9 Ultra',
        description: 'Large AMOLED display, S Pen included, and DeX productivity',
        price: 1199.99,
        category: 'Tablets',
        picture: 'https://www.climaxcomputer.com/wp-content/uploads/2023/12/1.webp'
      },

      // Smartwatches
      {
        id: 13,
        name: 'Apple Watch Series 8',
        description: 'Advanced health monitoring and cellular connectivity',
        price: 399.99,
        category: 'Wearables',
        isHotSelling: true,
        picture: 'https://allmytech.pk/wp-content/uploads/2022/09/apple-watch-series-8-midnight-color.jpg'
      },
      {
        id: 14,
        name: 'Samsung Galaxy Watch 6',
        description: 'Comprehensive health tracking and Wear OS integration',
        price: 299.99,
        category: 'Wearables',
        picture: 'https://xcessorieshub.com/wp-content/uploads/2023/07/Samsung-Galaxy-Watch-6-40mm-1.webp'
      },

      // Gaming
      {
        id: 15,
        name: 'PlayStation 5',
        description: 'Next-gen gaming with ray tracing and DualSense controller',
        price: 499.99,
        category: 'Gaming',
        picture: 'https://gameforce.pk/wp-content/uploads/2024/02/playstation-5.webp',
        isHotSelling: true,
        soldCount: 175
      },
      {
        id: 16,
        name: 'Xbox Series X',
        description: 'True 4K gaming and Quick Resume feature',
        price: 499.99,
        category: 'Gaming',
        picture: 'https://media.wired.com/photos/5fa5dc3dba670daaf8e97a8d/master/pass/games_gear_series-x.jpg'
      },

      // Cameras
      {
        id: 17,
        name: 'Sony A7 IV',
        description: '33MP full-frame sensor and advanced autofocus',
        price: 2499.99,
        category: 'Cameras',
        picture: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Sony_A7_IV_%28ILCE-7M4%29_-_by_Henry_S%C3%B6derlund_%2851739988735%29.jpg'
      },
      {
        id: 18,
        name: 'Canon EOS R6',
        description: '20MP full-frame sensor and 8-stop stabilization',
        price: 2299.99,
        category: 'Cameras',
        isHotSelling: true,
        picture: 'https://2.img-dpreview.com/files/p/E~TC4x3S590x0~articles/1548544834/body/Canon-EOS-R6-lead-01.jpeg'
      },

      // TV & Home Theater
      {
        id: 19,
        name: 'LG C2 65" OLED TV',
        description: 'Perfect blacks and G-SYNC for gaming',
        price: 1799.99,
        category: 'TV & Home Theater',
        picture: 'https://www.lg.com/us/images/TV/features/OLED2022/PDP_TV-OLED-C2_Desktop_02-Intro.jpg'
      },
      {
        id: 20,
        name: 'Sonos Arc',
        description: 'Premium soundbar with Dolby Atmos',
        price: 899.99,
        category: 'TV & Home Theater',
        picture: 'https://media.wired.com/photos/5eb1b1ea77d77c55bc73b2af/master/w_2400,h_1800,c_limit/Gear-SonosArcWithStandingTV.jpg'
      }
    ],
    categories: [
      'Phones',
      'Laptops',
      'Audio',
      'Tablets',
      'Wearables',
      'Gaming',
      'Cameras',
      'TV & Home Theater'
    ]
  }),

  getters: {
    getAllProducts: (state) => state.products,
    getProductsByCategory: (state) => (category) => {
      if (category === 'all') {
        return state.products
      }
      return state.products.filter(product => product.category === category)
    },
    getAllCategories: (state) => state.categories,
    getHotSellingProducts: (state) => {
      return state.products
        .filter(product => product.isHotSelling)
        .sort((a, b) => b.soldCount - a.soldCount)
    }
  },

  actions: {
    // Load products from localStorage
    loadProductsFromStorage() {
      const storedProducts = localStorage.getItem('products')
      if (storedProducts) {
        this.products = JSON.parse(storedProducts)
      }
    },
    
    // Save products to localStorage
    saveProductsToStorage() {
      localStorage.setItem('products', JSON.stringify(this.products))
    },

    addProduct(product) {
      const newProduct = {
        ...product,
        id: generateId(),
        soldCount: 0,
        viewCount: 0,
        createdAt: new Date().toISOString()
      }
      this.products.push(newProduct)
      this.saveProductsToStorage()
    },

    updateProduct(updatedProduct) {
      const index = this.products.findIndex(p => p.id === updatedProduct.id)
      if (index !== -1) {
        this.products[index] = {
          ...this.products[index],
          ...updatedProduct,
          updatedAt: new Date().toISOString()
        }
        this.saveProductsToStorage()
      }
    },

    deleteProduct(id) {
      this.products = this.products.filter(product => product.id !== id)
      this.saveProductsToStorage()
    },

    // Clear all products
    clearAllProducts() {
      this.products = []
      this.saveProductsToStorage()
    }
  }
})
