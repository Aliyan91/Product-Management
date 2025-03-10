<template>
  <div class="category-management">
    <div class="content-header">
      <h1>Category Management</h1>
      <div class="back-button-container">
        <button class="btn btn-back" @click="backToAdmin">
          <i class="icon-arrow-left"></i> Back to Admin
        </button>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="openAddCategoryModal">Add Category</button>
        <button class="btn btn-secondary" @click="exportData">Export</button>
      </div>
    </div>
    
    <!-- Add debug info -->
    <div v-if="categories.length === 0" class="no-categories">
      <p>No categories found. Add your first category!</p>
    </div>
    
    <!-- Show category count -->
    <div class="debug-info bg-gray-700">
      <p class="text-gray-200">Total categories: {{ categories.length }}</p>
    </div>
    
    <div class="content-body">
      <!-- Notification -->
      <div v-if="notification.show" class="notification" :class="notification.type">
        {{ notification.message }}
      </div>
      
      <!-- Search and filter -->
      <div class="search-filter">
        <input type="text" 
               placeholder="Search by category name..." 
               class="search-input"
               v-model="searchQuery"
               @input="handleSearch"/>
        <select class="status-select" v-model="statusFilter" @change="filterByStatus">
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      
      <!-- Data table -->
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" @change="toggleSelectAll" v-model="selectAll" /></th>
              <th @click="sortBy('name')">Category Name <i class="sort-icon"></i></th>
              <th @click="sortBy('displayOrder')">Sort Order <i class="sort-icon"></i></th>
              <th @click="sortBy('parent')">Parent Category <i class="sort-icon"></i></th>
              <th @click="sortBy('productCount')">Products <i class="sort-icon"></i></th>
              <th @click="sortBy('status')">Status <i class="sort-icon"></i></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in filteredCategories" :key="index">
              <td><input type="checkbox" v-model="category.selected" @change="updateSelectAll" /></td>
              <td>{{ category.name }}</td>
              <td>{{ category.displayOrder }}</td>
              <td>{{ category.parent || 'None' }}</td>
              <td>{{ category.productCount }}</td>
              <td>
                <span class="status-badge"
                      :class="category.status === 'Active' ? 'active' : 'inactive'">
                  {{ category.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-edit" @click="editCategory(category)">Edit</button>
                  <button class="btn btn-delete" @click="deleteCategory(category)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Category Modal -->
    <div v-if="showAddCategoryModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm"></div>
        </div>

        <!-- Modal panel -->
        <div class="inline-block transform overflow-hidden rounded-lg bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 w-full text-center sm:mt-0 sm:text-left">
                <div class="flex items-center justify-between border-b border-gray-700 pb-4">
                  <h3 class="text-xl font-semibold leading-6 text-white">
                    Add New Category
                  </h3>
                  <button 
                    @click="closeAddCategoryModal" 
                    class="rounded-md bg-gray-800 p-1 text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <span class="sr-only">Close</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Form -->
                <form @submit.prevent="saveCategory" class="mt-4 space-y-6">
                  <!-- Category Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200">
                      Category Name<span class="ml-1 text-red-500">*</span>
                    </label>
                    <input 
                      v-model.trim="newCategory.name"
                      type="text"
                      required
                      placeholder="Enter category name"
                      class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <!-- Category Code -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200">
                      Category Code<span class="ml-1 text-red-500">*</span>
                    </label>
                    <input 
                      v-model.trim="newCategory.code"
                      type="text"
                      required
                      placeholder="Enter category code"
                      class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <!-- Parent Category -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200">
                      Parent Category
                    </label>
                    <select 
                      v-model="newCategory.parent"
                      class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">None</option>
                      <option 
                        v-for="cat in categories" 
                        :key="cat.id" 
                        :value="cat.name"
                        :disabled="cat.parent"
                      >
                        {{ cat.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Description -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200">
                      Description
                    </label>
                    <textarea 
                      v-model.trim="newCategory.description"
                      rows="4"
                      placeholder="Enter category description"
                      class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>

                  <!-- Status -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200">
                      Status<span class="ml-1 text-red-500">*</span>
                    </label>
                    <select 
                      v-model="newCategory.status"
                      required
                      class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <!-- Sort Order -->
                  <div>
                    <label class="block text-sm font-medium text-gray-200">
                      Sort Order<span class="ml-1 text-red-500">*</span>
                    </label>
                    <input 
                      v-model.number="newCategory.displayOrder"
                      type="number"
                      min="0"
                      required
                      class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="submit"
              @click="saveCategory"
              class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
              :class="{ 'opacity-75 cursor-not-allowed': isLoading }"
              :disabled="isLoading"
            >
              <svg
                v-if="isLoading"
                class="mr-2 h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isLoading ? 'Saving...' : 'Save Category' }}
            </button>
            <button
              type="button"
              @click="closeAddCategoryModal"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Category Modal -->
    <div v-if="showEditCategoryModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Category</h2>
          <button class="close-button" @click="closeEditCategoryModal">&times;</button>
        </div>
        <form @submit.prevent="updateCategory" class="styled-form">
          <div class="form-group">
            <label>Category Name*</label>
            <input 
              v-model.trim="editingCategory.name" 
              type="text" 
              required 
              class="styled-input"
              placeholder="Enter category name" 
            />
          </div>
          <div class="form-group">
            <label>Category Code*</label>
            <input 
              v-model.trim="editingCategory.code" 
              type="text" 
              required 
              class="styled-input"
              placeholder="Enter category code" 
            />
          </div>
          <div class="form-group">
            <label>Parent Category</label>
            <select v-model="editingCategory.parent" class="styled-select">
              <option value="">None</option>
              <option 
                v-for="cat in categories" 
                :key="cat.id" 
                :value="cat.name"
                :disabled="cat.parent || cat.name === editingCategory.name"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model.trim="editingCategory.description" 
              class="styled-textarea"
              placeholder="Enter category description"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Status*</label>
            <select v-model="editingCategory.status" required class="styled-select">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="form-group">
            <label>Sort Order*</label>
            <input 
              v-model.number="editingCategory.displayOrder" 
              type="number" 
              min="0" 
              required 
              class="styled-input" 
            />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeEditCategoryModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Category</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Core state
const categories = ref([]);
const showAddCategoryModal = ref(false)
const showEditCategoryModal = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const sortColumn = ref('displayOrder')
const sortDirection = ref('asc')

// Add debug logging
console.log('CategoryManagement component loaded');

// Notification state
const notification = reactive({
  show: false,
  message: '',
  type: 'success'
})

// Form data
const newCategory = reactive({
  name: '',
  code: '',
  parent: '',
  description: '',
  status: 'Active',
  displayOrder: 0
})

const editingCategory = reactive({
  originalName: '',
  name: '',
  code: '',
  parent: '',
  description: '',
  status: 'Active',
  displayOrder: 0
})

// Load data on mount with debug logging
onMounted(() => {
  console.log('CategoryManagement mounted');
  try {
    const storedCategories = localStorage.getItem('categories');
    console.log('Stored categories:', storedCategories);
    if (storedCategories) {
      categories.value = JSON.parse(storedCategories);
      console.log('Parsed categories:', categories.value);
    }
  } catch (error) {
    console.error('Error loading categories:', error);
    showNotification('Error loading categories', 'error');
  }
});

// Computed properties
const filteredCategories = computed(() => {
  let data = [...categories.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(cat => 
      cat.name.toLowerCase().includes(query) ||
      cat.code.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value !== 'all') {
    data = data.filter(cat => cat.status === statusFilter.value)
  }
  
  if (sortColumn.value) {
    data.sort((a, b) => {
      if (a[sortColumn.value] < b[sortColumn.value]) return sortDirection.value === 'asc' ? -1 : 1
      if (a[sortColumn.value] > b[sortColumn.value]) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }
  
  return data
})

// Helper functions
const showNotification = (message, type = 'success') => {
  notification.message = message;
  notification.type = type;
  notification.show = true;
  setTimeout(() => notification.show = false, 3000);
}

const resetNewCategory = () => {
  Object.assign(newCategory, {
    name: '',
    code: '',
    parent: '',
    description: '',
    status: 'Active',
    displayOrder: categories.value.length + 1
  });
}

const resetEditingCategory = () => {
  Object.assign(editingCategory, {
    originalName: '',
    name: '',
    code: '',
    parent: '',
    description: '',
    status: 'Active',
    displayOrder: 0
  });
}

// Core CRUD operations
const saveCategory = async () => {
  try {
    // Validate required fields
    if (!newCategory.name.trim() || !newCategory.code.trim()) {
      throw new Error('Name and Code are required fields');
    }

    // Check for duplicate name or code
    const isDuplicateName = categories.value.some(cat => 
      cat.name.toLowerCase() === newCategory.name.toLowerCase()
    );
    const isDuplicateCode = categories.value.some(cat => 
      cat.code.toLowerCase() === newCategory.code.toLowerCase()
    );

    if (isDuplicateName) {
      throw new Error('A category with this name already exists');
    }
    if (isDuplicateCode) {
      throw new Error('A category with this code already exists');
    }

    // Create new category with all fields
    const newCategoryEntry = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      code: newCategory.code.trim(),
      parent: newCategory.parent,
      description: newCategory.description?.trim() || '',
      status: newCategory.status,
      displayOrder: newCategory.displayOrder,
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString(),
      productCount: 0,
      selected: false
    };

    // Add to categories array
    categories.value.push(newCategoryEntry);
    
    // Update localStorage
    localStorage.setItem('categories', JSON.stringify(categories.value));
    
    // Show success message and close modal
    showNotification('Category added successfully');
    showAddCategoryModal.value = false;
    resetNewCategory();
  } catch (error) {
    showNotification(error.message, 'error');
  }
};

const editCategory = (category) => {
  Object.assign(editingCategory, {
    originalName: category.name,
    name: category.name,
    code: category.code,
    parent: category.parent || '',
    description: category.description || '',
    status: category.status,
    displayOrder: category.displayOrder
  });
  
  showEditCategoryModal.value = true;
}

const updateCategory = async () => {
  try {
    // Validate required fields
    if (!editingCategory.name.trim() || !editingCategory.code.trim()) {
      throw new Error('Name and Code are required fields');
    }

    // Check for duplicate name and code (excluding current category)
    const isDuplicateName = categories.value.some(cat => 
      cat.name.toLowerCase() === editingCategory.name.toLowerCase() &&
      cat.name !== editingCategory.originalName
    );
    const isDuplicateCode = categories.value.some(cat => 
      cat.code.toLowerCase() === editingCategory.code.toLowerCase() &&
      cat.name !== editingCategory.originalName
    );

    if (isDuplicateName) {
      throw new Error('A category with this name already exists');
    }
    if (isDuplicateCode) {
      throw new Error('A category with this code already exists');
    }

    // Find category index
    const index = categories.value.findIndex(cat => 
      cat.name === editingCategory.originalName
    );
    
    if (index === -1) {
      throw new Error('Category not found');
    }

    // Update the category
    const updatedCategory = {
      ...categories.value[index],
      name: editingCategory.name.trim(),
      code: editingCategory.code.trim(),
      parent: editingCategory.parent,
      description: editingCategory.description?.trim() || '',
      status: editingCategory.status,
      displayOrder: editingCategory.displayOrder,
      updatedTime: new Date().toISOString()
    };

    // Update in array
    categories.value[index] = updatedCategory;

    // Update child categories if parent name changed
    if (editingCategory.name !== editingCategory.originalName) {
      categories.value.forEach(cat => {
        if (cat.parent === editingCategory.originalName) {
          cat.parent = editingCategory.name;
        }
      });
    }

    // Update localStorage
    localStorage.setItem('categories', JSON.stringify(categories.value));
    
    // Show success message and close modal
    showNotification('Category updated successfully');
    showEditCategoryModal.value = false;
    resetEditingCategory();
  } catch (error) {
    showNotification(error.message, 'error');
  }
};

const deleteCategory = async (category) => {
  try {
    // Check for child categories
    const hasChildren = categories.value.some(cat => 
      cat.parent === category.name
    );
    
    if (hasChildren) {
      throw new Error('Cannot delete category with child categories. Please remove or reassign child categories first.');
    }

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    // Remove from array
    categories.value = categories.value.filter(cat => cat.name !== category.name);

    // Update localStorage
    localStorage.setItem('categories', JSON.stringify(categories.value));
    
    // Show success message
    showNotification('Category deleted successfully');
  } catch (error) {
    showNotification(error.message, 'error');
  }
};

// Modal controls
const openAddCategoryModal = () => {
  resetNewCategory();
  showAddCategoryModal.value = true;
}

const closeAddCategoryModal = () => {
  showAddCategoryModal.value = false;
}

const closeEditCategoryModal = () => {
  showEditCategoryModal.value = false;
  resetEditingCategory();
}

// Navigation
const router = useRouter()
const backToAdmin = () => router.push('/admin')
</script>

<style scoped>
/* Import styles from AdminPortal.css */
@import './AdminPortal.css';

/* Category-specific styles with better contrast */
.category-management {
  padding: 20px;
  width: 100%;
}

/* Content header with title on left */
.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.content-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  order: -1;
  margin-right: auto;
}

.back-button-container {
  margin-right: 15px;
  order: 0;
}

.header-actions {
  order: 1;
}

/* Search and filter section */
.search-filter {
  background-color: #1a1f37;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.search-input {
  background-color: #252e47;
  border: 1px solid #353e59;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  width: 300px;
  font-size: 14px;
}

.search-input::placeholder {
  color: #8a8d98;
}

.status-select {
  background-color: #252e47;
  border: 1px solid #353e59;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  min-width: 150px;
  font-size: 14px;
}

/* Data table styles */
.data-table {
  background-color: #1a1f37;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 24px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th {
  background-color: #252e47;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #ffffff;
  border-bottom: 2px solid #353e59;
}

td {
  padding: 16px;
  color: #e4e6eb;
  border-bottom: 1px solid #353e59;
}

tr:hover {
  background-color: #252e47;
}

/* Status badge */
.status-badge {
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;
  display: inline-flex;
  align-items: center;
}

.status-badge.active {
  background-color: rgba(46, 213, 115, 0.15);
  color: #2ed573;
}

.status-badge.inactive {
  background-color: rgba(255, 71, 87, 0.15);
  color: #ff4757;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
}

.btn-edit:hover {
  background-color: #1976D2;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
}

.btn-delete:hover {
  background-color: #d32f2f;
}

/* Button styles */
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #4338ca;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #252e47;
  color: #e4e6eb;
  border: 1px solid #353e59;
}

.btn-secondary:hover {
  background-color: #2a3349;
  transform: translateY(-1px);
}

/* Modal styling improvements */
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: #1a1f37;
  max-width: 500px;
  width: 90%;
  border-radius: 12px;
  border: 1px solid #353e59;
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #353e59;
}

.modal-header h2 {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #8a8d98;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-button:hover {
  color: #ffffff;
  background-color: #252e47;
}

/* Form styling within modal */
.styled-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #e4e6eb;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group label .required {
  color: #ff4757;
  margin-left: 4px;
}

.styled-input,
.styled-select,
.styled-textarea {
  background-color: #252e47;
  border: 1px solid #353e59;
  color: #e4e6eb;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  transition: all 0.2s ease;
}

.styled-input::placeholder,
.styled-select::placeholder,
.styled-textarea::placeholder {
  color: #8a8d98;
}

.styled-input:focus,
.styled-select:focus,
.styled-textarea:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  outline: none;
}

.styled-textarea {
  min-height: 120px;
  resize: vertical;
}

.styled-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a8d98' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

.styled-select option {
  background-color: #1a1f37;
  color: #e4e6eb;
}

/* Modal actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #353e59;
}

.modal-actions button {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

/* Notification styles */
.notification {
  padding: 16px 24px;
  border-radius: 8px;
  font-weight: 500;
  margin-bottom: 24px;
}

.notification.success {
  background-color: rgba(46, 213, 115, 0.1);
  color: #2ed573;
  border-left: 4px solid #2ed573;
}

.notification.error {
  background-color: rgba(255, 71, 87, 0.1);
  color: #ff4757;
  border-left: 4px solid #ff4757;
}

/* Debug info and no categories message */
.debug-info,
.no-categories {
  
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.no-categories {
  text-align: center;
  color: #666;
  padding: 32px;
}

/* Responsive styles */
@media screen and (max-width: 1024px) {
  .content-body {
    padding: 15px;
  }
  
  .search-filter {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .search-filter input, 
  .search-filter select, 
  .search-filter button {
    width: 100%;
    margin: 0;
  }
}

@media screen and (max-width: 768px) {
  .data-table {
    overflow-x: auto;
  }
  
  table {
    min-width: 700px;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    align-self: flex-end;
  }
  
  .modal-content {
    width: 90%;
    max-width: 500px;
  }
}

@media screen and (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
    gap: 5px;
  }
  
  .modal-content {
    width: 95%;
    padding: 15px;
  }
}
</style> 