<template>
    <div class="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 class="text-3xl font-bold mb-8">Your Squads</h1>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-xl">
        <button
          v-for="team in teamList"
          :key="team"
          @click="goToTeam(team)"
          class="bg-gray-800 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-lg text-center shadow-md transition"
        >
          {{ team }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { auth, db } from '../firebase'
  import { doc, getDoc } from 'firebase/firestore'
  
  const router = useRouter()
  const teamList = ref([])
  
  const goToTeam = (teamName) => {
    router.push(`/team/${teamName}`)
  }
  
  onMounted(async () => {
    const user = auth.currentUser
    if (!user) {
      router.push('/login')
      return
    }
  
    try {
      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
  
      if (userSnap.exists()) {
        const teams = userSnap.data().favoriteTeams || {}
        teamList.value = Object.values(teams)
  
        if (teamList.value.length === 0) {
          alert('Please select your teams first.')
          router.push('/create-profile')
        }
      } else {
        alert('User not found.')
        router.push('/login')
      }
    } catch (err) {
      console.error('❌ Error loading teams:', err)
      alert('Something went wrong.')
    }
  })
  </script>
  