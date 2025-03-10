<template>
  <div class="product-management">
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
      </div>
    </div>
    
    <div class="content-body">
      <div class="search-filter">
        <input type="text" 
               placeholder="Search products..." 
               class="search-input"
               v-model="searchQuery"
               @input="handleSearch"/>
        <select class="status-select" v-model="statusFilter" @change="filterByStatus">
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select class="metric-select" v-model="metricFilter" @change="sortByMetric">
          <option value="">All Products</option>
          <option value="inventory">Inventory Products</option>
          <option value="sales">Sales Products</option>
          <option value="views">Most Viewed Products</option>
        </select>
        <button class="btn btn-primary" @click="openAddProductModal">Add Product</button>
      </div>
      
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" @change="toggleSelectAll" v-model="selectAll" /></th>
              <th @click="sortBy('productName')">Product Name <i class="sort-icon"></i></th>
              <th @click="sortBy('price')">Price <i class="sort-icon"></i></th>
              <th>Cover Image</th>
              <th @click="sortBy('stock')">Inventory <i class="sort-icon"></i></th>
              <th @click="sortBy('salesVolume')">Sales <i class="sort-icon"></i></th>
              <th @click="sortBy('viewCount')">Views <i class="sort-icon"></i></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in filteredProductData" :key="index">
              <td><input type="checkbox" v-model="product.selected" @change="updateSelectAll" /></td>
              <td>{{ product.productName }}</td>
              <td>${{ product.price.toFixed(2) }}</td>
              <td>
                <img :src="product.coverImage" alt="Product cover" class="product-image" 
                     v-if="product.coverImage" style="max-width: 50px; max-height: 50px;" />
                <span v-else>No Image</span>
              </td>
              <td>{{ product.stock }}</td>
              <td>{{ product.salesVolume }}</td>
              <td>{{ product.viewCount }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-edit" @click="editItem(product)">Edit</button>
                  <button class="btn btn-delete" @click="deleteItem(product)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div v-if="showAddProductModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Product</h2>
          <button class="close-button" @click="closeAddProductModal">&times;</button>
        </div>
        <form @submit.prevent="saveProduct" class="styled-form">
          <div class="form-group">
            <label>Product Category <span class="required">*</span></label>
            <select v-model="newProduct.category" required class="styled-select">
              <option value="" disabled>Select Product Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
            </select>
          </div>
          <div class="form-group">
            <label>Display Category</label>
            <select v-model="newProduct.displayCategory" required class="styled-select">
              <option value="" disabled>Select Display Category</option>
              <option value="inventory">Inventory Products</option>
              <option value="sales">Sales Products</option>
              <option value="views">Most Viewed Products</option>
            </select>
          </div>
          <div class="form-group">
            <label>Product Name <span class="required">*</span></label>
            <input 
              v-model="newProduct.productName" 
              type="text" 
              required 
              class="styled-input"
              placeholder="Enter product name"
            />
          </div>
          <div class="form-group">
            <label>Price <span class="required">*</span></label>
            <input 
              v-model.number="newProduct.price" 
              type="number" 
              step="0.01" 
              min="0" 
              required 
              class="styled-input"
              placeholder="0.00"
            />
          </div>
          <div class="form-group">
            <label>Cover Image</label>
            <div class="file-upload-container">
              <input 
                type="file" 
                @change="handleImageUpload" 
                accept="image/*" 
                class="file-input" 
                id="file-upload"
              />
              <label for="file-upload" class="file-upload-label">
                <i class="icon-upload"></i>
                <span>Choose a file or drag it here</span>
              </label>
              <div v-if="newProduct.coverImage" class="image-preview-container">
                <img :src="newProduct.coverImage" class="preview-image" alt="Preview" />
                <button class="remove-image" @click="removeImage">×</button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Product Overview</label>
            <textarea v-model="newProduct.overview" required class="styled-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>Product Details</label>
            <Editor
              v-model="newProduct.details"
              :init="editorConfig"
              api-key="grcbe80z6fn0lp4djhrub4bmvt8014qzdv9qe9qahbenmd6t"
            />
          </div>
          <div class="form-group">
            <label>Inventory Level</label>
            <input v-model.number="newProduct.stock" type="number" min="0" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="newProduct.showOnHomepage" />
              Show on Homepage
            </label>
            <p v-if="homepageError" class="error-message">
              {{ homepageError }}
            </p>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeAddProductModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Product</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Product Modal -->
    <div v-if="showEditProductModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Product</h2>
          <button class="close-button" @click="closeEditProductModal">&times;</button>
        </div>
        <form @submit.prevent="updateProduct" class="styled-form">
          <div class="form-group">
            <label>Product Category</label>
            <select v-model="editingProduct.category" required class="styled-select">
              <option value="" disabled>Select Product Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
            </select>
          </div>
          <div class="form-group">
            <label>Display Category</label>
            <select v-model="editingProduct.displayCategory" required class="styled-select">
              <option value="" disabled>Select Display Category</option>
              <option value="inventory">Inventory Products</option>
              <option value="sales">Sales Products</option>
              <option value="views">Most Viewed Products</option>
            </select>
          </div>
          <div class="form-group">
            <label>Product Name</label>
            <input v-model="editingProduct.productName" type="text" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Price</label>
            <input v-model.number="editingProduct.price" type="number" step="0.01" min="0" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Cover Image</label>
            <div class="file-upload-container">
              <input 
                type="file" 
                @change="handleEditImageUpload" 
                accept="image/*" 
                class="file-input" 
                id="file-upload"
              />
              <label for="file-upload" class="file-upload-label">
                <i class="icon-upload"></i>
                <span>Choose a file or drag it here</span>
              </label>
              <div v-if="editingProduct.coverImage" class="image-preview-container">
                <img :src="editingProduct.coverImage" class="preview-image" alt="Preview" />
                <button class="remove-image" @click="removeImage">×</button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Product Overview</label>
            <textarea v-model="editingProduct.overview" required class="styled-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>Product Details</label>
            <Editor
              v-model="editingProduct.details"
              :init="editorConfig"
              api-key="grcbe80z6fn0lp4djhrub4bmvt8014qzdv9qe9qahbenmd6t"
            />
          </div>
          <div class="form-group">
            <label>Inventory Level</label>
            <input v-model.number="editingProduct.stock" type="number" min="0" required class="styled-input" />
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="editingProduct.showOnHomepage" />
              Show on Homepage
            </label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeEditProductModal">Close</button>
            <button type="submit" class="btn btn-primary">Update</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import { useRouter } from 'vue-router'

// Product-specific data
const productData = ref(JSON.parse(localStorage.getItem('products')) || [])

// State variables
const selectAll = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const sortColumn = ref('')
const sortDirection = ref('asc')
const metricFilter = ref('')
const showAddProductModal = ref(false)
const showEditProductModal = ref(false)
const homepageError = ref('')

// Editor configuration
const editorConfig = {
  height: 300,
  menubar: true,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
  ],
  toolbar: 'undo redo | formatselect | bold italic backcolor | \
    alignleft aligncenter alignright alignjustify | \
    bullist numlist outdent indent | removeformat | help',
  content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
  skin: 'oxide',
  content_css: 'default'
}

// Reactive objects for product forms
const editingProduct = reactive({
  category: '',
  displayCategory: '',
  productName: '',
  price: 0,
  coverImage: '',
  overview: '',
  details: '',
  stock: 0,
  showOnHomepage: false,
  salesVolume: 0,
  viewCount: 0
})

const newProduct = reactive({
  category: '',
  displayCategory: '',
  productName: '',
  price: 0,
  coverImage: '',
  overview: '',
  details: '',
  stock: 0,
  showOnHomepage: false,
  salesVolume: 0,
  viewCount: 0
})

// Computed properties
const filteredProductData = computed(() => {
  let data = [...productData.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(item => 
      item.productName.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    data = data.filter(item => item.status === statusFilter.value)
  }
  
  // Apply metric filter
  if (metricFilter.value) {
    switch(metricFilter.value) {
      case 'inventory':
        data.sort((a, b) => b.stock - a.stock)
        break
      case 'sales':
        data.sort((a, b) => b.salesVolume - a.salesVolume)
        break
      case 'views':
        data.sort((a, b) => b.viewCount - a.viewCount)
        break
    }
  }
  
  // Apply column sorting
  if (sortColumn.value) {
    data.sort((a, b) => {
      const aVal = a[sortColumn.value]
      const bVal = b[sortColumn.value]
      
      if (typeof aVal === 'string') {
        return sortDirection.value === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      return sortDirection.value === 'asc' 
        ? aVal - bVal 
        : bVal - aVal
    })
  }
  
  return data
})

// Methods
const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const toggleSelectAll = () => {
  productData.value.forEach(item => item.selected = selectAll.value)
}

const updateSelectAll = () => {
  selectAll.value = productData.value.every(item => item.selected)
}

const handleSearch = () => {
  console.log(`Searching for: ${searchQuery.value}`)
}

const filterByStatus = () => {
  console.log(`Filtering by status: ${statusFilter.value}`)
}

const sortByMetric = () => {
  console.log(`Sorting by metric: ${metricFilter.value}`)
}

const deleteItem = (product) => {
  try {
    if (!confirm(`Are you sure you want to delete "${product.productName}"?`)) {
      return
    }

    productData.value = productData.value.filter(p => p.id !== product.id)
    localStorage.setItem('products', JSON.stringify(productData.value))
    alert('Product deleted successfully!')
  } catch (error) {
    alert('Error deleting product: ' + error.message)
  }
}

const clearAllProducts = () => {
  productData.value = []
  localStorage.setItem('products', JSON.stringify([]))
}

const exportData = () => {
  try {
    const products = productData.value
    
    if (products.length === 0) {
      throw new Error('No products to export')
    }
    
    // Define CSV headers
    const headers = [
      'ID',
      'Product Name',
      'Category',
      'Price',
      'Stock',
      'Sales Volume',
      'View Count',
      'Status'
    ]
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n'
    
    // Add product data
    products.forEach(product => {
      const row = [
        product.id,
        `"${product.productName.replace(/"/g, '""')}"`,
        `"${product.category}"`,
        product.price,
        product.stock,
        product.salesVolume,
        product.viewCount,
        product.status
      ]
      csvContent += row.join(',') + '\n'
    })
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'products.csv'
    link.click()
    
    alert('Products exported successfully!')
  } catch (error) {
    alert('Error exporting products: ' + error.message)
  }
}

// Product form methods
const editItem = (product) => {
  try {
    // Make a deep copy of the product
    const productToEdit = JSON.parse(JSON.stringify(product))
    
    // Assign all values to editingProduct
    Object.assign(editingProduct, {
      id: productToEdit.id,
      category: productToEdit.category,
      displayCategory: productToEdit.displayCategory,
      productName: productToEdit.productName,
      price: productToEdit.price,
      coverImage: productToEdit.coverImage,
      overview: productToEdit.overview,
      details: productToEdit.details,
      stock: productToEdit.stock,
      showOnHomepage: productToEdit.showOnHomepage,
      salesVolume: productToEdit.salesVolume,
      viewCount: productToEdit.viewCount
    })
    
    showEditProductModal.value = true
  } catch (error) {
    alert('Error editing product: ' + error.message)
  }
}

const closeEditProductModal = () => {
  showEditProductModal.value = false
}

const handleEditImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      editingProduct.coverImage = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      newProduct.coverImage = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  if (showAddProductModal.value) {
    newProduct.coverImage = ''
  } else if (showEditProductModal.value) {
    editingProduct.coverImage = ''
  }
}

const updateProduct = () => {
  try {
    // Validate required fields
    if (!editingProduct.productName.trim() || !editingProduct.category || !editingProduct.price) {
      throw new Error('Product name, category and price are required');
    }

    // Validate price
    if (editingProduct.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    // Validate homepage product limit
    if (editingProduct.showOnHomepage && 
        !validateHomepageProducts(editingProduct.category, editingProduct.id)) {
      throw new Error('Maximum 6 products per category can be shown on homepage');
    }

    const index = productData.value.findIndex(p => p.id === editingProduct.id)
    if (index !== -1) {
      // Update the product while preserving some original values
      productData.value[index] = {
        ...productData.value[index],
        ...editingProduct,
        updatedAt: new Date().toISOString()
      }

      // Update localStorage
      localStorage.setItem('products', JSON.stringify(productData.value))
      
      // Close modal and show success message
      showEditProductModal.value = false
      alert('Product updated successfully!')
    }
  } catch (error) {
    alert(error.message)
  }
}

const saveProduct = () => {
  try {
    // Validate required fields
    if (!newProduct.productName?.trim()) {
      throw new Error('Product name is required');
    }
    if (!newProduct.category) {
      throw new Error('Product category is required');
    }
    if (!newProduct.price || newProduct.price <= 0) {
      throw new Error('Valid price is required');
    }

    // Validate homepage product limit
    if (newProduct.showOnHomepage) {
      const categoryProducts = productData.value.filter(p => 
        p.category === newProduct.category && p.showOnHomepage
      );
      if (categoryProducts.length >= 6) {
        throw new Error('Maximum 6 products per category can be shown on homepage');
      }
    }

    // Create new product object
    const product = {
      id: Date.now().toString(),
      ...newProduct,
      salesVolume: 0,
      viewCount: 0,
      selected: false,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    // Add to productData
    productData.value.push(product);
    
    // Update localStorage
    localStorage.setItem('products', JSON.stringify(productData.value));
    
    // Show success message
    alert('Product added successfully!');
    
    // Close modal and reset form
    showAddProductModal.value = false;
    resetNewProductForm();
  } catch (error) {
    alert(error.message);
  }
};

const openAddProductModal = () => {
  // Reset form values
  resetNewProductForm()
  showAddProductModal.value = true
}

const closeAddProductModal = () => {
  showAddProductModal.value = false
  homepageError.value = ''
}

const router = useRouter()

const backToAdmin = () => {
  router.push('/admin')
}

// Add validation for homepage products
const validateHomepageProducts = (category, currentProductId = null) => {
  const homepageProducts = productData.value.filter(p => 
    p.category === category && 
    p.showOnHomepage && 
    (currentProductId ? p.id !== currentProductId : true)
  )
  return homepageProducts.length < 6
}

// Reset form function
const resetNewProductForm = () => {
  Object.assign(newProduct, {
    category: '',
    displayCategory: '',
    productName: '',
    price: 0,
    coverImage: '',
    overview: '',
    details: '',
    stock: 0,
    showOnHomepage: false
  });
  homepageError.value = ''
}
</script>

<style scoped>
/* Import styles from AdminPortal.css */
@import './AdminPortal.css';

/* Product-specific styles with improved contrast */
.product-management {
  padding: 20px;
}

/* Enhance table header visibility */
.data-table th {
  background-color: #EEF2F6;
  font-weight: 600;
  color: #333333;
  padding: 14px 16px;
}

/* Improved sorting icon visibility */
.sort-icon {
  margin-left: 6px;
  color: #777777;
}

/* Better product image container */
.product-image {
  border: 1px solid #DDDDDD;
  padding: 2px;
  background-color: white;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.error-message {
  color: #ff4d4f;
  margin-top: 5px;
  font-size: 0.9em;
}

.image-preview-container {
  margin-top: 10px;
  position: relative;
  display: inline-block;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.remove-image {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding: 20px;
  border-top: 1px solid #ddd;
  background-color: #f8f9fa;
  position: sticky;
  bottom: 0;
  z-index: 100;
}

.modal-actions button {
  min-width: 100px;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #f1f1f1;
  color: #333;
  border: 1px solid #ddd;
}

.modal-content {
  max-height: 90vh;
  overflow-y: auto;
  padding-bottom: 0; /* Remove bottom padding to accommodate sticky footer */
}

/* Ensure form content doesn't get hidden behind sticky footer */
.styled-form {
  padding-bottom: 80px;
}

.required {
  color: #ff4d4f;
  margin-left: 4px;
}

.form-group {
  margin-bottom: 20px;
}

.styled-input,
.styled-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.styled-input:focus,
.styled-select:focus {
  border-color: #4CAF50;
  outline: none;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}
</style> 