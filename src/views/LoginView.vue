<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            id="username"
            v-model="credentials.username"
            type="text"
            required
            class="form-input"
            placeholder="Enter username"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="credentials.password"
            type="password"
            required
            class="form-input"
            placeholder="Enter password"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="login-button">
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const error = ref('')

const credentials = reactive({
  username: '',
  password: ''
})

const handleLogin = () => {
  error.value = ''
  
  if (authStore.login(credentials)) {
    router.push('/admin')
  } else {
    error.value = 'Invalid username or password'
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #2c3e50;
  font-weight: 500;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.login-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #45a049;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-bottom: 1rem;
}

@media (max-width: 480px) {
  .login-card {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style> 