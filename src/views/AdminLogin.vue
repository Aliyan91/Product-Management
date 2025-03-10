<template>
  <div class="admin-login">
    <div class="login-container">
      <h2>Admin Login</h2>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Username</label>
          <input 
            type="text" 
            v-model.trim="username" 
            required 
            class="form-input"
            placeholder="Enter admin username"
          />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model.trim="password" 
            required 
            class="form-input"
            placeholder="Enter admin password"
          />
        </div>
        <button type="submit" class="btn-login">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'  // Import the auth store

const router = useRouter()
const authStore = useAuthStore()  // Use the auth store
const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  // For testing/development purposes
  console.log('Login attempt:', { username: username.value, password: password.value });

  // Use the auth store login method
  if (authStore.login({
    username: username.value,
    password: password.value
  })) {
    // Success - auth store will set isAuthenticated and isAdmin
    error.value = '';
    router.push('/admin');
  } else {
    error.value = 'Invalid username or password';
    // Clear error after 3 seconds
    setTimeout(() => {
      error.value = '';
    }, 3000);
  }
}
</script>

<style scoped>
.admin-login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #807f7f;
}

.login-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-container h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #666;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.btn-login {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-login:hover {
  background-color: #45a049;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
  