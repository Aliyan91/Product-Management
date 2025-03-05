<template>
    <div class="admin-login-container">
      <div class="admin-login-card">
        <h2>Admin Login</h2>
        <form @submit.prevent="handleAdminLogin">
          <input 
            type="text" 
            v-model="adminUsername" 
            placeholder="Admin Username" 
            required 
          />
          <input 
            type="password" 
            v-model="adminPassword" 
            placeholder="Admin Password" 
            required 
          />
  
          <!-- Big Captcha -->
          <div class="captcha-container">
            <div class="captcha-box">{{ captchaCode }}</div>
            <input 
              type="text" 
              v-model="captchaInput" 
              placeholder="Enter Captcha" 
              required 
            />
          </div>
  
          <button type="submit">Login</button>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToast } from 'vue-toastification'
  
  const router = useRouter()
  const toast = useToast()
  
  const adminUsername = ref('')
  const adminPassword = ref('')
  const captchaInput = ref('')
  const captchaCode = ref(generateCaptcha())  // Generate initial captcha
  const errorMessage = ref('')
  
  // Function to generate a random 6-character captcha
  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  const handleAdminLogin = () => {
    if (captchaInput.value !== captchaCode.value) {
      errorMessage.value = "Invalid captcha. Try again.";
      toast.error("Captcha incorrect!");
      captchaCode.value = generateCaptcha(); // Refresh captcha on failure
      captchaInput.value = ''; // Clear input
      return;
    }
  
    if (adminUsername.value === "admin" && adminPassword.value === "admin123") {
      toast.success("Admin successfully logged in!");
      router.push("/admin-portal");
    } else {
      errorMessage.value = "Invalid admin credentials";
      toast.error("Invalid credentials");
    }
  }
  </script>
  
  <style scoped>
  .admin-login-container {
    background-color: #0f172a;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, sans-serif;
  }
  
  .admin-login-card {
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
  
  .captcha-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .captcha-box {
    background-color: #ffcc00;
    color: #000;
    font-size: 24px;
    font-weight: bold;
    padding: 15px 20px;
    border-radius: 5px;
    margin-bottom: 10px;
    text-align: center;
    letter-spacing: 2px;
  }
  
  button {
    width: 100%;
    padding: 12px;
    background-color: #e63946;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #c53030;
  }
  
  .error-message {
    color: #ff4444;
    text-align: center;
    margin-top: 10px;
  }
  </style>
  