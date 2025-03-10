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
        <div class="form-group captcha-container">
          <label>Captcha</label>
          <div class="captcha-box">
            <span class="captcha-text">{{ captchaText }}</span>
            <button type="button" @click="regenerateCaptcha" class="refresh-captcha">
              ↻
            </button>
          </div>
          <input 
            type="text" 
            v-model.trim="captchaInput" 
            required 
            class="form-input"
            placeholder="Enter the captcha text above"
          />
        </div>
        <button type="submit" class="btn-login">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'  // Import the auth store

const router = useRouter()
const authStore = useAuthStore()  // Use the auth store
const username = ref('')
const password = ref('')
const error = ref('')
const captchaText = ref('')
const captchaInput = ref('')

// Generate a random captcha text
const generateCaptcha = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  const length = 6;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  captchaText.value = result;
}

const regenerateCaptcha = () => {
  generateCaptcha();
  captchaInput.value = '';
}

const handleLogin = () => {
  // Validate captcha first
  if (captchaInput.value !== captchaText.value) {
    error.value = 'Invalid captcha. Please try again.';
    regenerateCaptcha();
    return;
  }
  
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
    regenerateCaptcha();
    // Clear error after 3 seconds
    setTimeout(() => {
      error.value = '';
    }, 3000);
  }
}

// Generate captcha on component mount
onMounted(() => {
  generateCaptcha();
})
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
  color: #000; /* Changed from grey to black */
}

.form-input::placeholder {
  color: #999;
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

.captcha-container {
  margin-top: 0.5rem;
}

.captcha-box {
  background-color: #f5f5f5;
  padding: 0.75rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  user-select: none;
}

.captcha-text {
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 3px;
  color: #333;
  /* Add some distortion to make it harder for bots to read */
  transform: skew(-5deg);
}

.refresh-captcha {
  background: none;
  border: none;
  color: #4CAF50;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.refresh-captcha:hover {
  background-color: rgba(76, 175, 80, 0.1);
}
</style>