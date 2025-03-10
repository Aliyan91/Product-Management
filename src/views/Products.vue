<template>
  <div class="container mx-auto px-4 py-8">
    <!-- New Beautiful Header with Gradient -->
    <div class="mb-8 rounded-lg overflow-hidden shadow-2xl">
      <div class="bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 p-8 relative">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative z-10 flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold text-white mb-2">Our Products</h1>
            <p class="text-white text-lg opacity-90 max-w-2xl">
              Browse our extensive collection of high-quality products.
              Find exactly what you need at the best prices.
            </p>
          </div>
          <div class="hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

   

    <!-- Sorting and Category Options -->
    <div class="mb-6 flex items-center space-x-4">
      <div class="flex items-center">
        <label class="text-white mr-2">Category:</label>
        <select v-model="selectedCategory" @change="sortProducts" class="bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">All Categories</option>
          <option v-for="category in productStore.categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <div class="flex items-center">
        <label class="text-white mr-2">Sort by:</label>
        <select v-model="sortOption" @change="sortProducts" class="bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="default">Default</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="sales">Sales</option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div 
        v-for="product in sortedProducts" 
        :key="product.id" 
        class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
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

    <!-- Product Details Modal -->
    <ProductDetails 
      v-if="selectedProduct" 
      :product="selectedProduct" 
      @close="selectedProduct = null" 
    />

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div class="relative inline-block align-bottom bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-300">Product Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  required
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  required
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              <div>
                <label for="price" class="block text-sm font-medium text-gray-300">Price</label>
                <input
                  type="number"
                  id="price"
                  v-model="formData.price"
                  required
                  step="0.01"
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label for="category" class="block text-sm font-medium text-gray-300">Category</label>
                <select
                  id="category"
                  v-model="formData.category"
                  required
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a category</option>
                  <option v-for="category in productStore.categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>

              <div>
                <label for="picture" class="block text-sm font-medium text-gray-300">Image URL</label>
                <input
                  type="text"
                  id="picture"
                  v-model="formData.picture"
                  class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                {{ editingProduct ? 'Update' : 'Save' }} Product
              </button>
              <button
                type="button"
                @click="closeModal"
                class="mt-3 sm:mt-0 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useProductStore } from '@/store/products';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { useRouter, useRoute } from 'vue-router';
import ProductDetails from '@/components/ProductDetails.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const productStore = useProductStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const showAddModal = ref(false);
const editingProduct = ref(null);
const selectedCategory = ref('all');
const selectedProduct = ref(null);
const sortOption = ref('default');
const selectedPriceRange = ref('all');
const customPriceRange = ref({
  min: '',
  max: ''
});
const isPriceDropdownOpen = ref(false);

// Watch for route query changes
watch(
  () => route.query.category,
  (newCategory) => {
    if (newCategory) {
      selectedCategory.value = newCategory;
    }
  }
);

// Set initial category from route query
onMounted(() => {
  if (route.query.category) {
    selectedCategory.value = route.query.category;
  }
  document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.relative');
    if (dropdown && !dropdown.contains(e.target)) {
      isPriceDropdownOpen.value = false;
    }
  });
});

const filteredProducts = computed(() => {
  let products = productStore.getProductsByCategory(selectedCategory.value);
  
  // Apply price range filter
  if (selectedPriceRange.value !== 'all') {
    products = products.filter(product => {
      if (selectedPriceRange.value === 'custom') {
        const min = Number(customPriceRange.value.min);
        const max = Number(customPriceRange.value.max);
        return product.price >= min && product.price <= max;
      } else {
        const range = selectedPriceRange.value;
        
        // Handle the "plus" ranges (e.g., "900+")
        if (range.endsWith('+')) {
          const min = Number(range.slice(0, -1));
          return product.price >= min;
        }
        
        // Handle normal ranges (e.g., "300-600")
        const [min, max] = range.split('-').map(Number);
        return product.price >= min && product.price <= max;
      }
    });
  }
  
  return products;
});

const sortedProducts = computed(() => {
  let sorted = [...filteredProducts.value];
  
  switch (sortOption.value) {
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'sales':
      sorted.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      break;
    default:
      break;
  }
  
  return sorted;
});

const formData = ref({
  name: '',
  description: '',
  price: '',
  picture: '',
  category: ''
});

// Add new product
const addProduct = () => {
  productStore.addProduct({
    ...formData.value,
    picture: formData.value.picture || 'https://placehold.co/600x400?text=Product+Image'
  });
  showAddModal.value = false;
  resetForm();
  toast.success("Product added successfully! 🎉");
};

// Edit product
const editProduct = (product) => {
  editingProduct.value = product;
  formData.value = { ...product };
  showAddModal.value = true;
};

// Update product
const updateProduct = () => {
  productStore.updateProduct({
    ...formData.value,
    id: editingProduct.value.id
  });
  showAddModal.value = false;
  resetForm();
  toast.success("Product updated successfully! ✨");
};

// Delete product
const handleDelete = (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    productStore.deleteProduct(id);
    toast.success("Product deleted successfully! 🗑️");
  }
};

// Handle form submission
const handleSubmit = (e) => {
  e.preventDefault();
  if (editingProduct.value) {
    updateProduct();
  } else {
    addProduct();
  }
};

// Reset form
const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    price: '',
    picture: '',
    category: ''
  };
  editingProduct.value = null;
};

// Close modal and reset form
const closeModal = () => {
  showAddModal.value = false;
  resetForm();
};

const handleAddToCart = (product) => {
  if (!authStore.isAuthenticated) {
    toast.warning('PLEASE LOGIN TO CONTINUE SHOPPING');
    return;
  }
  cartStore.addToCart(product);
  toast.success(`${product.name} added to cart!`);
};

const showProductDetails = (product) => {
  router.push({ name: 'product-detail', params: { id: product.id }});
};

const sortProducts = () => {
  // The sorting is handled in the computed property
};

const handlePriceRangeChange = () => {
  if (selectedPriceRange.value !== 'custom') {
    filterProducts();
  }
};

const applyCustomPriceRange = () => {
  if (customPriceRange.value.min === '' || customPriceRange.value.max === '') {
    toast.error('Please enter both minimum and maximum prices');
    return;
  }
  if (Number(customPriceRange.value.min) > Number(customPriceRange.value.max)) {
    toast.error('Minimum price cannot be greater than maximum price');
    return;
  }
  filterProducts();
};

const filterProducts = () => {
  // The filtering is already handled by the computed properties
  // This function is just a trigger for reactivity
  selectedPriceRange.value = selectedPriceRange.value;
};

// Add watch for custom price range changes (optional, for auto-filtering)
watch([() => customPriceRange.value.min, () => customPriceRange.value.max], () => {
  if (selectedPriceRange.value === 'custom' && 
      customPriceRange.value.min !== '' && 
      customPriceRange.value.max !== '') {
    filterProducts();
  }
}, { deep: true });

// Add this watch to reset price range when category changes
watch(
  () => selectedCategory.value,
  (newCategory) => {
    // Reset price range to "all" when category changes
    selectedPriceRange.value = 'all';
    
    // Reset custom price range
    customPriceRange.value = {
      min: '',
      max: ''
    };
  }
);

// Add a new computed property for price ranges based on category
const priceRanges = computed(() => {
  switch (selectedCategory.value) {
    case 'Phones':
      return [
        { value: '300-600', label: '$300 - $600' },
        { value: '600-900', label: '$600 - $900' },
        { value: '900-1500', label: 'Over $900' }
      ];
    case 'Laptops':
      return [
        { value: '500-1000', label: '$500 - $1,000' },
        { value: '1000-1500', label: '$1,000 - $1,500' },
        { value: '1500-2000', label: '$1,500 - $2,000' },
        { value: '1500-2500', label: '$1,500-2500' }
      ];
    case 'Home Appliances':
      return [
        { value: '500-1000', label: '$500 - $1,000' },
        { value: '1000-1500', label: '$1,000 - $1,500' },
        { value: '1500-2000', label: '$1,500-2000' }
      ];
    // Add other categories...
    default:
      return [
        { value: '0-500', label: 'Under $500' },
        { value: '500-1000', label: '$500 - $1,000' },
        { value: '1000-2000', label: '$1,000 - $2,000' },
      ];
  }
});

// Add this computed property
const hasProducts = computed(() => {
  return productStore.products && productStore.products.length > 0;
});
</script>