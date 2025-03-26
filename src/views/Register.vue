<template>
    <div class="register-container">
      <div class="register-box">
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Name</label>
            <input v-model="name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="password" type="password" required />
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input v-model="confirmPassword" type="password" required />
          </div>
          <button type="submit">Register</button>
          <p class="login-link">
            Already have an account?
            <router-link to="/login">Login</router-link>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  
  const router = useRouter()
  
  function handleRegister() {
    if (password.value !== confirmPassword.value) {
      alert('Passwords do not match!')
      return
    }
  
    // Simulate registration logic
    console.log('Registering:', { name: name.value, email: email.value })
    router.push('/home') // redirect after register
  }
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f2f2f2;
  }
  
  .register-box {
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
    background-color: #28a745;
    border: none;
    color: white;
    font-size: 15px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #218838;
  }
  
  .login-link {
    text-align: center;
    margin-top: 15px;
    font-size: 13px;
  }
  </style>
  