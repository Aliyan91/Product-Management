<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <input type="text" v-model="username" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>

      <div class="mt-4 text-center">
        <p class="text-gray-400">
          Don't have an account?
          <RouterLink to="/register" class="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign up
          </RouterLink>
        </p>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = () => {
  const success = authStore.login({
    username: username.value,
    password: password.value
  })

  if (success) {
    toast.success('Successfully logged in!')
    router.push('/')
  } else {
    errorMessage.value = 'Invalid username or password'
    toast.error('Invalid credentials')
  }
}

const redirectToAdminLogin = () => {
  router.push('/admin-login')
}
</script>

<style scoped>
.login-container {
  background-color: #0f172a;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
}

.login-card {
  background-color: #1e293b;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: white;
  text-align: center;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #334155;
  border: none;
  border-radius: 4px;
  color: white;
}

input::placeholder {
  color: #94a3b8;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #7c3aed;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #6d28d9;
}

.button-space {
  height: 10px;
  /* Adds spacing between buttons */
}

.error-message {
  color: #ff4444;
  text-align: center;
  margin-top: 10px;
}
</style>
