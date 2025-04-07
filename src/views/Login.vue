<template>
    <div class="h-screen flex items-center justify-center bg-black text-white">
      <div class="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 class="text-2xl font-bold mb-6 text-center">Sign In</h2>
  
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full mb-4 p-2 border border-gray-700 rounded bg-black text-white"
        />
  
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full mb-6 p-2 border border-gray-700 rounded bg-black text-white"
        />
  
        <button
          @click="handleLogin"
          type="button"
          class="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded w-full font-semibold cursor-pointer"
        >
          Log In
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { auth } from '../firebase'
  import { signInWithEmailAndPassword } from 'firebase/auth'
  import { useRouter } from 'vue-router' // optional redirect
  
  const router = useRouter()
  const email = ref('')
  const password = ref('')
  // const router = useRouter()
  
  const handleLogin = async () => {
    if (!email.value || !password.value) {
      alert('Please fill in both fields.')
      return
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
      const user = userCredential.user
      alert(`✅ Welcome back, ${user.email}`)
      router.push('/squads')
  
      // Optional: redirect after login
      //  router.push('/squads') 
    } catch (err) {
      console.error('❌ Login error:', err.message)
      alert('❌ Login failed: ' + err.message)
    }
  }
  </script>
  