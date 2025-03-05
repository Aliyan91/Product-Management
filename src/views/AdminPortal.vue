<template>
    <div class="admin-container">
      <div class="sidebar">
        <div class="sidebar-header">
          <div class="admin-profile">
            <img 
              :src="userProfile.avatar" 
              :alt="userProfile.name + ' profile'" 
              class="profile-pic"
            />
            <div class="admin-info">
              <span class="admin-name">{{ userProfile.name }}</span>
              <span class="admin-status">{{ userProfile.status }}</span>
            </div>
          </div>
        </div>
        
        <div class="sidebar-menu">
          <div class="menu-section">
            <div 
              v-for="(category, index) in systemCategories" 
              :key="index" 
              class="menu-item"
              :class="{ 'active': category.isActive }"
              @click="selectCategory(category)"
            >
              <i :class="category.icon"></i>
              {{ category.name }}
              <span class="menu-chevron">
                <i 
                  v-if="category.subcategories && category.subcategories.length"
                  :class="category.isExpanded ? 'icon-chevron-up' : 'icon-chevron-down'"
                ></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="main-content">
        <div class="content-header">
          <h1>{{ currentPage.title }}</h1>
          <div class="header-actions">
            <button class="btn btn-primary">+ New</button>
            <button class="btn btn-secondary">Export</button>
          </div>
        </div>
        
        <div class="content-body">
          <div class="search-filter">
            <input 
              type="text" 
              placeholder="Search..." 
              class="search-input"
            />
            <select class="status-select">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <button class="btn btn-search">Search</button>
          </div>
          
          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Path</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in currentTableData" :key="index">
                  <td><input type="checkbox" /></td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.path }}</td>
                  <td>
                    <span 
                      class="status-badge"
                      :class="item.status === 'Active' ? 'active' : 'inactive'"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-edit">Edit</button>
                      <button class="btn btn-delete">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  
  const userProfile = reactive({
    name: 'Admin User',
    avatar: '../assets/default-avatar.png',
    status: 'Online'
  })
  
  const systemCategories = ref([
    {
      name: 'System Management',
      icon: 'icon-settings',
      isActive: true,
      isExpanded: true,
      path: '/system'
    },
    {
      name: 'User Management',
      icon: 'icon-users',
      isActive: false,
      isExpanded: false,
      path: '/users'
    },
    {
      name: 'Role Management',
      icon: 'icon-user-check',
      isActive: false,
      isExpanded: false,
      path: '/roles'
    },
    {
      name: 'Menu Management',
      icon: 'icon-menu',
      isActive: false,
      isExpanded: false,
      path: '/menus'
    }
  ])
  
  const currentPage = ref({ title: 'System Management' })
  
  const currentTableData = ref([
    {
      name: 'System Configuration',
      type: 'System',
      path: '/system/config',
      status: 'Active'
    },
    {
      name: 'User List',
      type: 'User',
      path: '/system/users',
      status: 'Active'
    },
    {
      name: 'Role Permissions',
      type: 'Role',
      path: '/system/roles',
      status: 'Active'
    }
  ])
  
  const selectCategory = (category) => {
    systemCategories.value.forEach(cat => {
      cat.isActive = false
      cat.isExpanded = false
    })
    
    category.isActive = true
    category.isExpanded = true
    
    currentPage.value.title = category.name
  }
  </script>
  
  <style scoped>
  .admin-container {
    display: flex;
    height: 100vh;
    background-color: #f4f5f7;
  }
  
  .sidebar {
    width: 250px;
    background-color: #2d3748;
    color: white;
    overflow-y: auto;
  }
  
  .sidebar-header {
    padding: 20px;
    background-color: #1a202c;
  }
  
  .admin-profile {
    display: flex;
    align-items: center;
  }
  
  .profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .menu-item {
    padding: 12px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.3s;
  }
  
  .menu-item.active {
    background-color: #4a5568;
  }
  
  .main-content {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
  }
  
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .search-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .data-table {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  
  .data-table table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .data-table th, .data-table td {
    padding: 12px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .status-badge {
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8em;
  }
  
  .status-badge.active {
    background-color: #48bb78;
    color: white;
  }
  
  .status-badge.inactive {
    background-color: #f56565;
    color: white;
  }
  
  .btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #3182ce;
    color: white;
    border: none;
  }
  
  .btn-secondary {
    background-color: #edf2f7;
    color: #2d3748;
    border: 1px solid #cbd5e0;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
  }
  
  .btn-edit {
    background-color: #48bb78;
    color: white;
    border: none;
  }
  
  .btn-delete {
    background-color: #f56565;
    color: white;
    border: none;
  }
  </style>