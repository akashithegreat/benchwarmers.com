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

            currentTeam === team ? 'bg-purple-600' : 'hover:bg-gray-700'
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

    <!-- Main Content -->
    <main class="flex-1 p-10 text-center">
      <div v-if="teamInfo">
        <img
          v-if="teamInfo.strTeamBadge"
          :src="teamInfo.strTeamBadge"
          alt="Team Logo"
          class="w-32 mb-6 mx-auto"
        />

        <h1 class="text-4xl font-bold mb-2">{{ teamInfo.strTeam }}</h1>
        <p class="text-gray-400 mb-1">League: {{ teamInfo.strLeague }}</p>
        <p class="text-gray-400 mb-1">Stadium: {{ teamInfo.strStadium }}</p>
        <p class="text-gray-400 mb-4">
          Location: {{ teamInfo.strStadiumLocation || 'Not available' }}
        </p>
        <p class="text-sm text-gray-300 leading-relaxed">
          {{
            teamInfo.strDescriptionEN?.length > 300
              ? teamInfo.strDescriptionEN.slice(0, 300) + '...'
              : teamInfo.strDescriptionEN
          }}
        </p>

        <button
          class="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
          @click="addFavoriteGame"
        >
          ❤️ Favorite This Game
        </button>
      </div>

      <div v-else class="text-gray-400 mt-20">
        <p>Loading team data or team not found.</p>
      </div>
>>>>>>> 7cf5367 (Add API-powered TeamPage.vue with sidebar + favorites)
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
const teamInfo = ref(null)

const goToTeam = (teamName) => {
  router.push(`/team/${teamName}`)
}

const fetchTeams = async () => {
  const user = auth.currentUser
  if (!user) {
    router.push('/login')
    return
  }
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

    await fetchTeamInfo(currentTeam.value)
  } else {
    router.push('/create-profile')
  }
}

const fetchTeamInfo = async (teamName) => {
  try {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`
    const res = await fetch(url)
    const data = await res.json()
    teamInfo.value = data.teams ? data.teams[0] : null
  } catch (err) {
    console.error('Error fetching API data:', err)
    teamInfo.value = null
  }
}

const addFavoriteGame = async () => {
  const user = auth.currentUser
  if (!user) return alert('Login required.')

  try {
    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, {
      favoriteGames: arrayUnion(currentTeam.value)
    })
    alert(`✅ Favorited ${currentTeam.value}`)
  } catch (err) {
    console.error(err)
    alert('❌ Failed to favorite game')
  }
}

onMounted(fetchTeams)

watch(() => route.params.teamName, async (newTeam) => {
  currentTeam.value = newTeam
  await fetchTeamInfo(newTeam)
})
</script>
