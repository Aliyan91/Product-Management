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
        <button class="btn btn-danger" @click="clearAllProducts">Clear All</button>
        <button @click="openAddModal" class="btn btn-primary">Add New Product</button>
      </div>
    </div>

    <!-- Search and filter controls -->
    <div class="filter-container">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by product name..." 
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
      </div>
    </div>

    <!-- Loading/Error/No products states -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading products...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchProducts" class="btn-retry">Retry</button>
    </div>
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
            <th @click="toggleSort('name')">Name <span :class="sortIcon('name')"></span></th>
            <th @click="toggleSort('price')">Price <span :class="sortIcon('price')"></span></th>
            <th>Category</th>
            <th @click="toggleSort('stock')">Inventory <span :class="sortIcon('stock')"></span></th>
            <th @click="toggleSort('sales')">Sales <span :class="sortIcon('sales')"></span></th>
            <th @click="toggleSort('views')">Views <span :class="sortIcon('views')"></span></th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id">
            <td><input type="checkbox" v-model="product.selected" @change="updateSelectAll" /></td>
            <td><img :src="product.image || '/images/placeholder.png'" alt="Product" class="product-image" /></td>
            <td>{{ product.name }}</td>
            <td>${{ product.price.toFixed(2) }}</td>
            <td>{{ getCategoryName(product.categoryId) }}</td>
            <td><span :class="getStockClass(product.stock)">{{ product.stock }}</span></td>
            <td>{{ product.salesVolume }}</td>
            <td>{{ product.viewCount }}</td>
            <td><span :class="getStatusClass(product.status)">{{ product.status }}</span></td>
            <td class="actions-cell">
              <div class="action-buttons">
                <button @click="editProduct(product)" class="btn btn-edit">Edit</button>
                <button @click="confirmDelete(product)" class="btn btn-delete">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-btn">Previous</button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
      </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Edit Product' : 'Add New Product' }}</h2>
          <button @click="closeModal" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitProduct" class="product-form styled-form" enctype="multipart/form-data">
            <div class="form-group">
              <label>Product Name *</label>
              <input v-model="productForm.name" type="text" required class="form-input styled-input" placeholder="Enter product name" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Price ($) *</label>
                <input v-model.number="productForm.price" type="number" step="0.01" min="0" required class="form-input styled-input" placeholder="0.00" />
              </div>
              <div class="form-group">
                <label>Inventory Level *</label>
                <input v-model.number="productForm.stock" type="number" min="0" required class="form-input styled-input" placeholder="0" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Category *</label>
                <select v-model="productForm.categoryId" required class="form-input styled-select">
                  <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Status *</label>
                <select v-model="productForm.status" required class="form-input styled-select">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Cover Image</label>
              <div class="file-upload">
                <input type="file" @change="handleImageUpload" accept="image/*" id="image-upload" class="file-input" />
                <label for="image-upload" class="btn btn-upload">Choose File</label>
              </div>
              <p v-if="productForm.imagePreview" class="image-preview">Preview: <img :src="productForm.imagePreview" alt="Preview" class="preview-image" /></p>
            </div>
            <div class="form-group">
              <label>Product Overview</label>
              <textarea v-model="productForm.description" rows="3" class="form-input form-textarea styled-textarea" placeholder="Brief product overview"></textarea>
            </div>
            <div class="form-group">
              <label>Product Details (Rich Text)</label>
              <editor 
                v-model="productForm.details" 
                api-key="grcbe80z6fn0lp4djhrub4bmvt8014qzdv9qe9qahbenmd6t" 
                :init="{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                  ],
                  toolbar: 'undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help'
                }" 
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Sales Volume</label>
                <input v-model.number="productForm.salesVolume" type="number" min="0" class="form-input styled-input" placeholder="0" />
              </div>
              <div class="form-group">
                <label>View Count</label>
                <input v-model.number="productForm.viewCount" type="number" min="0" class="form-input styled-input" placeholder="0" />
              </div>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" v-model="productForm.showOnHomepage" />
                Show on Homepage (Max 6 per category)
              </label>
            </div>
            <div v-if="errorMessage" class="error-text">{{ errorMessage }}</div>
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
          <p>Are you sure you want to delete <strong>{{ productToDelete?.name }}</strong>?</p>
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
import Editor from '@tinymce/tinymce-vue';

const router = useRouter();

// State
const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const categoryFilter = ref('');
const sortOption = ref('name-asc');
const currentPage = ref(1);
const itemsPerPage = 10;
const selectAll = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const productToDelete = ref(null);
const errorMessage = ref('');

// Product form
const productForm = reactive({
  id: '',
  name: '',
  price: 0,
  stock: 0,
  categoryId: '',
  status: 'Active',
  image: '',
  imagePreview: '',
  imageFile: null,
  description: '',
  details: '',
  salesVolume: 0,
  viewCount: 0,
  showOnHomepage: false
});

// Lifecycle
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

// Methods
const fetchProducts = async () => {
  try {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    if (storedProducts.length === 0) {
      products.value = [
        { id: '1', name: 'Laptop Pro', price: 1299.99, stock: 15, categoryId: '1', status: 'Active', image: '/images/laptop.jpg', description: 'High performance laptop', details: '<p>Latest specs</p>', salesVolume: 25, viewCount: 150, showOnHomepage: true, selected: false },
        { id: '2', name: 'Smartphone X', price: 799.99, stock: 25, categoryId: '2', status: 'Active', image: '/images/smartphone.jpg', description: 'Advanced smartphone', details: '<p>Great camera</p>', salesVolume: 50, viewCount: 200, showOnHomepage: false, selected: false },
        { id: '3', name: 'as', price: 122.00, stock: 231230, categoryId: '3', status: 'Active', image: '/images/headphones.jpg', description: 'Noise cancelling headphones', details: '<p>Wireless</p>', salesVolume: 23, viewCount: 213123, showOnHomepage: false, selected: false }
      ];
      localStorage.setItem('products', JSON.stringify(products.value));
    } else {
      products.value = storedProducts.map(product => ({
        ...product,
        selected: false
      }));
    }
  } catch (err) {
    error.value = 'Failed to load products: ' + err.message;
  }
};

const fetchCategories = async () => {
  categories.value = [
    { id: '1', name: 'Computers' },
    { id: '2', name: 'Phones' },
    { id: '3', name: 'Audio' },
    { id: '4', name: 'Wearables' }
  ];
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
  const headers = ['ID', 'Name', 'Category', 'Price', 'Stock', 'Sales', 'Views', 'Status'];
  let csvContent = headers.join(',') + '\n';
  products.value.forEach(product => {
    const row = [
      product.id,
      `"${product.name.replace(/"/g, '""')}"`,
      `"${getCategoryName(product.categoryId)}"`,
      product.price,
      product.stock,
      product.salesVolume,
      product.viewCount,
      product.status
    ];
    csvContent += row.join(',') + '\n';
  });
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'products.csv';
  link.click();
};

const filteredProducts = computed(() => {
  let result = [...products.value];
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(product => 
      product.name?.toLowerCase().includes(query)
    );
  }
  if (categoryFilter.value) {
    result = result.filter(product => product.categoryId === categoryFilter.value);
  }
  const [sortField, sortDirection] = sortOption.value.split('-');
  result.sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') comparison = a.name.localeCompare(b.name);
    else if (sortField === 'price') comparison = a.price - b.price;
    else if (sortField === 'stock') comparison = a.stock - b.stock;
    else if (sortField === 'sales') comparison = a.salesVolume - b.salesVolume;
    else if (sortField === 'views') comparison = a.viewCount - b.viewCount;
    return sortDirection === 'desc' ? -comparison : comparison;
  });
  return result;
});

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

const sortIcon = (field) => ({
  'sort-icon': true,
  'asc': sortOption.value === `${field}-asc`,
  'desc': sortOption.value === `${field}-desc`
});

const toggleSort = (field) => {
  sortOption.value = sortOption.value === `${field}-asc` ? `${field}-desc` : `${field}-asc`;
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

const backToAdmin = () => router.push('/admin');

const openAddModal = () => {
  resetForm();
  showAddModal.value = true;
};

const editProduct = (product) => {
  Object.assign(productForm, JSON.parse(JSON.stringify(product)));
  productForm.imagePreview = product.image; // Set preview for existing image
  showEditModal.value = true;
};

const confirmDelete = (product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const deleteProduct = () => {
  products.value = products.value.filter(p => p.id !== productToDelete.value.id);
  localStorage.setItem('products', JSON.stringify(products.value));
  showDeleteModal.value = false;
  productToDelete.value = null;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    productForm.imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      productForm.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const submitProduct = () => {
  errorMessage.value = '';
  if (productForm.showOnHomepage) {
    const categoryProducts = products.value.filter(p => 
      p.categoryId === productForm.categoryId && 
      p.showOnHomepage && 
      (showEditModal.value ? p.id !== productForm.id : true)
    );
    if (categoryProducts.length >= 6) {
      errorMessage.value = 'Maximum 6 products per category can be shown on homepage';
      return;
    }
  }

  let imageUrl = productForm.image;
  if (productForm.imageFile) {
    imageUrl = productForm.imagePreview; // For demo, using base64 preview
  }

  if (showEditModal.value) {
    const index = products.value.findIndex(p => p.id === productForm.id);
    if (index !== -1) {
      products.value[index] = { ...productForm, image: imageUrl, updatedAt: new Date().toISOString() };
    }
  } else {
    const newProduct = {
      ...productForm,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      selected: false,
      image: imageUrl,
      salesVolume: productForm.salesVolume || 0,
      viewCount: productForm.viewCount || 0
    };
    products.value.push(newProduct);
  }
  
  localStorage.setItem('products', JSON.stringify(products.value));
  closeModal();
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  resetForm();
};

const resetForm = () => {
  Object.assign(productForm, {
    id: '',
    name: '',
    price: 0,
    stock: 0,
    categoryId: categories.value[0]?.id || '',
    status: 'Active',
    image: '',
    imagePreview: '',
    imageFile: null,
    description: '',
    details: '',
    salesVolume: 0,
    viewCount: 0,
    showOnHomepage: false
  });
  errorMessage.value = '';
};
</script>

<style scoped>
/* General Styling */
.admin-products {
  padding: 20px;
  background-color: #1a1f2e;
  min-height: 100vh;
  color: #d1d5db;
}

/* Content Header */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: #1a1f2e;
  padding: 10px 0;
  border-bottom: 1px solid #2d3748;
}

.content-header h1 {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.btn-back {
  background-color: #4b5563;
  color: #ffffff;
}

.btn-back:hover {
  background-color: #6b7280;
}

.btn-secondary {
  background-color: #4b5563;
  color: #ffffff;
}

.btn-secondary:hover {
  background-color: #6b7280;
}

.btn-danger {
  background-color: #dc2626;
  color: #ffffff;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

.btn-primary {
  background-color: #8b5cf6;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #7c3aed;
}

.btn-upload {
  background-color: #4b5563;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-upload:hover {
  background-color: #6b7280;
}

/* Filter Container */
.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2d3748;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.search-box {
  flex: 1;
  margin-right: 12px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #4b5563;
  border-radius: 4px;
  font-size: 14px;
  color: #d1d5db;
  background-color: #1a1f2e;
}

.search-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.filter-options {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #4b5563;
  border-radius: 4px;
  font-size: 14px;
  color: #d1d5db;
  background-color: #1a1f2e;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #8b5cf6;
}

/* Loading/Error/No Products States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #9ca3af;
}

.loading-spinner {
  border: 4px solid #4b5563;
  border-top: 4px solid #8b5cf6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container, .no-products {
  background-color: #2d3748;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  margin: 20px 0;
  color: #9ca3af;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.error-container p {
  color: #f87171;
  margin-bottom: 16px;
  font-weight: 500;
}

.btn-retry {
  background-color: #8b5cf6;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-retry:hover {
  background-color: #7c3aed;
}

/* Products Table */
.data-table {
  background-color: #2d3748;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  color: #d1d5db;
}

.products-table th, .products-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #4b5563;
}

.products-table th {
  background-color: #1a1f2e;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.products-table th:hover {
  background-color: #2d3748;
}

.products-table td {
  font-size: 14px;
}

.products-table tbody tr:nth-child(even) {
  background-color: #1a1f2e;
}

.products-table tbody tr:hover {
  background-color: #4b5563;
}

.sort-icon {
  display: inline-block;
  width: 10px;
}

.sort-icon.asc::after { content: '↑'; }
.sort-icon.desc::after { content: '↓'; }

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #4b5563;
}

.status-active {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #10b981;
  color: #ffffff;
}

.status-inactive {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #f87171;
  color: #ffffff;
}

.status-outofstock {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #f87171;
  color: #ffffff;
}

.status-lowstock {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #facc15;
  color: #ffffff;
}

.status-instock {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #10b981;
  color: #ffffff;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-edit {
  background-color: #8b5cf6;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.btn-edit:hover {
  background-color: #7c3aed;
}

.btn-delete {
  background-color: #dc2626;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.btn-delete:hover {
  background-color: #b91c1c;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  gap: 10px;
  background-color: #1a1f2e;
}

.pagination-btn {
  background-color: #4b5563;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  color: #ffffff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #6b7280;
}

.pagination-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
}

/* Modal */
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
  background-color: #2d3748;
  border-radius: 6px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  color: #d1d5db;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #4b5563;
  background-color: #1a1f2e;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.3s;
}

.btn-close:hover {
  color: #ffffff;
}

.modal-body {
  padding: 20px;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #d1d5db;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #4b5563;
  border-radius: 4px;
  font-size: 14px;
  color: #d1d5db;
  background-color: #1a1f2e;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #4b5563;
  border-radius: 4px;
  font-size: 14px;
  color: #d1d5db;
  background-color: #1a1f2e;
}

.form-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.file-upload {
  position: relative;
  display: inline-block;
}

.file-input {
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
}

.image-preview {
  margin-top: 8px;
  font-size: 12px;
  color: #9ca3af;
}

.preview-image {
  max-width: 100px;
  max-height: 100px;
  margin-top: 4px;
  border-radius: 4px;
  border: 1px solid #4b5563;
}

.error-text {
  color: #f87171;
  font-size: 14px;
  font-weight: 500;
}

.warning-text {
  color: #f87171;
  font-size: 14px;
  font-weight: 500;
}

.delete-modal {
  max-width: 450px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-actions button {
  min-width: 100px;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* Responsive Design */
@media screen and (max-width: 768px) {
  .content-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .filter-container {
    flex-direction: column;
    gap: 10px;
  }

  .search-box {
    margin-right: 0;
  }

  .filter-options {
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .data-table {
    overflow-x: auto;
  }

  .products-table {
    min-width: 700px;
  }
}

@media screen and (max-width: 480px) {
  .form-row {
    flex-direction: column;
    gap: 10px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 6px;
  }

  .modal-container {
    width: 95%;
  }
}
</style>