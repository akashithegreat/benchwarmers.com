<template>
    <div class="min-h-screen bg-black text-white p-6">
      <!-- Back Button -->
      <button
        class="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        @click="goBack"
      >
        ← Back
      </button>
  
      <h1 class="text-3xl font-bold mb-4">⭐ Your Favorite Games</h1>
  
      <div v-if="favorites.length === 0" class="text-gray-400">
        No favorite games yet.
      </div>
  
      <ul v-else class="space-y-4">
        <li
          v-for="(fav, index) in favorites"
          :key="index"
          class="bg-gray-800 p-4 rounded shadow"
        >
          <h2 class="text-xl font-semibold">{{ fav.team }} vs {{ fav.opponent }}</h2>
          <p class="text-sm text-gray-400">Game Date: {{ fav.date }}</p>
          <p class="text-sm text-gray-500">Favorited: {{ formatDate(fav.favoritedAt) }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { auth, db } from '../firebase'
  import { doc, getDoc } from 'firebase/firestore'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const favorites = ref([])
  
  const goBack = () => {
    router.back()
  }
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }
  
  const fetchFavorites = async () => {
    const user = auth.currentUser
    if (!user) {
      router.push('/login')
      return
    }
  
    try {
      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
  
      if (userSnap.exists()) {
        favorites.value = userSnap.data().favoriteGames || []
      } else {
        alert('User profile not found.')
      }
    } catch (err) {
      console.error('❌ Failed to fetch favorites:', err)
      alert('Could not load favorites.')
    }
  }
  
  onMounted(fetchFavorites)
  </script>
  
