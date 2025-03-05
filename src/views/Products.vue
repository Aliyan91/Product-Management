<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header Section -->
    <div class="w-full px-6 py-8 bg-gray-800">
      <div class="max-w-7xl mx-auto">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">Product Management</h1>
            <p class="mt-2 text-sm text-gray-400">
              Add, edit, or remove products
            </p>
          </div>
          <div class="mt-4 sm:mt-0">
            <button
              @click="showAddModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Product
            </button>
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
          class="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-200"
        >
          <div class="aspect-w-16 aspect-h-9">
            <img
              :src="product.picture || 'https://placehold.co/600x400?text=Product+Image'"
              :alt="product.name"
              class="w-full h-48 object-cover"
            />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-white mb-2">{{ product.name }}</h3>
            <p class="text-gray-400 mb-4">{{ product.description }}</p>
            <div class="flex items-center justify-between mb-4">
              <span class="text-2xl font-bold text-indigo-400">${{ product.price }}</span>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editProduct(product)"
                class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Edit
              </button>
              <button
                @click="handleDelete(product.id)"
                class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
                {{ editingProduct ? 'Update' : 'Add' }} Product
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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const products = ref([]);
const loading = ref(false);
const error = ref(null);
const showAddModal = ref(false);
const editingProduct = ref(null);

const formData = ref({
  name: '',
  description: '',
  price: '',
  picture: ''
});

// Fetch products
const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('/goods');
    console.log('API Response:', response.data); // Debug log
    products.value = response.data;
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = 'Failed to load products';
  } finally {
    loading.value = false;
  }
};

// Add new product
const addProduct = async () => {
  const productData = {
    name: formData.value.name,
    description: formData.value.description,
    price: Number(formData.value.price),
    picture: formData.value.picture || 'https://placehold.co/600x400?text=Product+Image'
  };
  
  try {
    console.log('Sending product data:', productData);
    const response = await axios.post('/goods', productData);
    console.log('Response:', response);

    await fetchProducts();
    showAddModal.value = false;
    formData.value = {
      name: '',
      description: '',
      price: '',
      picture: ''
    };
    toast.success("Product added successfully! 🎉");
    
  } catch (err) {
    console.error('Detailed error:', err.response || err);
    toast.error(`Failed to add product: ${err.response?.data?.message || err.message}`);
    error.value = `Failed to add product: ${err.response?.data?.message || err.message}`;
  }
};

// Edit product
const editProduct = (product) => {
  editingProduct.value = product;
  formData.value = { ...product };
  showAddModal.value = true;
};

// Update product
const updateProduct = async () => {
  try {
    const updatedProduct = {
      id: editingProduct.value.id,
      name: formData.value.name,
      description: formData.value.description,
      price: Number(formData.value.price),
      picture: formData.value.picture || 'https://placehold.co/600x400?text=Product+Image'
    };
    
    await axios.put(`/goods/${editingProduct.value.id}`, updatedProduct);
    await fetchProducts();
    showAddModal.value = false;
    editingProduct.value = null;
    formData.value = {
      name: '',
      description: '',
      price: '',
      picture: ''
    };
    toast.success("Product updated successfully! ✨");
    
  } catch (err) {
    console.error('Error updating product:', err);
    toast.error("Failed to update product");
    error.value = 'Failed to update product';
  }
};

// Delete product
const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await axios.delete(`/goods/${id}`);
      await fetchProducts();
      toast.success("Product deleted successfully! 🗑️");
     
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error("Failed to delete product");
      error.value = 'Failed to delete product';
    }
  }
};

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission
  if (editingProduct.value) {
    await updateProduct();
  } else {
    await addProduct();
  }
  // Close modal after submission
  showAddModal.value = false;
};

// Close modal and reset form
const closeModal = () => {
  showAddModal.value = false;
  formData.value = {
    name: '',
    description: '',
    price: '',
    picture: ''
  };
  editingProduct.value = null;
};

// Load products on component mount
onMounted(() => {
  fetchProducts();
});
</script>