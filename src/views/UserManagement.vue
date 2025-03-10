<template>
  <div class="user-management">
    <div class="content-header">
      <div class="back-button-container">
        <button class="btn btn-back" @click="backToAdmin">
          <i class="icon-arrow-left"></i> Back to Admin
        </button>
      </div>
      <h1>User Management</h1>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="exportData">Export</button>
      </div>
    </div>
    
    <div class="content-body">
      <!-- Add this notification element -->
      <div v-if="notification.show" class="notification" :class="notification.type">
        {{ notification.message }}
      </div>
      
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
                  <button class="btn btn-edit" @click="editUser(item)">Edit</button>
                  <button class="btn btn-delete" @click="deleteItem(item)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

    <!-- Edit User Modal -->
    <div v-if="showEditUserModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit User</h2>
          <button class="close-button" @click="closeEditUserModal">&times;</button>
        </div>
        <form @submit.prevent="updateUser" class="styled-form">
          <div class="form-group">
            <label>Email</label>
            <input v-model="editingUser.email" type="email" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>First Name</label>
            <input v-model="editingUser.firstName" type="text" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input v-model="editingUser.lastName" type="text" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select v-model="editingUser.role" required class="styled-select">
              <option value="" disabled>Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="editingUser.status" required class="styled-select">
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          <div class="form-group">
            <label>Department</label>
            <select v-model="editingUser.department" required class="styled-select">
              <option value="" disabled>Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="editingUser.phoneNumber" type="tel" 
                   pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number"
                   required class="styled-input" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeEditUserModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Update User</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

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
    name: 'Jane Smith',
    phone: '9876543210',
    email: 'jane@example.com',
    type: 'Admin',
    path: '/users/jane',
    status: 'Online',
    registrationTime: '2023-11-05T08:20:00',
    lastLoginTime: '2024-03-22T09:15:00',
    selected: false
  },
  {
    name: 'Robert Johnson',
    phone: '5556667777',
    email: 'robert@example.com',
    type: 'Manager',
    path: '/users/robert',
    status: 'Offline',
    registrationTime: '2024-02-10T14:45:00',
    lastLoginTime: '2024-03-18T16:30:00',
    selected: false
  }
])

// State variables
const selectAll = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const sortColumn = ref('')
const sortDirection = ref('asc')
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)

// New user form
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

// Add notification state
const notification = reactive({
  show: false,
  message: '',
  type: 'success'
})

// Editing user state
const editingUser = reactive({
  originalEmail: '',
  email: '',
  firstName: '',
  lastName: '',
  role: '',
  status: 'Active',
  department: '',
  phoneNumber: ''
})

// Computed properties
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
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const toggleSelectAll = () => {
  currentTableData.value.forEach(item => item.selected = selectAll.value)
}

const updateSelectAll = () => {
  selectAll.value = currentTableData.value.every(item => item.selected)
}

const handleSearch = () => {
  console.log(`Searching for: ${searchQuery.value}`)
}

const filterByStatus = () => {
  console.log(`Filtering by status: ${statusFilter.value}`)
}

const deleteItem = (item) => {
  console.log(`Deleting item: ${item.name}`)
  currentTableData.value = currentTableData.value.filter(i => i.name !== item.name)
}

const exportData = () => {
  // Get all users
  const users = currentTableData.value
  
  // Define the CSV headers
  const headers = ['Username', 'Phone Number', 'Email', 'Role', 'Status', 'Registration Time', 'Last Login']
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n'
  
  // Add each user as a row in the CSV
  users.forEach(user => {
    const row = [
      user.name,
      user.phone,
      user.email,
      user.type,
      user.status,
      new Date(user.registrationTime).toLocaleString(),
      new Date(user.lastLoginTime).toLocaleString()
    ]
    
    // Escape any commas in the data
    const escapedRow = row.map(field => {
      // If field contains comma, quote it
      if (field && field.toString().includes(',')) {
        return `"${field}"`
      }
      return field
    })
    
    csvContent += escapedRow.join(',') + '\n'
  })
  
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Create a download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  // Set link properties
  link.setAttribute('href', url)
  link.setAttribute('download', 'user_data.csv')
  link.style.visibility = 'hidden'
  
  // Add to document, click to download, then remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Show notification
  notification.message = 'User data exported successfully!'
  notification.type = 'success'
  notification.show = true
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.show = false
  }, 3000)
}

const editUser = (user) => {
  try {
    // Make a deep copy of the user
    const userToEdit = JSON.parse(JSON.stringify(user));
    
    // Assign all values to editingUser
    editingUser.originalEmail = userToEdit.email;
    editingUser.email = userToEdit.email;
    editingUser.firstName = userToEdit.name.split(' ')[0];  // Split full name into first name
    editingUser.lastName = userToEdit.name.split(' ')[1] || '';  // and last name
    editingUser.role = userToEdit.type;
    editingUser.status = userToEdit.status;
    editingUser.phoneNumber = userToEdit.phone;
    editingUser.department = userToEdit.department || '';
    
    // Show the modal
    showEditUserModal.value = true;
    
  } catch (error) {
    console.error('Error in editUser:', error);
    notification.message = `Error editing user: ${error.message}`;
    notification.type = 'error';
    notification.show = true;
  }
}

const updateUser = () => {
  try {
    // Find the user index using originalEmail
    const index = currentTableData.value.findIndex(user => 
      user.email === editingUser.originalEmail
    );
    
    if (index === -1) {
      throw new Error('User not found');
    }
    
    // Check for duplicate email
    if (editingUser.email !== editingUser.originalEmail &&
        currentTableData.value.some(user => 
          user.email.toLowerCase() === editingUser.email.toLowerCase()
        )) {
      throw new Error('A user with this email already exists');
    }
    
    // Create updated user object
    const updatedUser = {
      name: `${editingUser.firstName} ${editingUser.lastName}`.trim(),
      phone: editingUser.phoneNumber,
      email: editingUser.email,
      type: editingUser.role,
      status: editingUser.status,
      department: editingUser.department,
      path: currentTableData.value[index].path,
      registrationTime: currentTableData.value[index].registrationTime,
      lastLoginTime: currentTableData.value[index].lastLoginTime,
      selected: currentTableData.value[index].selected
    };
    
    // Update the user
    currentTableData.value[index] = updatedUser;
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(currentTableData.value));
    
    // Close modal and show success message
    showEditUserModal.value = false;
    notification.message = `User "${updatedUser.name}" has been updated successfully!`;
    notification.type = 'success';
    notification.show = true;
    
    setTimeout(() => {
      notification.show = false;
    }, 3000);
  } catch (error) {
    notification.message = error.message;
    notification.type = 'error';
    notification.show = true;
  }
}

const closeEditUserModal = () => {
  showEditUserModal.value = false;
  // Reset the editingUser object
  Object.assign(editingUser, {
    originalEmail: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    status: 'Active',
    department: '',
    phoneNumber: ''
  });
}

// User form methods
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
  
  // Show success notification
  notification.message = `User ${newUser.username} has been successfully added!`
  notification.type = 'success'
  notification.show = true
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.show = false
  }, 3000)
  
  console.log('User saved:', newUserEntry)
}

// Add this method to the <script setup> section:
const router = useRouter()

const backToAdmin = () => {
  router.push('/admin')
}
</script>

<style scoped>
/* Import styles from AdminPortal.css */
@import './AdminPortal.css';

/* User-specific styles with better contrast */
.user-management {
  padding: 20px;
  width: 100%;
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
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .modal-content {
    width: 95%;
    padding: 15px;
  }
  
  .styled-form .form-group {
    margin-bottom: 15px;
  }
}

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

/* Increase table row spacing for better readability */
.data-table td {
  padding: 14px 16px;
}

/* Add these styles for modal buttons */
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

/* Make sure buttons are visible */
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

/* Ensure modal content has proper padding */
.modal-content {
  max-height: 80vh;
  overflow-y: auto;
  padding-bottom: 70px; /* Add extra padding at bottom to ensure buttons are visible */
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
  order: -1; /* This moves the title to the left */
  margin-right: auto; /* Pushes other elements to the right */
}

.back-button-container {
  margin-right: 15px;
  order: 0;
}

.header-actions {
  order: 1;
}
</style> 