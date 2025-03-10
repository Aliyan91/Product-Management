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
                <div class="menu-item-content" @click="navigateToCategory(category)">
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
        <!-- Display dashboard when no specific component is loaded -->
        <div v-if="!$route.path.includes('/products') && 
                   !$route.path.includes('/categories') && 
                   !$route.path.includes('/orders') && 
                   !$route.path.includes('/users')" class="dashboard-content">
        <div class="content-header">
            <h1>Dashboard</h1>
          <div class="header-actions">
              <button class="btn btn-secondary">
                <i class="icon-calendar"></i> Last 30 Days
                      </button>
              <button class="btn btn-primary">
                <i class="icon-refresh"></i> Refresh
              </button>
      </div>
    </div>

          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-header">
                <h3 class="stat-title">Total Products</h3>
                <div class="stat-icon primary">
                  <i class="icon-box"></i>
        </div>
          </div>
              <div class="stat-value">{{ stats.totalProducts }}</div>
              <div class="stat-change" :class="{ 'positive': stats.productGrowth >= 0, 'negative': stats.productGrowth < 0 }">
                <i :class="stats.productGrowth >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'"></i>
                {{ Math.abs(stats.productGrowth).toFixed(1) }}% from last month
      </div>
    </div>

            <div class="stat-card">
              <div class="stat-header">
                <h3 class="stat-title">Total Orders</h3>
                <div class="stat-icon success">
                  <i class="icon-shopping-cart"></i>
        </div>
          </div>
              <div class="stat-value">{{ stats.totalOrders }}</div>
              <div class="stat-change" :class="{ 'positive': stats.orderGrowth >= 0, 'negative': stats.orderGrowth < 0 }">
                <i :class="stats.orderGrowth >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'"></i>
                {{ Math.abs(stats.orderGrowth).toFixed(1) }}% from last month
      </div>
    </div>

            <div class="stat-card">
              <div class="stat-header">
                <h3 class="stat-title">Total Users</h3>
                <div class="stat-icon warning">
                  <i class="icon-users"></i>
        </div>
          </div>
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-change" :class="{ 'positive': stats.userGrowth >= 0, 'negative': stats.userGrowth < 0 }">
                <i :class="stats.userGrowth >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'"></i>
                {{ Math.abs(stats.userGrowth).toFixed(1) }}% from last month
      </div>
    </div>

            <div class="stat-card">
              <div class="stat-header">
                <h3 class="stat-title">Revenue</h3>
                <div class="stat-icon danger">
                  <i class="icon-dollar"></i>
        </div>
            </div>
              <div class="stat-value">${{ stats.totalRevenue.toFixed(2) }}</div>
              <div class="stat-change" :class="{ 'positive': stats.revenueGrowth >= 0, 'negative': stats.revenueGrowth < 0 }">
                <i :class="stats.revenueGrowth >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'"></i>
                {{ Math.abs(stats.revenueGrowth).toFixed(1) }}% from last month
            </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Recent Activities</h3>
              <button class="btn-link">View All</button>
            </div>
            <div class="card-body">
            <table class="products-table">
              <thead>
                <tr>
                    <th>Activity</th>
                    <th>User</th>
                    <th>Time</th>
                    <th>Status</th>
                </tr>
              </thead>
              <tbody>
                  <tr v-for="(activity, index) in recentActivities" :key="index">
                    <td>{{ activity.description }}</td>
                    <td>{{ activity.user }}</td>
                    <td>{{ formatTime(activity.time) }}</td>
                    <td>
                      <span class="status-badge" :class="activity.status.toLowerCase()">
                        {{ activity.status }}
                      </span>
                    </td>
                </tr>
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
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

// Side menu categories with proper routing paths
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

// State variables
const isSidebarCollapsed = ref(false)
const isUserMenuOpen = ref(false)

// Activity tracking
const recentActivities = ref([])
const stats = reactive({
  totalProducts: 0,
  totalOrders: 0,
  totalUsers: 0,
  totalRevenue: 0,
  productGrowth: 0,
  orderGrowth: 0,
  userGrowth: 0,
  revenueGrowth: 0
})

// Computed properties for statistics
const statistics = computed(() => {
  // Get data from localStorage
  const products = JSON.parse(localStorage.getItem('products')) || []
  const orders = JSON.parse(localStorage.getItem('orders')) || []
  const users = JSON.parse(localStorage.getItem('users')) || []
  
  // Calculate current month and last month
  const now = new Date()
  const currentMonth = now.getMonth()
  const lastMonth = currentMonth - 1
  
  // Filter data by month
  const currentMonthOrders = orders.filter(order => 
    new Date(order.createdAt).getMonth() === currentMonth
  )
  const lastMonthOrders = orders.filter(order => 
    new Date(order.createdAt).getMonth() === lastMonth
  )
  
  // Calculate revenue
  const currentRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0)
  const lastRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0)
  
  // Calculate growth percentages
  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 100
    return ((current - previous) / previous) * 100
  }
  
  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue: currentRevenue,
    productGrowth: calculateGrowth(products.length, products.length - 1),
    orderGrowth: calculateGrowth(currentMonthOrders.length, lastMonthOrders.length),
    userGrowth: calculateGrowth(users.length, users.length - 1),
    revenueGrowth: calculateGrowth(currentRevenue, lastRevenue)
  }
})

// Function to track activities
const trackActivity = (activity) => {
  const newActivity = {
    ...activity,
    time: new Date().toISOString()
  }
  
  // Add to recent activities
  recentActivities.value.unshift(newActivity)
  
  // Keep only last 10 activities
  if (recentActivities.value.length > 10) {
    recentActivities.value.pop()
  }
  
  // Save to localStorage
  localStorage.setItem('recentActivities', JSON.stringify(recentActivities.value))
}

// Watch for changes in localStorage
const setupStorageListener = () => {
  window.addEventListener('storage', (e) => {
    if (e.key === 'products') {
      const products = JSON.parse(e.newValue || '[]')
      stats.totalProducts = products.length
    }
    if (e.key === 'orders') {
      const orders = JSON.parse(e.newValue || '[]')
      stats.totalOrders = orders.length
      // Recalculate revenue
      stats.totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    }
    if (e.key === 'users') {
      const users = JSON.parse(e.newValue || '[]')
      stats.totalUsers = users.length
    }
  })
}

// Initialize data on component mount
onMounted(() => {
  // Load recent activities from localStorage
  const savedActivities = localStorage.getItem('recentActivities')
  if (savedActivities) {
    recentActivities.value = JSON.parse(savedActivities)
  }
  
  // Set up storage listener
  setupStorageListener()
  
  // Initial statistics calculation
  const currentStats = statistics.value
  Object.assign(stats, currentStats)
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
  router.push(path)
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

// Updated to use router navigation
const navigateToCategory = (category) => {
  systemCategories.value.forEach(cat => {
    cat.isActive = (cat === category)
  })
  // Navigate to the corresponding route
  router.push(category.path)
}

const logout = () => {
  console.log('Logging out...')
  // Clear admin authentication
  localStorage.removeItem('isAdminAuthenticated')
  // Redirect to login page
  router.push('/admin/login')
}

// Add this helper function for formatting time
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000) // difference in seconds

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 172800) return 'Yesterday'
  
  return date.toLocaleDateString()
}
</script>

<style scoped>
/* Add these styles for better visualization */
.stat-change.positive {
  color: #4CAF50;
}

.stat-change.negative {
  color: #f44336;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.completed {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.status-badge.processing {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.status-badge.pending {
  background-color: rgba(255, 152, 0, 0.1);
  color: #FF9800;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-logout {
  background-color: #f44336;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-logout:hover {
  background-color: #d32f2f;
}
</style>
