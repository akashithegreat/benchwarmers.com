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
    class="w-full text-left px-2 py-1 rounded hover:bg-gray-700 mb-2"
    @click="router.push('/favorites')"
  >
    ⭐ Favorites
  </button>

  <button
    class="w-full text-left px-2 py-1 rounded hover:bg-gray-700"
    @click="toggleGames"
  >
    📅 {{ showGames ? 'Hide' : 'Show' }} Games
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
        <p class="text-sm text-gray-300 leading-relaxed mb-6">
          {{
            teamInfo.strDescriptionEN?.length > 300
              ? teamInfo.strDescriptionEN.slice(0, 300) + '...'
              : teamInfo.strDescriptionEN
          }}
        </p>

        <div class="space-x-4 mb-6">
          <button
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
            @click="addFavoriteGame"
          >
            ❤️ Favorite This Game
          </button>
          <button
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            @click="toggleGames"
          >
            📅 {{ showGames ? 'Hide' : 'Show' }} Upcoming Games
          </button>
        </div>

        <div v-if="showGames && upcomingGames.length" class="mt-8 text-left max-w-2xl mx-auto space-y-4">
          <h2 class="text-2xl font-semibold mb-4 text-center">Upcoming Games</h2>
          <div
            v-for="(game, index) in upcomingGames"
            :key="index"
            class="bg-gray-800 p-4 rounded"
          >
            <p class="text-lg font-semibold">{{ game.strEvent }}</p>
            <p class="text-sm text-gray-400">
              {{ formatDateTime(game.dateEvent, game.strTime) }}
            </p>
            <p class="text-sm text-gray-400">
              Venue: {{ game.strVenue || 'TBD' }}
            </p>
          </div>
        </div>

        <div v-else-if="showGames && !upcomingGames.length" class="text-gray-400 mt-10">
          <p>No upcoming games found.</p>
        </div>
      </div>

      <div v-else class="text-gray-400 mt-20">
        <p>Loading team data or team not found.</p>
      </div>
      <div class="mt-12 max-w-2xl mx-auto text-left">
  <h2 class="text-2xl font-semibold mb-4">💬 Team Chat</h2>
  <div class="bg-gray-800 p-4 rounded h-64 overflow-y-auto mb-4">
    <div v-for="(msg, index) in chatMessages" :key="index" class="mb-2">
      <span class="font-semibold text-purple-400">{{ msg.username || 'Anonymous' }}:</span>
      <span>{{ msg.text }}</span>
    </div>
  </div>

  <form @submit.prevent="sendMessage" class="flex gap-2">
    <input
      v-model="newMessage"
      type="text"
      placeholder="Type your message..."
      class="flex-1 px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
    />
    <button
      type="submit"
      class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
    >
      Send
    </button>
  </form>
</div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, getDoc, updateDoc, arrayUnion, collection, addDoc, serverTimestamp, orderBy, query, onSnapshot } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()

const currentTeam = ref(route.params.teamName || '')
const teamList = ref([])
const teamInfo = ref(null)
const upcomingGames = ref([])
const showGames = ref(false)

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

    // Fetch games after we get team ID
    if (teamInfo.value?.idTeam) {
      fetchUpcomingGames(teamInfo.value.idTeam)
    }
  } catch (err) {
    console.error('Error fetching API data:', err)
    teamInfo.value = null
  }
}

const fetchUpcomingGames = async (teamId) => {
  try {
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${teamId}`)
    const data = await res.json()
    upcomingGames.value = data.events || []
  } catch (err) {
    console.error('Error fetching games:', err)
  }
}

const toggleGames = () => {
  showGames.value = !showGames.value
}

const formatDateTime = (date, time) => {
  return `${date} at ${time}`
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
const chatMessages = ref([])
const newMessage = ref('')

const loadChatMessages = () => {
  if (!currentTeam.value) return
  const messagesRef = collection(db, 'chats', currentTeam.value, 'messages')
  const q = query(messagesRef, orderBy('timestamp'))

  onSnapshot(q, (snapshot) => {
    chatMessages.value = snapshot.docs.map(doc => doc.data())
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const user = auth.currentUser
  const username = user?.displayName || user?.email || 'Anonymous'

  try {
    await addDoc(collection(db, 'chats', currentTeam.value, 'messages'), {
      text: newMessage.value.trim(),
      username,
      timestamp: serverTimestamp()
    })
    newMessage.value = ''
  } catch (err) {
    console.error('Error sending message:', err)
  }
}
watch(() => route.params.teamName, async (newTeam) => {
  currentTeam.value = newTeam
  await fetchTeamInfo(newTeam)
  loadChatMessages()
})

onMounted(() => {
  fetchTeams()
  loadChatMessages()
})


</script>
