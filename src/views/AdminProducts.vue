<template>
    <div class="admin-products">
      <div class="content-header">
        <div class="back-button-container">
          <button class="btn btn-back" @click="backToAdmin">
            <i class="icon-arrow-left"></i> Back to Admin
          </button>
        </div>
        <h1>Product Management</h1>
        <div class="header-actions">
          <button class="btn btn-secondary" @click="exportData">Export</button>
          <button class="btn btn-danger" @click="clearAllProducts">Clear All Products</button>
          <button @click="showAddModal = true" class="btn btn-primary">Add New Product</button>
        </div>
      </div>
  
      <!-- Search and filter controls -->
      <div class="filter-container">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search products..." 
            class="search-input"
            @input="filterProducts"
          />
        </div>
        <div class="filter-options">
          <select v-model="categoryFilter" @change="filterProducts" class="filter-select">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <select v-model="sortOption" @change="filterProducts" class="filter-select">
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="stock-asc">Stock (Low to High)</option>
            <option value="stock-desc">Stock (High to Low)</option>
          </select>
        </div>
      </div>
  
      <!-- Loading indicator -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
  
      <!-- Error message -->
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="fetchProducts" class="btn-retry">Retry</button>
      </div>
  
      <!-- No products found -->
      <div v-else-if="filteredProducts.length === 0" class="no-products">
        <p>No products found. Try adjusting your search or filters.</p>
      </div>
  
      <!-- Products table -->
      <div v-else class="data-table">
        <table class="products-table">
          <thead>
            <tr>
              <th><input type="checkbox" @change="toggleSelectAll" v-model="selectAll" /></th>
              <th>Image</th>
              <th @click="toggleSort('name')">
                Name 
                <span v-if="sortOption === 'name-asc'">↑</span>
                <span v-if="sortOption === 'name-desc'">↓</span>
              </th>
              <th @click="toggleSort('price')">
                Price 
                <span v-if="sortOption === 'price-asc'">↑</span>
                <span v-if="sortOption === 'price-desc'">↓</span>
              </th>
              <th>Category</th>
              <th @click="toggleSort('stock')">
                Stock 
                <span v-if="sortOption === 'stock-asc'">↑</span>
                <span v-if="sortOption === 'stock-desc'">↓</span>
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.id">
              <td><input type="checkbox" v-model="product.selected" @change="updateSelectAll" /></td>
              <td>
                <img 
                  :src="product.image || '/images/placeholder.png'" 
                  alt="Product" 
                  class="product-image" 
                />
              </td>
              <td>{{ product.name }}</td>
              <td>${{ product.price.toFixed(2) }}</td>
              <td>{{ getCategoryName(product.categoryId) }}</td>
              <td>
                <span :class="getStockClass(product.stock)">{{ product.stock }}</span>
              </td>
              <td>
                <span :class="getStatusClass(product.status)">
                  {{ product.status }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button @click="editProduct(product)" class="btn btn-edit">
                    Edit
                  </button>
                  <button @click="confirmDelete(product)" class="btn btn-delete">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Pagination -->
      <div v-if="filteredProducts.length > 0" class="pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1" 
          class="pagination-btn"
        >
          Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages" 
          class="pagination-btn"
        >
          Next
        </button>
      </div>
  
      <!-- Add/Edit Product Modal -->
      <div v-if="showAddModal || showEditModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2>{{ showEditModal ? 'Edit Product' : 'Add New Product' }}</h2>
            <button @click="closeModal" class="btn-close">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitProduct" class="product-form styled-form">
              <div class="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  v-model="productForm.name" 
                  required 
                  class="form-input styled-input"
                  placeholder="Enter product name"
                />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Price ($)</label>
                  <input 
                    type="number" 
                    v-model.number="productForm.price" 
                    step="0.01" 
                    min="0" 
                    required 
                    class="form-input styled-input"
                    placeholder="0.00"
                  />
                </div>
                <div class="form-group">
                  <label>Stock</label>
                  <input 
                    type="number" 
                    v-model.number="productForm.stock" 
                    min="0" 
                    required 
                    class="form-input styled-input"
                    placeholder="0"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Category</label>
                  <select v-model="productForm.categoryId" required class="form-input styled-select">
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Status</label>
                  <select v-model="productForm.status" required class="form-input styled-select">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea 
                  v-model="productForm.description" 
                  rows="4" 
                  class="form-input form-textarea styled-textarea"
                  placeholder="Enter product description"
                ></textarea>
              </div>
              <div class="form-group">
                <label>Image URL</label>
                <input 
                  type="text" 
                  v-model="productForm.image" 
                  class="form-input styled-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div class="form-group">
                <label>
                  <input type="checkbox" v-model="productForm.showOnHomepage" />
                  Show on Homepage
                </label>
              </div>
              <div class="modal-actions">
                <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
                <button type="submit" class="btn btn-primary">{{ showEditModal ? 'Update' : 'Add' }} Product</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-container delete-modal">
          <div class="modal-header">
            <h2>Confirm Delete</h2>
            <button @click="showDeleteModal = false" class="btn-close">×</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete the product <strong>{{ productToDelete?.name }}</strong>?</p>
            <p class="warning-text">This action cannot be undone.</p>
            <div class="modal-actions">
              <button @click="showDeleteModal = false" class="btn btn-secondary">Cancel</button>
              <button @click="deleteProduct" class="btn btn-delete">Delete Product</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  
  // Router initialization
  const router = useRouter();
  
  // State for product management
  const products = ref([]);
  const categories = ref([]);
  const loading = ref(true);
  const error = ref('');
  const searchQuery = ref('');
  const categoryFilter = ref('');
  const sortOption = ref('name-asc');
  const currentPage = ref(1);
  const itemsPerPage = 10;
  
  // Checkbox state
  const selectAll = ref(false);
  
  // Modal state
  const showAddModal = ref(false);
  const showEditModal = ref(false);
  const showDeleteModal = ref(false);
  const productToDelete = ref(null);
  
  // Product form
  const productForm = reactive({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categoryId: '',
    status: 'Active',
    showOnHomepage: false
  });
  
  // Fetch products and categories on component mount
  onMounted(async () => {
    try {
      loading.value = true;
      await fetchProducts();
      await fetchCategories();
    } catch (err) {
      error.value = 'Error loading data: ' + err.message;
    } finally {
      loading.value = false;
    }
  });
  
  // Fetch products from localStorage or API
  const fetchProducts = async () => {
    try {
      const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
      if (storedProducts.length === 0) {
        products.value = [
          { 
            id: '1', 
            name: 'Laptop Pro', 
            price: 1299.99, 
            stock: 15, 
            categoryId: '1', 
            status: 'Active', 
            image: '/images/laptop.jpg', 
            description: 'High performance laptop with latest specs',
            selected: false,
            showOnHomepage: true
          },
          { 
            id: '2', 
            name: 'Smartphone X', 
            price: 799.99, 
            stock: 25, 
            categoryId: '2', 
            status: 'Active', 
            image: '/images/smartphone.jpg', 
            description: 'Latest smartphone with advanced camera',
            selected: false,
            showOnHomepage: false
          },
          { 
            id: '3', 
            name: 'Wireless Headphones', 
            price: 149.99, 
            stock: 5, 
            categoryId: '3', 
            status: 'Low Stock', 
            image: '/images/headphones.jpg', 
            description: 'Noise cancelling wireless headphones',
            selected: false,
            showOnHomepage: true
          },
          { 
            id: '4', 
            name: 'Smart Watch', 
            price: 249.99, 
            stock: 0, 
            categoryId: '4', 
            status: 'Out of Stock', 
            image: '/images/smartwatch.jpg', 
            description: 'Fitness and health tracking smartwatch',
            selected: false,
            showOnHomepage: false
          },
          { 
            id: '5', 
            name: 'Tablet Ultra', 
            price: 499.99, 
            stock: 12, 
            categoryId: '1', 
            status: 'Active', 
            image: '/images/tablet.jpg', 
            description: 'Lightweight tablet with high resolution display',
            selected: false,
            showOnHomepage: true
          }
        ];
        localStorage.setItem('products', JSON.stringify(products.value));
      } else {
        products.value = storedProducts;
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      error.value = 'Failed to load products. Please try again.';
    }
  };
  
  // Fetch categories
  const fetchCategories = async () => {
    try {
      categories.value = [
        { id: '1', name: 'Computers' },
        { id: '2', name: 'Phones' },
        { id: '3', name: 'Audio' },
        { id: '4', name: 'Wearables' }
      ];
    } catch (err) {
      console.error('Error fetching categories:', err);
      error.value = 'Failed to load categories. Please try again.';
    }
  };
  
  const filterProducts = () => {
    currentPage.value = 1;
  };
  
  const toggleSelectAll = () => {
    products.value.forEach(item => item.selected = selectAll.value);
  };
  
  const updateSelectAll = () => {
    selectAll.value = products.value.every(item => item.selected);
  };
  
  const clearAllProducts = () => {
    if (confirm('Are you sure you want to delete all products?')) {
      products.value = [];
      localStorage.setItem('products', JSON.stringify([]));
    }
  };
  
  const exportData = () => {
    try {
      if (products.value.length === 0) {
        throw new Error('No products to export');
      }
      const headers = [
        'ID',
        'Product Name',
        'Category',
        'Price',
        'Stock',
        'Status'
      ];
      let csvContent = headers.join(',') + '\n';
      products.value.forEach(product => {
        const row = [
          product.id,
          `"${product.name.replace(/"/g, '""')}"`,
          `"${getCategoryName(product.categoryId)}"`,
          product.price,
          product.stock,
          product.status
        ];
        csvContent += row.join(',') + '\n';
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'products.csv';
      link.click();
      alert('Products exported successfully!');
    } catch (error) {
      alert('Error exporting products: ' + error.message);
    }
  };
  
  const filteredProducts = computed(() => {
    let result = [...products.value];
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(product => 
        product.name?.toLowerCase().includes(query) || 
        product.description?.toLowerCase().includes(query)
      );
    }
    if (categoryFilter.value) {
      result = result.filter(product => product.categoryId === categoryFilter.value);
    }
    const [sortField, sortDirection] = sortOption.value.split('-');
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'stock') {
        comparison = a.stock - b.stock;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
    return result;
  });
  
  const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / itemsPerPage);
  });
  
  const paginatedProducts = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.value.slice(startIndex, endIndex);
  });
  
  const toggleSort = (field) => {
    if (sortOption.value === `${field}-asc`) {
      sortOption.value = `${field}-desc`;
    } else {
      sortOption.value = `${field}-asc`;
    }
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.value.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  
  const getStockClass = (stock) => {
    if (stock === 0) return 'status-outofstock';
    if (stock < 10) return 'status-lowstock';
    return 'status-instock';
  };
  
  const getStatusClass = (status) => {
    if (status === 'Active') return 'status-active';
    if (status === 'Inactive') return 'status-inactive';
    if (status === 'Out of Stock') return 'status-outofstock';
    return '';
  };
  
  const backToAdmin = () => {
    router.push('/admin');
  };
  
  const editProduct = (product) => {
    Object.assign(productForm, JSON.parse(JSON.stringify(product)));
    showEditModal.value = true;
  };
  
  const confirmDelete = (product) => {
    productToDelete.value = product;
    showDeleteModal.value = true;
  };
  
  const deleteProduct = async () => {
    try {
      if (!productToDelete.value) return;
      products.value = products.value.filter(p => p.id !== productToDelete.value.id);
      localStorage.setItem('products', JSON.stringify(products.value));
      showDeleteModal.value = false;
      productToDelete.value = null;
      alert('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      error.value = 'Failed to delete product. Please try again.';
    }
  };
  
  const submitProduct = async () => {
    try {
      if (productForm.showOnHomepage) {
        const categoryProducts = products.value.filter(p => 
          p.categoryId === productForm.categoryId && 
          p.showOnHomepage &&
          (showEditModal.value ? p.id !== productForm.id : true)
        );
        if (categoryProducts.length >= 6) {
          throw new Error('Maximum 6 products per category can be shown on homepage');
        }
      }
      if (showEditModal.value) {
        const index = products.value.findIndex(p => p.id === productForm.id);
        if (index !== -1) {
          products.value[index] = { 
            ...products.value[index],
            ...productForm,
            updatedAt: new Date().toISOString()
          };
        }
      } else {
        const newProduct = {
          ...productForm,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          selected: false
        };
        products.value.push(newProduct);
      }
      localStorage.setItem('products', JSON.stringify(products.value));
      closeModal();
      alert(`Product ${showEditModal.value ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      alert(err.message);
    }
  };
  
  const closeModal = () => {
    showAddModal.value = false;
    showEditModal.value = false;
    Object.assign(productForm, {
      id: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: '',
      categoryId: categories.value.length > 0 ? categories.value[0].id : '',
      status: 'Active',
      showOnHomepage: false
    });
  };
  </script>
  
  <style scoped>
  @import './AdminPortal.css';

  .admin-products {
    padding: 20px;
    width: 100%;
  }

  .filter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 4px;
  }

  .search-box {
    flex: 1;
    margin-right: 15px;
  }

  .search-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;
  }

  .search-input:focus {
    border-color: #4CAF50;
    outline: none;
  }

  .filter-options {
    display: flex;
    gap: 10px;
  }

  .filter-select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    cursor: pointer;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    color: #555;
  }

  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-container, .no-products {
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 20px;
    text-align: center;
    margin: 20px 0;
    color: #666;
  }

  .error-container p {
    color: #D32F2F;
    margin-bottom: 15px;
    font-weight: 500;
  }

  .btn-retry {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s;
  }

  .btn-retry:hover {
    background-color: #45a049;
  }

  .products-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .products-table th, 
  .products-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  .products-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #333;
    cursor: pointer;
  }

  .products-table th:hover {
    background-color: #f1f1f1;
  }

  .product-image {
    max-width: 50px;
    max-height: 50px;
    border: 1px solid #ddd;
    border-radius: 4px;
    object-fit: cover;
  }

  .status-active {
    padding: 4px 10px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    background-color: rgba(46, 139, 87, 0.15);
    color: #2E8B57;
  }

  .status-inactive {
    padding: 4px 10px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    background-color: rgba(211, 47, 47, 0.15);
    color: #D32F2F;
  }

  .status-outofstock {
    padding: 4px 10px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    background-color: rgba(211, 47, 47, 0.15);
    color: #D32F2F;
  }

  .status-lowstock {
    padding: 4px 10px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    background-color: rgba(255, 193, 7, 0.15);
    color: #FFC107;
  }

  .status-instock {
    padding: 4px 10px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    background-color: rgba(46, 139, 87, 0.15);
    color: #2E8B57;
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    gap: 15px;
  }

  .pagination-btn {
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s;
  }

  .pagination-btn:hover:not(:disabled) {
    background-color: #e0e0e0;
  }

  .pagination-btn:disabled {
    background-color: #e9ecef;
    color: #adb5bd;
    cursor: not-allowed;
  }

  .page-info {
    font-size: 14px;
    color: #555;
    font-weight: 500;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-container {
    background-color: white;
    border-radius: 6px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    padding-bottom: 70px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    background-color: #f8f9fa;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }

  .btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    transition: color 0.3s;
  }

  .btn-close:hover {
    color: #333;
  }

  .modal-body {
    padding: 20px;
  }

  .product-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-row {
    display: flex;
    gap: 15px;
  }

  .form-row .form-group {
    flex: 1;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #333;
  }

  .form-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;
  }

  .form-input:focus {
    border-color: #4CAF50;
    outline: none;
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .warning-text {
    color: #D32F2F;
    font-weight: 500;
    margin: 10px 0;
  }

  .delete-modal {
    max-width: 450px;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
    position: relative;
    z-index: 10;
  }

  .modal-actions button {
    min-width: 100px;
    padding: 8px 16px;
    font-weight: 500;
  }

  .btn-primary {
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn-primary:hover {
    background-color: #45a049;
  }

  .btn-secondary {
    background-color: #f1f1f1;
    color: #333;
    border: 1px solid #ccc;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn-secondary:hover {
    background-color: #e0e0e0;
  }

  .btn-delete {
    background-color: #D32F2F;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn-delete:hover {
    background-color: #c62828;
  }

  .btn-edit {
    background-color: #2196F3;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn-edit:hover {
    background-color: #1976D2;
  }

  @media screen and (max-width: 768px) {
    .filter-container {
      flex-direction: column;
      gap: 10px;
    }

    .search-box {
      margin-right: 0;
    }

    .filter-options {
      flex-direction: column;
      width: 100%;
    }

    .filter-select {
      width: 100%;
    }

    .products-table {
      min-width: 700px;
    }

    .data-table {
      overflow-x: auto;
    }
  }

  @media screen and (max-width: 480px) {
    .form-row {
      flex-direction: column;
      gap: 10px;
    }

    .action-buttons {
      flex-direction: column;
      gap: 5px;
    }

    .modal-container {
      width: 95%;
      padding: 15px;
    }
  }
  </style>