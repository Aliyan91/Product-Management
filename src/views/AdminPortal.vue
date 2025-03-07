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
                   :class="{ 'active': category.isActive }">
                <div class="menu-item-content" @click="toggleCategory(category)">
                  <i :class="category.icon"></i>
                  <span class="menu-text">{{ category.name }}</span>
                </div>
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
                <option value="">All Products</option>
                <option value="inventory">Inventory Products</option>
                <option value="sales">Sales Products</option>
                <option value="views">Most Viewed Products</option>
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
          
          <!-- User Management Content -->
          <div v-if="!isProductManagementActive && !isOrderManagementActive">
            <div class="search-filter">
              <input type="text" 
                     placeholder="Search by username or phone..." 
                     class="search-input"
                     v-model="searchQuery"
                     @input="handleSearch"/>
              <select class="status-select" v-model="statusFilter" @change="filterByStatus">
                <option value="all">All Status</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
              <button class="btn btn-search" @click="performSearch">Search</button>
              <button class="btn btn-primary" @click="openAddUserModal">Add User</button>
            </div>
            
            <div class="data-table">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" @change="toggleSelectAll" v-model="selectAll" /></th>
                    <th @click="sortBy('name')">Username <i class="sort-icon"></i></th>
                    <th @click="sortBy('phone')">Phone Number <i class="sort-icon"></i></th>
                    <th @click="sortBy('registrationTime')">Registration Time <i class="sort-icon"></i></th>
                    <th @click="sortBy('lastLoginTime')">Last Login <i class="sort-icon"></i></th>
                    <th @click="sortBy('status')">Status <i class="sort-icon"></i></th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in filteredTableData" :key="index">
                    <td><input type="checkbox" v-model="item.selected" @change="updateSelectAll" /></td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.phone }}</td>
                    <td>{{ formatDate(item.registrationTime) }}</td>
                    <td>{{ formatDate(item.lastLoginTime) }}</td>
                    <td>
                      <span class="status-badge"
                            :class="item.status === 'Online' ? 'active' : 'inactive'">
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

          <!-- Order Management Content -->
          <div v-if="isOrderManagementActive">
            <div class="search-filter">
              <input type="text" 
                     placeholder="Search by Order ID or Username..." 
                     class="search-input"
                     v-model="searchQuery"
                     @input="handleSearch"/>
              <div class="date-range-filter">
                <input type="date" 
                       v-model="dateFilters.start" 
                       class="styled-input"
                       @change="filterOrders"/>
                <span>to</span>
                <input type="date" 
                       v-model="dateFilters.end" 
                       class="styled-input"
                       @change="filterOrders"/>
              </div>
              <select class="amount-select" v-model="amountFilter" @change="filterByAmount">
                <option value="all">All Amounts</option>
                <option value="0-100">$0 - $100</option>
                <option value="101-500">$101 - $500</option>
                <option value="501-1000">$501 - $1000</option>
                <option value="1001+">$1000+</option>
              </select>
              <button class="btn btn-search" @click="performSearch">Search</button>
              <button class="btn btn-primary" @click="openAddOrderModal">Add Order</button>
            </div>
            
            <div class="data-table">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" @change="toggleSelectAll" v-model="selectAll" /></th>
                    <th @click="sortBy('orderId')">Order ID <i class="sort-icon"></i></th>
                    <th @click="sortBy('username')">Username <i class="sort-icon"></i></th>
                    <th @click="sortBy('productCount')">Products <i class="sort-icon"></i></th>
                    <th @click="sortBy('orderDate')">Order Date <i class="sort-icon"></i></th>
                    <th @click="sortBy('totalAmount')">Total Amount <i class="sort-icon"></i></th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(order, index) in filteredOrderData" :key="index">
                    <td><input type="checkbox" v-model="order.selected" @change="updateSelectAll" /></td>
                    <td>{{ order.orderId }}</td>
                    <td>{{ order.username }}</td>
                    <td>
                      <button class="btn-link" @click="viewOrderDetails(order)">
                        {{ order.products.length }} items
                      </button>
                    </td>
                    <td>{{ formatDate(order.orderDate) }}</td>
                    <td>${{ order.totalAmount.toFixed(2) }}</td>
                    <td>
                      <span class="status-badge"
                            :class="getOrderStatusClass(order.status)">
                        {{ order.status }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn btn-edit" @click="editOrder(order)">Edit</button>
                        <button class="btn btn-delete" @click="deleteOrder(order)">Delete</button>
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
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeEditProductModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Product</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddUserModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New User</h2>
          <button class="close-button" @click="closeAddUserModal">&times;</button>
        </div>
        <form @submit.prevent="saveUser" class="styled-form">
          <div class="form-group">
            <label>Username</label>
            <input v-model="newUser.username" type="text" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="newUser.phone" type="tel" required class="styled-input" 
                   pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number"/>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="newUser.email" type="email" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select v-model="newUser.role" required class="styled-select">
              <option value="" disabled>Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <div class="form-group">
            <label>Department</label>
            <select v-model="newUser.department" required class="styled-select">
              <option value="" disabled>Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="newUser.password" type="password" required class="styled-input" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeAddUserModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save User</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderDetailsModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Order Details - #{{ selectedOrder.orderId }}</h2>
          <button class="close-button" @click="closeOrderDetailsModal">&times;</button>
        </div>
        <div class="order-details">
          <div class="order-info">
            <div class="info-group">
              <label>Order ID:</label>
              <span>{{ selectedOrder.orderId }}</span>
            </div>
            <div class="info-group">
              <label>Username:</label>
              <span>{{ selectedOrder.username }}</span>
            </div>
            <div class="info-group">
              <label>Order Date:</label>
              <span>{{ formatDate(selectedOrder.orderDate) }}</span>
            </div>
            <div class="info-group">
              <label>Status:</label>
              <span :class="getOrderStatusClass(selectedOrder.status)">
                {{ selectedOrder.status }}
              </span>
            </div>
          </div>
          
          <div class="order-products">
            <h3>Products</h3>
            <table class="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in selectedOrder.products" :key="index">
                  <td>{{ product.name }}</td>
                  <td>{{ product.quantity }}</td>
                  <td>${{ product.price.toFixed(2) }}</td>
                  <td>${{ (product.quantity * product.price).toFixed(2) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-right"><strong>Total:</strong></td>
                  <td>${{ selectedOrder.totalAmount.toFixed(2) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Order Modal -->
    <div v-if="showAddOrderModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Order</h2>
          <button class="close-button" @click="closeAddOrderModal">&times;</button>
        </div>
        <form @submit.prevent="saveOrder" class="styled-form">
          <div class="form-group">
            <label>Order ID</label>
            <input v-model="newOrder.orderId" type="text" required class="styled-input" />
          </div>
          
          <div class="form-group">
            <label>Username</label>
            <input v-model="newOrder.username" type="text" required class="styled-input" />
          </div>
          
          <div class="form-group">
            <label>Order Date</label>
            <input v-model="newOrder.orderDate" type="datetime-local" required class="styled-input" />
          </div>
          
          <div class="form-group">
            <label>Status</label>
            <select v-model="newOrder.status" required class="styled-select">
              <option value="" disabled>Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Products</label>
            <div v-for="(product, index) in newOrder.products" :key="index" class="product-entry">
              <div class="product-fields">
                <input v-model="product.name" placeholder="Product Name" required class="styled-input product-name" />
                <input v-model.number="product.quantity" type="number" min="1" placeholder="Qty" required class="styled-input product-qty" />
                <input v-model.number="product.price" type="number" step="0.01" min="0" placeholder="Price" required class="styled-input product-price" />
                <span class="product-subtotal">${{ (product.quantity * product.price).toFixed(2) }}</span>
                <button type="button" class="btn-icon remove-product" @click="removeOrderProduct(index)" v-if="newOrder.products.length > 1">&times;</button>
              </div>
            </div>
            
            <div class="add-product-row">
              <button type="button" class="btn btn-secondary add-product" @click="addOrderProduct">
                <i class="icon-plus"></i> Add Product
              </button>
            </div>
            
            <div class="order-total">
              <span>Total Amount: ${{ calculateOrderTotal() }}</span>
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeAddOrderModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Order</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import Editor from '@tinymce/tinymce-vue'

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
    name: 'Product Management',
    icon: 'icon-box',
    isActive: false,
    path: '/products',
    subcategories: []
  },
  {
    name: 'Category Management',
    icon: 'icon-folder',
    isActive: false,
    path: '/categories',
    subcategories: []
  },
  {
    name: 'Order Management',
    icon: 'icon-shopping-cart',
    isActive: false,
    path: '/orders',
    subcategories: []
  },
  {
    name: 'User Management',
    icon: 'icon-users',
    isActive: false,
    path: '/users',
    subcategories: []
  }
])

// Product-specific data
const productData = ref(JSON.parse(localStorage.getItem('products')) || [])

// Default table data
const currentTableData = ref([
  {
    name: 'John Doe',
    phone: '1234567890',
    email: 'john@example.com',
    type: 'User',
    path: '/users/john',
    status: 'Online',
    registrationTime: '2024-01-15T10:30:00',
    lastLoginTime: '2024-03-20T15:45:00',
    selected: false
  },
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
const showAddUserModal = ref(false)

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

const newUser = reactive({
  username: '',
  phone: '',
  email: '',
  role: '',
  department: '',
  password: '',
  status: 'Offline',
  registrationTime: null,
  lastLoginTime: null
})

// Computed properties
const isProductManagementActive = computed(() => activeSection.value === 'Product Management')
const isOrderManagementActive = computed(() => activeSection.value === 'Order Management')

const filteredProductData = computed(() => {
  let data = [...productData.value]
  
  // First apply search filter if exists
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(item => 
      item.productName.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }
  
  // Apply status filter if not 'all'
  if (statusFilter.value !== 'all') {
    data = data.filter(item => item.status === statusFilter.value)
  }
  
  // Apply display category filter
  if (metricFilter.value) {
    data = data.filter(item => item.displayCategory === metricFilter.value)
  }
  
  return data
})

const filteredTableData = computed(() => {
  let data = [...currentTableData.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(item => 
      item.name.toLowerCase().includes(query) ||
      (item.phone && item.phone.includes(query))
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
  systemCategories.value.forEach(cat => {
    cat.isActive = (cat === category)
  })
  activeSection.value = category.name
  currentPage.value.title = category.name
  navigateTo(category.path)
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
  if (isProductManagementActive.value) {
    // Define CSV headers
    const headers = [
      'Product Name',
      'Category',
      'Price',
      'Stock',
      'Status',
      'Sales Volume',
      'View Count',
      'Show on Homepage'
    ]

    // Convert products to CSV format
    const csvContent = [
      headers.join(','), // Add headers as first row
      ...productData.value.map(product => [
        `"${product.productName}"`,  // Wrap in quotes to handle commas in names
        `"${product.category}"`,
        product.price,
        product.stock,
        `"${product.status}"`,
        product.salesVolume,
        product.viewCount,
        product.showOnHomepage
      ].join(','))
    ].join('\n')

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'products.csv')
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    console.log('Export is only available on the Product Management page')
  }
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
    displayCategory: newProduct.displayCategory,
    price: newProduct.price,
    stock: newProduct.stock,
    status: newProduct.stock > 0 ? 'Active' : 'Inactive',
    selected: false,
    coverImage: newProduct.coverImage,
    overview: newProduct.overview,
    details: newProduct.details,
    showOnHomepage: newProduct.showOnHomepage,
    salesVolume: 0,
    viewCount: 0
  }

  // Add to productData
  productData.value.push(newProductEntry)
  
  // Save to localStorage
  localStorage.setItem('products', JSON.stringify(productData.value))

  // Set the metric filter to match the new product's display category
  metricFilter.value = newProduct.displayCategory

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

// Add new method for removing image
const removeImage = () => {
  if (showAddProductModal.value) {
    newProduct.coverImage = ''
  } else if (showEditProductModal.value) {
    editingProduct.coverImage = ''
  }
}

// Add this to your component's setup
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

// Add these new methods
const openAddUserModal = () => {
  Object.assign(newUser, {
    username: '',
    phone: '',
    email: '',
    role: '',
    department: '',
    password: '',
    status: 'Offline',
    registrationTime: null,
    lastLoginTime: null
  })
  showAddUserModal.value = true
}

const closeAddUserModal = () => {
  showAddUserModal.value = false
}

const saveUser = () => {
  const now = new Date().toISOString()
  const newUserEntry = {
    name: newUser.username,
    phone: newUser.phone,
    email: newUser.email,
    type: newUser.role,
    path: `/users/${newUser.username.toLowerCase()}`,
    status: 'Offline',
    registrationTime: now,
    lastLoginTime: now,
    department: newUser.department,
    selected: false
  }

  currentTableData.value.push(newUserEntry)
  showAddUserModal.value = false
  console.log('User saved:', newUserEntry)
}

// Add this new method for date formatting
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

// Add these to your script setup section
const showOrderDetailsModal = ref(false)
const selectedOrder = ref(null)
const dateFilters = reactive({
  start: '',
  end: ''
})
const amountFilter = ref('all')

// Sample order data
const orderData = ref([
  {
    orderId: 'ORD-2024-001',
    username: 'JohnDoe',
    products: [
      { name: 'Product 1', quantity: 2, price: 29.99 },
      { name: 'Product 2', quantity: 1, price: 49.99 }
    ],
    orderDate: '2024-03-20T10:30:00',
    totalAmount: 109.97,
    status: 'Completed',
    selected: false
  },
  {
    orderId: 'ORD-2024-002',
    username: 'JaneSmith',
    products: [
      { name: 'Product 3', quantity: 1, price: 99.99 }
    ],
    orderDate: '2024-03-21T15:45:00',
    totalAmount: 99.99,
    status: 'Processing',
    selected: false
  },
  {
    orderId: 'ORD-2024-003',
    username: 'RobertJohnson',
    products: [
      { name: 'Product 4', quantity: 3, price: 19.99 },
      { name: 'Product 5', quantity: 2, price: 34.99 },
      { name: 'Product 6', quantity: 1, price: 79.99 }
    ],
    orderDate: '2024-03-22T09:15:00',
    totalAmount: 209.94,
    status: 'Pending',
    selected: false
  }
])

// Computed property for filtered orders
const filteredOrderData = computed(() => {
  let data = [...orderData.value]
  
  // Apply date filter
  if (dateFilters.start && dateFilters.end) {
    data = data.filter(order => {
      const orderDate = new Date(order.orderDate)
      const start = new Date(dateFilters.start)
      const end = new Date(dateFilters.end)
      return orderDate >= start && orderDate <= end
    })
  }
  
  // Apply amount filter
  if (amountFilter.value !== 'all') {
    const [min, max] = amountFilter.value.split('-').map(Number)
    data = data.filter(order => {
      if (amountFilter.value === '1001+') {
        return order.totalAmount > 1000
      }
      return order.totalAmount >= min && order.totalAmount <= max
    })
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(order => 
      order.orderId.toLowerCase().includes(query) ||
      order.username.toLowerCase().includes(query)
    )
  }
  
  // Apply sorting if set
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

// Methods for order management
const viewOrderDetails = (order) => {
  selectedOrder.value = order
  showOrderDetailsModal.value = true
}

const closeOrderDetailsModal = () => {
  showOrderDetailsModal.value = false
  selectedOrder.value = null
}

const filterOrders = () => {
  // Validate that the end date isn't before the start date
  if (dateFilters.start && dateFilters.end) {
    const start = new Date(dateFilters.start)
    const end = new Date(dateFilters.end)
    
    if (end < start) {
      alert('End date cannot be earlier than start date')
      dateFilters.end = dateFilters.start
      return
    }
  }
  
  console.log('Filtering orders by date range:', dateFilters)
}

const filterByAmount = () => {
  console.log('Filtering by amount range:', amountFilter.value)
}

const getOrderStatusClass = (status) => {
  const statusMap = {
    'Completed': 'success',
    'Pending': 'warning',
    'Cancelled': 'danger',
    'Processing': 'info'
  }
  return statusMap[status] || ''
}

const editOrder = (order) => {
  console.log('Editing order:', order.orderId)
}

const deleteOrder = (order) => {
  if (confirm(`Are you sure you want to delete order ${order.orderId}?`)) {
    orderData.value = orderData.value.filter(o => o.orderId !== order.orderId)
    console.log('Deleted order:', order.orderId)
  }
}

// Add these new refs and reactive objects for the new order functionality
const showAddOrderModal = ref(false)
const newOrder = reactive({
  orderId: '',
  username: '',
  products: [{ name: '', quantity: 1, price: 0 }],
  orderDate: '',
  totalAmount: 0,
  status: 'Pending',
  selected: false
})

const openAddOrderModal = () => {
  // Generate a new Order ID
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  // Reset form with default values
  Object.assign(newOrder, {
    orderId: `ORD-${year}${month}${day}-${random}`,
    username: '',
    products: [{ name: '', quantity: 1, price: 0 }],
    orderDate: now.toISOString().slice(0, 16), // Format as YYYY-MM-DDThh:mm
    totalAmount: 0,
    status: 'Pending',
    selected: false
  })
  
  showAddOrderModal.value = true
}

const closeAddOrderModal = () => {
  showAddOrderModal.value = false
}

const addOrderProduct = () => {
  newOrder.products.push({ name: '', quantity: 1, price: 0 })
}

const removeOrderProduct = (index) => {
  newOrder.products.splice(index, 1)
}

const calculateOrderTotal = () => {
  return newOrder.products
    .reduce((total, product) => total + (product.quantity * product.price), 0)
    .toFixed(2)
}

const saveOrder = () => {
  // Calculate the total amount
  newOrder.totalAmount = parseFloat(calculateOrderTotal())
  
  // Create a new order object
  const newOrderEntry = {
    orderId: newOrder.orderId,
    username: newOrder.username,
    products: [...newOrder.products],
    orderDate: new Date(newOrder.orderDate).toISOString(),
    totalAmount: newOrder.totalAmount,
    status: newOrder.status,
    selected: false
  }
  
  // Add to orderData
  orderData.value.push(newOrderEntry)
  
  // Close modal
  showAddOrderModal.value = false
  console.log('Order saved:', newOrderEntry)
}

// Add these new methods for enhanced filter management
const applyFilters = () => {
  console.log('Applying all filters...')
  // This function is purely for UX - the actual filtering is done in the computed property
  // But you could add additional logic here if needed
}

const resetFilters = () => {
  // Reset all filters to default values
  searchQuery.value = ''
  dateFilters.start = ''
  dateFilters.end = ''
  amountFilter.value = 'all'
  console.log('Filters reset')
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

/* Add new styles for file upload */
.file-upload-container {
  width: 100%;
  position: relative;
}

.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-label:hover {
  background-color: #e9ecef;
  border-color: #4CAF50;
}

.file-upload-label i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #6c757d;
}

.file-upload-label span {
  color: #6c757d;
  font-size: 1rem;
}

.image-preview-container {
  position: relative;
  margin-top: 1rem;
  display: inline-block;
}

.preview-image {
  max-width: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.remove-image {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.remove-image:hover {
  background-color: #c82333;
}

/* Rich text editor styles */
:deep(.tox-tinymce) {
  border-radius: 8px !important;
  border: 1px solid #ddd !important;
}

:deep(.tox-tinymce:focus-within) {
  border-color: #4CAF50 !important;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1) !important;
}

/* Make sure the editor is responsive */
:deep(.tox-tinymce) {
  min-height: 300px;
  width: 100% !important;
}

/* Tree-like structure styles */
.menu-section {
  padding: 10px;
}

.menu-item {
  margin-bottom: 5px;
}

.menu-item-content {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item-content:hover {
  background-color: rgba(76, 175, 80, 0.1);
}

.menu-item.active > .menu-item-content {
  background-color: #4CAF50;
  color: white;
}

.menu-text {
  margin-left: 10px;
}

/* Animation for submenu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Icons styling */
i {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* Table styling */
.data-table {
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* Ensure table doesn't get too cramped */
}

.data-table th {
  background-color: #f8f9fa;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #eee;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.3s;
}

.data-table th:hover {
  background-color: #f0f0f0;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

/* Column-specific styling */
.data-table td:nth-child(1), /* Checkbox column */
.data-table th:nth-child(1) {
  width: 40px;
  text-align: center;
}

.data-table td:nth-child(2), /* Product Name */
.data-table th:nth-child(2) {
  min-width: 200px;
}

.data-table td:nth-child(3), /* Price */
.data-table th:nth-child(3) {
  width: 100px;
  text-align: right;
}

.data-table td:nth-child(4), /* Cover Image */
.data-table th:nth-child(4) {
  width: 80px;
  text-align: center;
}

.data-table td:nth-child(5), /* Inventory */
.data-table th:nth-child(5),
.data-table td:nth-child(6), /* Sales */
.data-table th:nth-child(6),
.data-table td:nth-child(7), /* Views */
.data-table th:nth-child(7) {
  width: 100px;
  text-align: right;
}

.data-table td:nth-child(8), /* Actions */
.data-table th:nth-child(8) {
  width: 150px;
  text-align: right;
}

/* Product image styling */
.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  display: block;
  margin: 0 auto;
}

/* Action buttons container */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* Action buttons */
.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.btn-edit:hover {
  background-color: #45a049;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  border: none;
}

.btn-delete:hover {
  background-color: #c82333;
}

/* Status badge */
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactive {
  background-color: #ffebee;
  color: #c62828;
}

/* Checkbox styling */
.data-table input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Sort icon */
.sort-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: 4px;
  vertical-align: middle;
  opacity: 0.5;
}

/* Hover effect for rows */
.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

/* Empty state */
.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* Responsive table container */
@media (max-width: 1024px) {
  .data-table {
    margin: 0 -16px;
    border-radius: 0;
  }
}

/* Add or update these styles in your <style> section */
.search-filter {
  display: grid;
  grid-template-columns: 1fr 150px 200px auto auto;
  gap: 12px;
  align-items: center;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-input {
  height: 38px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.status-select,
.metric-select {
  height: 38px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
}

.btn-search {
  height: 38px;
  padding: 0 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-search:hover {
  background-color: #45a049;
}

.btn-primary {
  height: 38px;
  padding: 0 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #1565c0;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .search-filter {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .search-input {
    grid-column: 1 / -1;
  }
}

/* Add these new styles to your existing styles */
.date-range-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-range-filter input[type="date"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 140px;
}

.btn-link {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.btn-link:hover {
  color: #1565c0;
}

.order-details {
  padding: 20px;
}

.order-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.info-group {
  display: flex;
  flex-direction: column;
}

.info-group label {
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.products-table th,
.products-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.products-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.products-table tfoot td {
  border-top: 2px solid #ddd;
  font-weight: 600;
}

.text-right {
  text-align: right;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.warning {
  background-color: #fff3e0;
  color: #e65100;
}

.status-badge.danger {
  background-color: #ffebee;
  color: #c62828;
}

.status-badge.info {
  background-color: #e3f2fd;
  color: #1565c0;
}

.amount-select {
  height: 38px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  min-width: 150px;
}

.product-entry {
  margin-bottom: 12px;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
}

.product-fields {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr auto;
  gap: 10px;
  align-items: center;
}

.product-name {
  grid-column: 1;
}

.product-qty {
  grid-column: 2;
}

.product-price {
  grid-column: 3;
}

.product-subtotal {
  grid-column: 4;
  text-align: right;
  font-weight: 500;
}

.remove-product {
  grid-column: 5;
  background-color: #dc3545;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-product-row {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
}

.add-product {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #e9ecef;
  color: #333;
  border: 1px dashed #adb5bd;
}

.add-product:hover {
  background-color: #dee2e6;
}

.order-total {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #dee2e6;
  text-align: right;
  font-size: 16px;
  font-weight: 600;
}

.btn-icon {
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.icon-plus {
  font-size: 14px;
}

.filter-label {
  font-weight: 500;
  color: #666;
  margin-right: 8px;
}

.date-range-filter, .amount-filter {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #eee;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

/* Make the search filter grid more responsive */
.search-filter {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 12px;
}

.search-input {
  grid-column: 1 / -1;
}

.date-range-filter {
  grid-column: 1;
}

.amount-filter {
  grid-column: 2;
}

.filter-actions {
  grid-column: 1;
}

.btn-primary {
  grid-column: 2;
  justify-self: end;
}

@media (min-width: 1200px) {
  .search-filter {
    grid-template-columns: 2fr 2fr 1fr 1fr;
    grid-template-rows: auto auto;
  }
  
  .search-input {
    grid-column: 1 / 3;
    grid-row: 1;
  }
  
  .date-range-filter {
    grid-column: 3 / 5;
    grid-row: 1;
  }
  
  .amount-filter {
    grid-column: 1;
    grid-row: 2;
  }
  
  .filter-actions {
    grid-column: 2;
    grid-row: 2;
  }
  
  .btn-primary {
    grid-column: 3 / 5;
    grid-row: 2;
  }
}
</style>