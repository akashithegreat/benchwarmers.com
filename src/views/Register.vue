<template>
    <div class="h-screen flex items-center justify-center bg-black text-white">
      <div class="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 class="text-2xl font-bold mb-6 text-center">Create Account</h2>
  
        <input
          v-model="name"
          type="text"
          placeholder="Full Name"
          class="w-full mb-3 p-2 border border-gray-700 rounded bg-black text-white"
        />
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full mb-3 p-2 border border-gray-700 rounded bg-black text-white"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full mb-3 p-2 border border-gray-700 rounded bg-black text-white"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full mb-4 p-2 border border-gray-700 rounded bg-black text-white"
        />
  
        <button
          @click="handleRegister"
          type="button"
          class="bg-green-600 hover:bg-green-700 text-white py-2 rounded w-full font-semibold cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const router = useRouter()
  
  const name = ref('')
  const username = ref('')
  const email = ref('')
  const password = ref('')
  
  const handleRegister = async () => {
  if (!name.value || !username.value || !email.value || !password.value) {
    alert('❗ Please fill in all fields.')
    return
  }

  try {
    alert('🔍 Checking if username is taken...')

    const usernameRef = doc(db, 'usernames', username.value)
    const usernameSnap = await getDoc(usernameRef)

    if (usernameSnap.exists()) {
      alert('❌ That username is already taken. Try another one.')
      return
    }

    alert('✅ Username is available. Creating Firebase user...')

    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    alert('✅ Firebase user created. Saving user profile...')

    const userProfile = {
      name: name.value,
      username: username.value,
      email: email.value,
      createdAt: new Date(),
    }

    await setDoc(doc(db, 'users', user.uid), userProfile)
    await setDoc(usernameRef, { uid: user.uid })

    alert('🎉 Account created successfully!')
    router.push('/create-profile')
  } catch (error) {
    alert('❌ Error during registration: ' + error.message)
  }
}


</script>