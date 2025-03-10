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
    <div class="debug-info">
      <p>Total categories: {{ categories.length }}</p>
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
    <div v-if="showAddCategoryModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Category</h2>
          <button class="close-button" @click="closeAddCategoryModal">&times;</button>
        </div>
        <form @submit.prevent="saveCategory" class="styled-form">
          <div class="form-group">
            <label>Category Name*</label>
            <input 
              v-model.trim="newCategory.name" 
              type="text" 
              required 
              class="styled-input"
              placeholder="Enter category name" 
            />
          </div>
          <div class="form-group">
            <label>Category Code*</label>
            <input 
              v-model.trim="newCategory.code" 
              type="text" 
              required 
              class="styled-input"
              placeholder="Enter category code" 
            />
          </div>
          <div class="form-group">
            <label>Parent Category</label>
            <select v-model="newCategory.parent" class="styled-select">
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
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model.trim="newCategory.description" 
              class="styled-textarea"
              placeholder="Enter category description"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Status*</label>
            <select v-model="newCategory.status" required class="styled-select">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="form-group">
            <label>Sort Order*</label>
            <input 
              v-model.number="newCategory.displayOrder" 
              type="number" 
              min="0" 
              required 
              class="styled-input" 
            />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeAddCategoryModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Category</button>
          </div>
        </form>
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
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.status-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  min-width: 120px;
}

/* Data table styles */
.data-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f8f9fa;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #ddd;
}

td {
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
  color: #444;
}

tr:hover {
  background-color: #f8f9fa;
}

/* Status badge */
.status-badge {
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background-color: rgba(46, 139, 87, 0.15);
  color: #2E8B57;
}

.status-badge.inactive {
  background-color: rgba(211, 47, 47, 0.15);
  color: #D32F2F;
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
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.btn-secondary {
  background-color: #f1f1f1;
  color: #333;
  border: 1px solid #ccc;
  cursor: pointer;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding-bottom: 70px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

/* Form styles */
.styled-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
}

.styled-input,
.styled-select,
.styled-textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.styled-textarea {
  min-height: 100px;
  resize: vertical;
}

/* Modal actions */
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
}

/* Notification styles */
.notification {
  padding: 12px 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  font-weight: 500;
  animation: fadeIn 0.3s ease-out;
  position: relative;
}

.notification.success {
  background-color: rgba(76, 175, 80, 0.15);
  color: #2E8B57;
  border-left: 4px solid #4CAF50;
}

.notification.error {
  background-color: rgba(211, 47, 47, 0.15);
  color: #D32F2F;
  border-left: 4px solid #D32F2F;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Debug info and no categories message */
.debug-info,
.no-categories {
  background-color: white;
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