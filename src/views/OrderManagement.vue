<template>
  <div class="order-management">
    <div class="content-header">
      <h1>Order Management</h1>
      <div class="back-button-container">
        <button class="btn btn-back" @click="backToAdmin">
          <i class="icon-arrow-left"></i> Back to Admin
        </button>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="exportData">Export</button>
      </div>
    </div>
    
    <div class="content-body">
      <!-- Add notification element -->
      <div v-if="notification.show" class="notification" :class="notification.type">
        {{ notification.message }}
      </div>
      
      <div class= "search-filter">
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
              <label>Total Amount:</label>
              <span>${{ selectedOrder.totalAmount.toFixed(2) }}</span>
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
            <div class="product-list">
              <div class="product-item" v-for="(product, index) in selectedOrder.products" :key="index">
                <div class="product-details">
                  <span class="product-name">{{ product.name }}</span>
                  <span class="product-price">${{ product.price.toFixed(2) }}</span>
                </div>
                <span class="product-quantity">x{{ product.quantity }}</span>
                <span class="product-total">${{ (product.price * product.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="order-summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${{ calculateSubtotal(selectedOrder.products).toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Tax:</span>
                <span>${{ calculateTax(selectedOrder.products).toFixed(2) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total:</span>
                <span>${{ selectedOrder.totalAmount.toFixed(2) }}</span>
              </div>
            </div>
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
            <label>Username</label>
            <input v-model="newOrder.username" type="text" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Products</label>
            <div v-for="(product, index) in newOrder.products" :key="index" class="product-entry">
              <input v-model="product.name" placeholder="Product Name" required class="styled-input" />
              <input v-model.number="product.price" type="number" min="0.01" step="0.01" placeholder="Price" required class="styled-input" />
              <input v-model.number="product.quantity" type="number" min="1" placeholder="Quantity" required class="styled-input" />
              <button type="button" class="btn btn-delete" @click="removeProduct(index)">Remove</button>
            </div>
            <button type="button" class="btn btn-secondary" @click="addProduct">Add Product</button>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="newOrder.status" required class="styled-select">
              <option value="" disabled>Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div class="order-summary">
            <div class="summary-row total">
              <span>Total Amount:</span>
              <span>${{ calculateOrderTotal().toFixed(2) }}</span>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeAddOrderModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Order</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Order Modal -->
    <div v-if="showEditOrderModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Order</h2>
          <button class="close-button" @click="closeEditOrderModal">&times;</button>
        </div>
        <form @submit.prevent="updateOrder" class="styled-form">
          <div class="form-group">
            <label>Order ID</label>
            <input v-model="editingOrder.orderId" type="text" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Customer Name</label>
            <input v-model="editingOrder.customerName" type="text" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Order Date</label>
            <input v-model="editingOrder.orderDate" type="datetime-local" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="editingOrder.status" required class="styled-select">
              <option value="" disabled>Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div class="form-group">
            <label>Total Amount</label>
            <input v-model="editingOrder.total" type="number" min="0" step="0.01" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Shipping Address</label>
            <textarea v-model="editingOrder.shippingAddress" required class="styled-input" />
          </div>
          <div class="form-group">
            <label>Payment Method</label>
            <input v-model="editingOrder.paymentMethod" type="text" required class="styled-input" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeEditOrderModal">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Order</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

// Default order data - if none exists, create sample data
const orderData = ref(JSON.parse(localStorage.getItem('orders')) || [
  {
    orderId: "ORD-001",
    username: "john_doe",
    products: [
      { name: "Laptop", price: 899.99, quantity: 1 },
      { name: "Mouse", price: 24.99, quantity: 1 }
    ],
    orderDate: "2024-03-15T10:30:00",
    totalAmount: 924.98,
    status: "Delivered",
    selected: false
  },
  {
    orderId: "ORD-002",
    username: "jane_smith",
    products: [
      { name: "Headphones", price: 149.99, quantity: 1 },
      { name: "Phone Case", price: 19.99, quantity: 2 }
    ],
    orderDate: "2024-03-18T14:45:00",
    totalAmount: 189.97,
    status: "Processing",
    selected: false
  },
  {
    orderId: "ORD-003",
    username: "robert_johnson",
    products: [
      { name: "Monitor", price: 299.99, quantity: 2 },
      { name: "Keyboard", price: 59.99, quantity: 1 }
    ],
    orderDate: "2024-03-20T09:15:00",
    totalAmount: 659.97,
    status: "Pending",
    selected: false
  }
])

// Save initial data to localStorage if it doesn't exist
if (!localStorage.getItem('orders')) {
  localStorage.setItem('orders', JSON.stringify(orderData.value))
}

// State variables
const selectAll = ref(false)
const searchQuery = ref('')
const dateFilters = reactive({ start: '', end: '' })
const amountFilter = ref('all')
const sortColumn = ref('')
const sortDirection = ref('asc')
const showOrderDetailsModal = ref(false)
const showAddOrderModal = ref(false)
const showEditOrderModal = ref(false)
const selectedOrder = ref(null)
const editingOrder = reactive({
  originalId: '',  // Add this for tracking original order
  orderId: '',
  customerName: '',
  orderDate: '',
  status: '',
  total: 0,
  items: [],
  shippingAddress: '',
  paymentMethod: ''
})

// Notification state
const notification = reactive({
  show: false,
  message: '',
  type: 'success'
})

// New order form
const newOrder = reactive({
  username: '',
  products: [{ name: '', price: 0, quantity: 1 }],
  status: 'Pending',
  orderDate: null,
  totalAmount: 0
})

// Computed properties
const filteredOrderData = computed(() => {
  let data = [...orderData.value]
  
  // First apply search filter if exists
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(item => 
      item.orderId.toString().includes(query) ||
      item.username.toLowerCase().includes(query)
    )
  }
  
  // Apply date range filter
  if (dateFilters.start && dateFilters.end) {
    const startDate = new Date(dateFilters.start).getTime()
    const endDate = new Date(dateFilters.end).getTime() + 86400000 // Add one day to include end date
    data = data.filter(item => {
      const orderDate = new Date(item.orderDate).getTime()
      return orderDate >= startDate && orderDate <= endDate
    })
  }
  
  // Apply amount filter
  if (amountFilter.value !== 'all') {
    if (amountFilter.value === '1001+') {
      data = data.filter(item => item.totalAmount > 1000)
    } else {
      const [min, max] = amountFilter.value.split('-').map(Number)
      data = data.filter(item => item.totalAmount >= min && item.totalAmount <= max)
    }
  }
  
  // Apply sorting
  if (sortColumn.value) {
    data.sort((a, b) => {
      let valueA, valueB;
      
      // Special case for productCount
      if (sortColumn.value === 'productCount') {
        valueA = a.products.length;
        valueB = b.products.length;
      } else {
        valueA = a[sortColumn.value];
        valueB = b[sortColumn.value];
      }
      
      if (valueA < valueB) {
        return sortDirection.value === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection.value === 'asc' ? 1 : -1;
      }
      return 0;
    });
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
  orderData.value.forEach(item => item.selected = selectAll.value)
}

const updateSelectAll = () => {
  selectAll.value = orderData.value.every(item => item.selected)
}

const handleSearch = () => {
  console.log(`Searching for: ${searchQuery.value}`)
}

const filterOrders = () => {
  console.log(`Filtering orders by date range: ${dateFilters.start} to ${dateFilters.end}`)
}

const filterByAmount = () => {
  console.log(`Filtering orders by amount: ${amountFilter.value}`)
}

const deleteOrder = (order) => {
  console.log(`Deleting order: ${order.orderId}`)
  orderData.value = orderData.value.filter(o => o.orderId !== order.orderId)
  // Update localStorage after deletion
  localStorage.setItem('orders', JSON.stringify(orderData.value))
  
  // Show notification
  notification.message = `Order #${order.orderId} has been deleted`
  notification.type = 'success'
  notification.show = true
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.show = false
  }, 3000)
}

const exportData = () => {
  // Get all orders
  const orders = orderData.value
  
  // Define the CSV headers
  const headers = ['Order ID', 'Username', 'Products', 'Order Date', 'Total Amount', 'Status']
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n'
  
  // Add each order as a row in the CSV
  orders.forEach(order => {
    const row = [
      order.orderId,
      order.username,
      order.products.length,
      new Date(order.orderDate).toLocaleString(),
      order.totalAmount.toFixed(2),
      order.status
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
  link.setAttribute('download', 'order_data.csv')
  link.style.visibility = 'hidden'
  
  // Add to document, click to download, then remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Show notification
  notification.message = 'Order data exported successfully!'
  notification.type = 'success'
  notification.show = true
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.show = false
  }, 3000)
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
  showOrderDetailsModal.value = true
}

const closeOrderDetailsModal = () => {
  showOrderDetailsModal.value = false
}

const getOrderStatusClass = (status) => {
  switch (status) {
    case 'Delivered':
      return 'success'
    case 'Shipped':
      return 'info'
    case 'Processing':
      return 'warning'
    case 'Pending':
      return 'info'
    case 'Cancelled':
      return 'danger'
    default:
      return ''
  }
}

const calculateSubtotal = (products) => {
  return products.reduce((total, product) => total + (product.price * product.quantity), 0)
}

const calculateTax = (products) => {
  const subtotal = calculateSubtotal(products)
  return subtotal * 0.08 // Assuming 8% tax rate
}

const calculateOrderTotal = () => {
  const subtotal = newOrder.products.reduce((total, product) => {
    return total + (product.price * product.quantity)
  }, 0)
  
  return subtotal * 1.08 // Adding 8% tax
}

const editOrder = (order) => {
  try {
    // Make a deep copy of the order
    const orderToEdit = JSON.parse(JSON.stringify(order));
    
    // Assign all values to editingOrder
    Object.assign(editingOrder, {
      originalId: orderToEdit.orderId,
      orderId: orderToEdit.orderId,
      customerName: orderToEdit.username,
      orderDate: orderToEdit.orderDate,
      status: orderToEdit.status,
      total: orderToEdit.totalAmount,
      items: orderToEdit.products,
      shippingAddress: '',
      paymentMethod: ''
    });
    
    // Show the modal
    showEditOrderModal.value = true;
    
  } catch (error) {
    console.error('Error in editOrder:', error);
    notification.message = `Error editing order: ${error.message}`;
    notification.type = 'error';
    notification.show = true;
  }
}

const updateOrder = () => {
  try {
    // Find the order index using originalId
    const index = orderData.value.findIndex(order => 
      order.orderId === editingOrder.originalId
    );
    
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    // Create updated order object
    const updatedOrder = {
      orderId: editingOrder.orderId,
      username: editingOrder.customerName,
      products: editingOrder.items,
      orderDate: editingOrder.orderDate,
      totalAmount: editingOrder.total,
      status: editingOrder.status,
      selected: orderData.value[index].selected
    };
    
    // Update the order
    orderData.value[index] = updatedOrder;
    
    // Save to localStorage
    localStorage.setItem('orders', JSON.stringify(orderData.value));
    
    // Close modal and show success message
    showEditOrderModal.value = false;
    notification.message = `Order "${editingOrder.orderId}" has been updated successfully!`;
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

const openAddOrderModal = () => {
  // Reset the form
  Object.assign(newOrder, {
    username: '',
    products: [{ name: '', price: 0, quantity: 1 }],
    status: 'Pending',
    orderDate: null,
    totalAmount: 0
  })
  
  showAddOrderModal.value = true
}

const closeAddOrderModal = () => {
  showAddOrderModal.value = false
}

const addProduct = () => {
  newOrder.products.push({ name: '', price: 0, quantity: 1 })
}

const removeProduct = (index) => {
  if (newOrder.products.length > 1) {
    newOrder.products.splice(index, 1)
  }
}

const saveOrder = () => {
  // Calculate total
  const total = calculateOrderTotal()
  
  // Generate a unique order ID
  const orderId = `ORD-${String(orderData.value.length + 1).padStart(3, '0')}`
  
  // Create new order object
  const order = {
    orderId,
    username: newOrder.username,
    products: [...newOrder.products], // Create a copy of the products array
    orderDate: new Date().toISOString(),
    totalAmount: total,
    status: newOrder.status,
    selected: false
  }
  
  // Add to orders array
  orderData.value.push(order)
  
  // Update localStorage
  localStorage.setItem('orders', JSON.stringify(orderData.value))
  
  // Close modal
  showAddOrderModal.value = false
  
  // Show notification
  notification.message = `Order #${orderId} has been created successfully!`
  notification.type = 'success'
  notification.show = true
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.show = false
  }, 3000)
}

const closeEditOrderModal = () => {
  showEditOrderModal.value = false;
}

const router = useRouter()

const backToAdmin = () => {
  router.push('/admin')
}
</script>

<style scoped>
/* Import styles from AdminPortal.css */
@import './AdminPortal.css';

/* Order-specific styles with better visibility */
.order-management {
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

/* Improved date range filter */
.date-range-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #565555;
  border: 1px solid #CCCCCC;
  border-radius: var(--radius-sm);
  padding: 4px 12px;
}

.date-range-filter span {
  color: #666666;
  font-weight: 500;
}

.date-range-filter input[type="date"] {
  border: none;
  outline: none;
  color: #333333;
  padding: 4px;
}

/* Enhanced order status badges */
.status-badge {
  padding: 5px 10px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.status-badge.success {
  background-color: rgba(46, 139, 87, 0.15);
  color: #2E8B57;
}

.status-badge.warning {
  background-color: rgba(230, 126, 34, 0.15);
  color: #E67E22;
}

.status-badge.danger {
  background-color: rgba(211, 47, 47, 0.15);
  color: #D32F2F;
}

.status-badge.info {
  background-color: rgba(51, 102, 204, 0.15);
  color: #3366CC;
}

/* Order details styling */
.order-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.info-group {
  display: flex;
  flex-direction: column;
}

.info-group label {
  font-weight: 600;
  color: #666;
  margin-bottom: 5px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.product-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-name {
  font-weight: 600;
}

.product-price {
  color: #666;
  font-size: 0.9em;
}

.product-quantity {
  background-color: #eee;
  padding: 3px 8px;
  border-radius: 4px;
  margin: 0 10px;
}

.product-total {
  font-weight: 600;
  color: #333;
}

.order-summary {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary-row.total {
  font-weight: 700;
  font-size: 1.1em;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #ddd;
}

/* Product entry in add order form */
.product-entry {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

/* Button link style */
.btn-link {
  background: none;
  border: none;
  color: #3366CC;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.btn-link:hover {
  color: #254e99;
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
  .search-filter button,
  .search-filter .date-range-filter {
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
  
  .product-entry {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }
  
  .order-info {
    grid-template-columns: 1fr;
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
  
  .product-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .product-quantity, .product-total {
    margin-top: 5px;
  }
}
</style> 