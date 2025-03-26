<template>
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="password" type="password" required />
          </div>
          <button type="submit">Log In</button>
          <p class="register-link">
            Don't have an account?
            <router-link to="/register">Register</router-link>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const password = ref('')
  const router = useRouter()
  
  function handleLogin() {
    // Basic login logic (replace with real API call)
    if (email.value && password.value) {
      console.log('Logged in as:', email.value)
      router.push('/home') // redirect after login
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f2f2f2;
  }
  
  .login-box {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 300px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    border: none;
    color: white;
    font-size: 15px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .register-link {
    text-align: center;
    margin-top: 15px;
    font-size: 13px;
  }
  </style>
  