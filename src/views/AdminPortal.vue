<style src="./AdminPortal.css" scoped></style>
<template>
  <div class="admin-container">
    <!-- Top Navigation Bar -->
    <div class="top-navbar">
      <div class="brand-container" @click="navigateTo('/')">
        <h2 class="brand-name">RuoYi</h2>
      </div>
      <div class="menu-toggle" @click="toggleSidebar">
        <i class="icon-menu"></i>
      </div>
      <div class="nav-tabs">
        <div class="nav-tab" 
             v-for="(tab, index) in navTabs" 
             :key="index"
             :class="{ 'active': tab.isActive }"
             @click="activateTab(tab)">
          {{ tab.name }}
          <i v-if="tab.hasDropdown" class="icon-chevron-down"></i>
          <div v-if="tab.hasDropdown && tab.isDropdownOpen" class="dropdown-menu">
            <div v-for="(item, itemIndex) in tab.dropdownItems" 
                 :key="itemIndex" 
                 class="dropdown-item"
                 @click.stop="navigateTo(item.path)">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="nav-controls">
        <button class="btn-icon" title="Documentation" @click="navigateTo('/docs')">
          <i class="icon-help"></i> Docs
        </button>
        <button class="btn-icon" title="Lock Screen" @click="lockScreen">
          <i class="icon-lock"></i> Lock
        </button>
        <button class="btn-icon" title="Full Screen" @click="toggleFullScreen">
          <i class="icon-fullscreen"></i> Full
        </button>
        <div class="user-profile" @click="toggleUserMenu">
          <img src="../assets/admin-icon.png" alt="User profile" class="user-avatar" />
          <span class="user-name">Admin</span>
          <div v-if="isUserMenuOpen" class="user-menu">
            <div class="user-menu-item" @click.stop="navigateTo('/profile')">
              <i class="icon-user"></i> Profile
            </div>
            <div class="user-menu-item" @click.stop="navigateTo('/settings')">
              <i class="icon-settings"></i> Settings
            </div>
            <div class="user-menu-item" @click.stop="logout">
              <i class="icon-logout"></i> Logout
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="content-wrapper">
      <!-- Left Sidebar -->
      <div class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
        <div class="sidebar-header">
          <div class="admin-profile">
            <img src="../assets/admin-icon.png" alt="Admin profile" class="profile-pic"/>
            <div class="admin-info">
              <span class="admin-name">Admin</span>
              <div class="status-actions">
                <i class="status-dot active-dot" title="Active Status"></i>
                <button class="logout-button" @click="logout" title="Logout">
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div class="sidebar-menu">
            <div class="menu-section">
              <div v-for="(category, index) in systemCategories" 
                   :key="index" 
                   class="menu-item"
                   :class="{ 'active': category.isActive }"
                   @click="toggleCategory(category)">
                <div class="menu-item-content">
                  <i :class="category.icon"></i>
                  <span class="menu-text">{{ category.name }}</span>
                  <span class="menu-chevron" v-if="category.subcategories && category.subcategories.length">
                    <i :class="category.isExpanded ? 'icon-chevron-up' : 'icon-chevron-down'"></i>
                  </span>
                </div>
                <transition name="fade">
                  <div v-if="category.isExpanded && category.subcategories && category.subcategories.length"
                       class="submenu">
                    <div v-for="(subcat, subIndex) in category.subcategories"
                         :key="subIndex"
                         class="submenu-item"
                         @click.stop="selectSubcategory(category, subcat)">
                      <i :class="subcat.icon"></i>
                      <span class="menu-text">{{ subcat.name }}</span>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content Area -->
      <div class="main-content">
        <div class="content-header">
          <h1>{{ currentPage.title }}</h1>
          <div class="header-actions">
            <button class="btn btn-primary" @click="addNew">+ New</button>
            <button class="btn btn-secondary" @click="exportData">Export</button>
            <button class="btn btn-danger" @click="clearAllProducts">Clear All Products</button>
          </div>
        </div>
        
        <div class="content-body">
          <!-- Product Management Content -->
          <div v-if="isProductManagementActive">
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
                <option value="">Sort by Metric</option>
                <option value="stock">Inventory (Low to High)</option>
                <option value="stock-desc">Inventory (High to Low)</option>
                <option value="salesVolume">Sales (Low to High)</option>
                <option value="salesVolume-desc">Sales (High to Low)</option>
                <option value="viewCount">Views (Low to High)</option>
                <option value="viewCount-desc">Views (High to Low)</option>
              </select>
              <button class="btn btn-search" @click="performSearch">Search</button>
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
          
          <!-- Default Content for Other Sections -->
          <div v-else>
            <div class="search-filter">
              <input type="text" 
                     placeholder="Search..." 
                     class="search-input"
                     v-model="searchQuery"
                     @input="handleSearch"/>
              <select class="status-select" v-model="statusFilter" @change="filterByStatus">
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button class="btn btn-search" @click="performSearch">Search</button>
            </div>
            
            <div class="data-table">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" @change="toggleSelectAll" v-model="selectAll" /></th>
                    <th @click="sortBy('name')">Name <i class="sort-icon"></i></th>
                    <th @click="sortBy('type')">Type <i class="sort-icon"></i></th>
                    <th @click="sortBy('path')">Path <i class="sort-icon"></i></th>
                    <th @click="sortBy('status')">Status <i class="sort-icon"></i></th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in filteredTableData" :key="index">
                    <td><input type="checkbox" v-model="item.selected" @change="updateSelectAll" /></td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ item.path }}</td>
                    <td>
                      <span class="status-badge"
                            :class="item.status === 'Active' ? 'active' : 'inactive'">
                        {{ item.status }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn btn-edit" @click="editItem(item)">Edit</button>
                        <button class="btn btn-delete" @click="deleteItem(item)">Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
            <label>Product Category</label>
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
            <label>Product Name</label>
            <input v-model="newProduct.productName" type="text" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Price</label>
            <input v-model.number="newProduct.price" type="number" step="0.01" min="0" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Cover Image</label>
            <input type="file" @change="handleImageUpload" accept="image/*" class="styled-file-input" />
          </div>
          <div class="form-group">
            <label>Product Overview</label>
            <textarea v-model="newProduct.overview" required class="styled-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>Product Details</label>
            <textarea v-model="newProduct.details" class="styled-textarea rich-text-editor" required></textarea>
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
            <input type="file" @change="handleEditImageUpload" accept="image/*" class="styled-file-input" />
            <img v-if="editingProduct.coverImage" :src="editingProduct.coverImage" class="preview-image" alt="Preview" />
          </div>
          <div class="form-group">
            <label>Product Overview</label>
            <textarea v-model="editingProduct.overview" required class="styled-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>Product Details</label>
            <textarea v-model="editingProduct.details" class="styled-textarea rich-text-editor" required></textarea>
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
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeEditProductModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Product</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// User profile
const userProfile = reactive({
  name: 'Admin',
  avatar: '../assets/admin-icon.png',
  status: 'Online'
})

// Top navigation tabs
const navTabs = ref([
  { name: 'Home', path: '/', isActive: true, hasDropdown: false, isDropdownOpen: false, dropdownItems: [] },
  { name: 'Parameters', path: '/parameters', isActive: false, hasDropdown: true, isDropdownOpen: false,
    dropdownItems: [
      { name: 'System Parameters', path: '/parameters/system' },
      { name: 'Network Parameters', path: '/parameters/network' },
      { name: 'Security Parameters', path: '/parameters/security' }
    ]
  },
  { name: 'Notifications', path: '/notifications', isActive: false, hasDropdown: true, isDropdownOpen: false,
    dropdownItems: [
      { name: 'All Notifications', path: '/notifications/all' },
      { name: 'Create Notification', path: '/notifications/create' },
      { name: 'Settings', path: '/notifications/settings' }
    ]
  },
  { name: 'Dictionary', path: '/dictionary', isActive: false, hasDropdown: true, isDropdownOpen: false,
    dropdownItems: [
      { name: 'Dictionary List', path: '/dictionary/list' },
      { name: 'Add New', path: '/dictionary/new' }
    ]
  },
  { name: 'Positions', path: '/positions', isActive: false, hasDropdown: true, isDropdownOpen: false,
    dropdownItems: [
      { name: 'Position List', path: '/positions/list' },
      { name: 'Create Position', path: '/positions/create' }
    ]
  },
  { name: 'Departments', path: '/departments', isActive: false, hasDropdown: true, isDropdownOpen: false,
    dropdownItems: [
      { name: 'Department List', path: '/departments/list' },
      { name: 'Create Department', path: '/departments/create' },
      { name: 'Org Chart', path: '/departments/org-chart' }
    ]
  },
  { name: 'Menu Management', path: '/menus', isActive: false, hasDropdown: true, isDropdownOpen: false,
    dropdownItems: [
      { name: 'Menu List', path: '/menus/list' },
      { name: 'Create Menu', path: '/menus/create' }
    ]
  }
])

// Side menu categories
const systemCategories = ref([
  {
    name: 'User Management',
    icon: 'icon-users',
    isActive: true,
    isExpanded: false,
    path: '/users',
    subcategories: [
      { name: 'New User', icon: 'icon-user', path: '/users/new' },
      { name: 'User List', icon: 'icon-list', path: '/users/list' },
      { name: 'User Profile', icon: 'icon-profile', path: '/users/profile' }
    ]
  },
  {
    name: 'Product Management',
    icon: 'icon-box',
    isActive: false,
    isExpanded: false,
    path: '/products',
    subcategories: [
      { name: 'Add Product', icon: 'icon-plus', path: '/products/add' },
      { name: 'Product List', icon: 'icon-list', path: '/products/list' },
      { name: 'Product Details', icon: 'icon-details', path: '/products/details' }
    ]
  },
  {
    name: 'Category Management',
    icon: 'icon-list',
    isActive: false,
    isExpanded: false,
    path: '/categories',
    subcategories: [
      { name: 'New Category', icon: 'icon-plus', path: '/categories/new' },
      { name: 'Category List', icon: 'icon-list', path: '/categories/list' },
      { name: 'Category Edit', icon: 'icon-edit', path: '/categories/edit' }
    ]
  },
  {
    name: 'Order Management',
    icon: 'icon-shopping-cart',
    isActive: false,
    isExpanded: false,
    path: '/orders',
    subcategories: [
      { name: 'New Order', icon: 'icon-plus', path: '/orders/new' },
      { name: 'Order List', icon: 'icon-list', path: '/orders/list' },
      { name: 'Order Details', icon: 'icon-details', path: '/orders/details' }
    ]
  }
])

// Product-specific data
const productData = ref(JSON.parse(localStorage.getItem('products')) || [])

// Default table data
const currentTableData = ref([
  {
    name: 'System Configuration',
    type: 'System',
    path: '/system/config',
    status: 'Active',
    selected: false
  },
  {
    name: 'User List',
    type: 'User',
    path: '/system/users',
    status: 'Active',
    selected: false
  },
  {
    name: 'Role Permissions',
    type: 'Role',
    path: '/system/roles',
    status: 'Active',
    selected: false
  },
  {
    name: 'Backup Settings',
    type: 'System',
    path: '/system/backup',
    status: 'Inactive',
    selected: false
  },
  {
    name: 'API Permissions',
    type: 'API',
    path: '/system/api',
    status: 'Active',
    selected: false
  }
])

// State variables
const currentPage = ref({ title: 'User Management' })
const isSidebarCollapsed = ref(false)
const isUserMenuOpen = ref(false)
const selectAll = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const sortColumn = ref('')
const sortDirection = ref('asc')
const activeSection = ref('User Management')
const showAddProductModal = ref(false)
const homepageError = ref('')
const metricFilter = ref('')
const showEditProductModal = ref(false)

// Add these new refs and reactive objects
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

// Update the newProduct reactive object
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
const isProductManagementActive = computed(() => activeSection.value === 'Product Management')

const filteredProductData = computed(() => {
  let data = [...productData.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(item => 
      item.productName.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value !== 'all') {
    data = data.filter(item => item.status === statusFilter.value)
  }
  
  if (metricFilter.value) {
    const [metric, direction] = metricFilter.value.split('-')
    data.sort((a, b) => {
      if (direction === 'desc') {
        return b[metric] - a[metric]
      }
      return a[metric] - b[metric]
    })
  }
  
  return data
})

const filteredTableData = computed(() => {
  let data = [...currentTableData.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.path.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value !== 'all') {
    data = data.filter(item => item.status === statusFilter.value)
  }
  
  if (sortColumn.value) {
    data.sort((a, b) => {
      if (a[sortColumn.value] < b[sortColumn.value]) {
        return sortDirection.value === 'asc' ? -1 : 1
      }
      if (a[sortColumn.value] > b[sortColumn.value]) {
        return sortDirection.value === 'asc' ? 1 : -1
      }
      return 0
    })
  }
  
  return data
})

// Methods
const activateTab = (tab) => {
  navTabs.value.forEach(t => { if (t !== tab) t.isDropdownOpen = false })
  if (tab.hasDropdown) tab.isDropdownOpen = !tab.isDropdownOpen
  navTabs.value.forEach(t => t.isActive = false)
  tab.isActive = true
  if (!tab.hasDropdown || !tab.isDropdownOpen) navigateTo(tab.path)
}

const navigateTo = (path) => {
  console.log(`Navigating to: ${path}`)
  const pathParts = path.split('/')
  currentPage.value.title = pathParts[pathParts.length - 1].charAt(0).toUpperCase() + 
                           pathParts[pathParts.length - 1].slice(1)
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const lockScreen = () => {
  console.log('Screen locked')
}

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
  }
}

const toggleCategory = (category) => {
  category.isExpanded = !category.isExpanded
  
  if (!category.isExpanded) return
  
  systemCategories.value.forEach(cat => {
    if (cat !== category) cat.isExpanded = false
  })
  
  systemCategories.value.forEach(cat => {
    cat.isActive = (cat === category)
  })
  activeSection.value = category.name
  currentPage.value.title = category.name
}

const selectSubcategory = (category, subcategory) => {
  systemCategories.value.forEach(cat => {
    cat.isActive = false
  })
  category.isActive = true
  activeSection.value = category.name
  currentPage.value.title = `${category.name} - ${subcategory.name}`
  navigateTo(subcategory.path)
}

const logout = () => {
  console.log('Logging out...')
}

const toggleSelectAll = () => {
  if (isProductManagementActive.value) {
    productData.value.forEach(item => item.selected = selectAll.value)
  } else {
    currentTableData.value.forEach(item => item.selected = selectAll.value)
  }
}

const updateSelectAll = () => {
  if (isProductManagementActive.value) {
    selectAll.value = productData.value.every(item => item.selected)
  } else {
    selectAll.value = currentTableData.value.every(item => item.selected)
  }
}

const handleSearch = () => {
  console.log(`Searching for: ${searchQuery.value}`)
}

const performSearch = () => {
  console.log(`Performing search for: ${searchQuery.value}`)
}

const filterByStatus = () => {
  console.log(`Filtering by status: ${statusFilter.value}`)
}

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
  console.log(`Sorting by ${column} in ${sortDirection.value} order`)
}

const addNew = () => {
  console.log('Adding new item')
}

const exportData = () => {
  console.log('Exporting data')
}

const openAddProductModal = () => {
  // Reset form
  Object.assign(newProduct, {
    category: '',
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
  homepageError.value = ''
  showAddProductModal.value = true
}

const closeAddProductModal = () => {
  showAddProductModal.value = false
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

const saveProduct = () => {
  // Validate homepage limit (6 per category)
  if (newProduct.showOnHomepage) {
    const homepageCount = productData.value.filter(p => 
      p.category === newProduct.category && p.showOnHomepage
    ).length
    
    if (homepageCount >= 6) {
      homepageError.value = `Cannot add more than 6 products from ${newProduct.category} category to homepage`
      return
    }
  }

  // Create new product object
  const newProductEntry = {
    productName: newProduct.productName,
    category: newProduct.category,
    price: newProduct.price,
    stock: newProduct.stock,
    status: newProduct.stock > 0 ? 'Active' : 'Inactive',
    selected: false,
    coverImage: newProduct.coverImage,
    overview: newProduct.overview,
    details: newProduct.details,
    showOnHomepage: newProduct.showOnHomepage,
    salesVolume: 0, // Start with 0 for new products
    viewCount: 0    // Start with 0 for new products
  }

  // Add to productData
  productData.value.push(newProductEntry)
  
  // Save to localStorage
  localStorage.setItem('products', JSON.stringify(productData.value))

  // Close modal
  showAddProductModal.value = false
  console.log('Product saved:', newProductEntry)
}

const editItem = (item) => {
  if (isProductManagementActive.value) {
    Object.assign(editingProduct, item)
    showEditProductModal.value = true
  } else {
    console.log(`Editing item: ${item.name}`)
  }
}

const deleteItem = (item) => {
  if (isProductManagementActive.value) {
    console.log(`Deleting product: ${item.productName}`)
    productData.value = productData.value.filter(p => p.productName !== item.productName)
    // Update localStorage after deletion
    localStorage.setItem('products', JSON.stringify(productData.value))
  } else {
    console.log(`Deleting item: ${item.name}`)
    currentTableData.value = currentTableData.value.filter(i => i.name !== item.name)
  }
}

const sortByMetric = () => {
  console.log(`Sorting by metric: ${metricFilter.value}`)
}

const clearAllProducts = () => {
  productData.value = []
  localStorage.setItem('products', JSON.stringify([]))
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

const updateProduct = () => {
  const index = productData.value.findIndex(p => p.productName === editingProduct.productName)
  if (index !== -1) {
    productData.value[index] = { ...editingProduct }
    localStorage.setItem('products', JSON.stringify(productData.value))
    showEditProductModal.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.rich-text-editor {
  min-height: 150px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
}

.product-image {
  object-fit: cover;
}

.metric-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  min-width: 150px;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger:hover {
  background-color: #c82333;
}

.styled-form {
  max-width: 600px;
  margin: 0 auto;
}

.styled-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
  transition: border-color 0.3s;
}

.styled-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.styled-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  min-height: 100px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.styled-file-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
}

.preview-image {
  max-width: 200px;
  margin-top: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.modal-content h2 {
  margin-bottom: 24px;
  color: #2c3e50;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.styled-select:focus,
.styled-input:focus,
.styled-textarea:focus {
  border-color: #4CAF50;
  outline: none;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #45a049;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e8e8e8;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-button:hover {
  background-color: #f5f5f5;
  color: #333;
}

.styled-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

.styled-form {
  display: grid;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
}

.styled-select,
.styled-input,
.styled-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  background-color: white;
}

.styled-select:hover,
.styled-input:hover,
.styled-textarea:hover {
  border-color: #4CAF50;
}

.styled-select:focus,
.styled-input:focus,
.styled-textarea:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s;
  cursor: pointer;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e9ecef;
  border-color: #ccc;
}
</style>