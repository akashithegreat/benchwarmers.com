<template>
  <div class="min-h-screen flex bg-black text-white">
    <!-- Sidebar -->
    <aside class="w-48 bg-gray-800 p-4">
      <h2 class="text-lg font-semibold mb-4">Your Teams</h2>
      <ul class="space-y-2">
        <li
          v-for="team in teamList"
          :key="team"
          @click="goToTeam(team)"
          :class="[
            'cursor-pointer px-2 py-1 rounded',
            currentTeam === team ? 'bg-green-600' : 'hover:bg-gray-700'
          ]"
        >
          {{ team }}
        </li>
      </ul>

      <hr class="my-4 border-gray-600" />

      <button
        class="w-full text-left px-2 py-1 rounded hover:bg-gray-700"
        @click="router.push('/favorites')"
      >
        ⭐ Favorites
      </button>
    </aside>

    <!-- Team Content -->
    <main class="flex-1 flex flex-col items-center justify-center text-center px-4">
      <h1 class="text-4xl font-bold mb-4">{{ currentTeam }}</h1>
      <p class="text-gray-400 mb-4">
        This is the future stat and news hub for the {{ currentTeam }}.
      </p>

      <button
        class="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        @click="addFavoriteGame"
      >
        ❤️ Favorite This Game
      </button>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()

const currentTeam = ref(route.params.teamName || '')
const teamList = ref([])

const goToTeam = (teamName) => {
  router.push(`/team/${teamName}`)
}

const fetchTeams = async () => {
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

      if (!teamList.value.includes(currentTeam.value)) {
        currentTeam.value = teamList.value[0] || ''
        if (currentTeam.value) {
          router.push(`/team/${currentTeam.value}`)
        }
      }
    } else {
      alert('User not found.')
      router.push('/create-profile')
    }
  } catch (err) {
    console.error('❌ Error loading teams:', err)
    alert('Failed to load teams.')
  }
}

const addFavoriteGame = async () => {
  const user = auth.currentUser
  if (!user) {
    alert('Please log in to favorite games.')
    return
  }

  try {
    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, {
      favorites: arrayUnion({
        team: currentTeam.value,
        timestamp: Date.now(),
      })
    })
    alert('Game favorited!')
  } catch (err) {
    console.error('❌ Failed to add favorite:', err)
    alert('Could not favorite game.')
  }
}

onMounted(fetchTeams)

watch(() => route.params.teamName, (newTeam) => {
  currentTeam.value = newTeam
})
</script>
