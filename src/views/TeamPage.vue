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

    <!-- Main Content -->
    <main class="flex-1 p-10 text-center">
      <div v-if="teamData">
        <img :src="teamData.logo" alt="Team Logo" class="w-32 mb-6 mx-auto" />
        <h1 class="text-4xl font-bold mb-2">{{ teamData.displayName }}</h1>

        <div class="mt-6">
          <h2 class="text-xl font-semibold mb-4">Upcoming Games</h2>
          <ul class="space-y-2 text-gray-300">
            <li v-for="(event, index) in teamData.schedule" :key="index" class="mb-4">
  <div class="flex justify-between items-center bg-gray-800 p-3 rounded">
    <div class="text-left">
      <div class="text-lg font-semibold">{{ event.opponent }}</div>
      <div class="text-sm text-gray-400">{{ event.date }}</div>
    </div>
    <button
      class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-semibold"
      @click="addFavoriteGame(event)"
    >
      ❤️ Favorite
    </button>
  </div>
</li>
          </ul>
        </div>
      </div>
      <div v-else class="text-gray-400 mt-20">Loading ESPN data or team not found...</div>
      <TeamChat :teamName="route.params.teamName" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import TeamChat from '../components/TeamChat.vue'


const route = useRoute()
const router = useRouter()

const currentTeam = ref(route.params.teamName || '')
const teamList = ref([])
const teamData = ref(null)

const espnCodeMap = {
  // ✅ full NBA, NFL, MLB map
  "Atlanta Hawks": "ATL", "Boston Celtics": "BOS", "Brooklyn Nets": "BKN", "Charlotte Hornets": "CHA",
  "Chicago Bulls": "CHI", "Cleveland Cavaliers": "CLE", "Dallas Mavericks": "DAL", "Denver Nuggets": "DEN",
  "Detroit Pistons": "DET", "Golden State Warriors": "GSW", "Houston Rockets": "HOU", "Indiana Pacers": "IND",
  "Los Angeles Clippers": "LAC", "Los Angeles Lakers": "LAL", "Memphis Grizzlies": "MEM", "Miami Heat": "MIA",
  "Milwaukee Bucks": "MIL", "Minnesota Timberwolves": "MIN", "New Orleans Pelicans": "NOP", "New York Knicks": "NYK",
  "Oklahoma City Thunder": "OKC", "Orlando Magic": "ORL", "Philadelphia 76ers": "PHI", "Phoenix Suns": "PHX",
  "Portland Trail Blazers": "POR", "Sacramento Kings": "SAC", "San Antonio Spurs": "SAS", "Toronto Raptors": "TOR",
  "Utah Jazz": "UTA", "Washington Wizards": "WAS",
  "Arizona Cardinals": "ARI", "Atlanta Falcons": "ATL", "Baltimore Ravens": "BAL", "Buffalo Bills": "BUF",
  "Carolina Panthers": "CAR", "Chicago Bears": "CHI", "Cincinnati Bengals": "CIN", "Cleveland Browns": "CLE",
  "Dallas Cowboys": "DAL", "Denver Broncos": "DEN", "Detroit Lions": "DET", "Green Bay Packers": "GB",
  "Houston Texans": "HOU", "Indianapolis Colts": "IND", "Jacksonville Jaguars": "JAX", "Kansas City Chiefs": "KC",
  "Las Vegas Raiders": "LV", "Los Angeles Chargers": "LAC", "Los Angeles Rams": "LAR", "Miami Dolphins": "MIA",
  "Minnesota Vikings": "MIN", "New England Patriots": "NE", "New Orleans Saints": "NO", "New York Giants": "NYG",
  "New York Jets": "NYJ", "Philadelphia Eagles": "PHI", "Pittsburgh Steelers": "PIT", "San Francisco 49ers": "SF",
  "Seattle Seahawks": "SEA", "Tampa Bay Buccaneers": "TB", "Tennessee Titans": "TEN", "Washington Commanders": "WSH",
  "Arizona Diamondbacks": "ARI", "Atlanta Braves": "ATL", "Baltimore Orioles": "BAL", "Boston Red Sox": "BOS",
  "Chicago White Sox": "CHW", "Chicago Cubs": "CHC", "Cincinnati Reds": "CIN", "Cleveland Guardians": "CLE",
  "Colorado Rockies": "COL", "Detroit Tigers": "DET", "Houston Astros": "HOU", "Kansas City Royals": "KC",
  "Los Angeles Angels": "LAA", "Los Angeles Dodgers": "LAD", "Miami Marlins": "MIA", "Milwaukee Brewers": "MIL",
  "Minnesota Twins": "MIN", "New York Yankees": "NYY", "New York Mets": "NYM", "Oakland Athletics": "OAK",
  "Philadelphia Phillies": "PHI", "Pittsburgh Pirates": "PIT", "San Diego Padres": "SD", "San Francisco Giants": "SF",
  "Seattle Mariners": "SEA", "St. Louis Cardinals": "STL", "Tampa Bay Rays": "TB", "Texas Rangers": "TEX",
  "Toronto Blue Jays": "TOR", "Washington Nationals": "WSH"
}

const getLeagueFromTeam = (teamName) => {
  const code = espnCodeMap[teamName]
  if (!code) return null

  const nba = ["LAL", "GSW", "NYK", "BOS", "PHX", "DAL", "MIA", "CHI", "CLE"]
  const nfl = ["DAL", "BUF", "PHI", "NE", "KC", "NYG", "GB", "SF", "MIN"]
  const mlb = ["NYY", "LAD", "BOS", "ATL", "HOU", "NYM", "CHC", "PHI"]

  if (nba.includes(code)) return "basketball/nba"
  if (nfl.includes(code)) return "football/nfl"
  if (mlb.includes(code)) return "baseball/mlb"

  return null
}

const fetchEspnTeamData = async (teamName) => {
  teamData.value = null
  const code = espnCodeMap[teamName]
  const league = getLeagueFromTeam(teamName)

  if (!code || !league) return

  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${league}/teams/${code}`)
    const data = await res.json()

    const logo = data.team?.logos?.[0]?.href
    const displayName = data.team?.displayName || teamName

    const schedule = (data.team?.nextEvent || []).map((event) => {
      const opponent = event.competitions?.[0]?.competitors?.find(c => c.team?.abbreviation !== code)
      return {
        date: new Date(event.date).toLocaleString(),
        opponent: opponent?.team?.displayName || 'Unknown'
      }
    })

    teamData.value = {
      displayName,
      logo,
      schedule
    }
  } catch (err) {
    console.error('❌ ESPN API error:', err)
  }
}

const fetchTeamList = async () => {
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
  } else {
    router.push('/create-profile')
  }
}

const goToTeam = (teamName) => {
  router.push(`/team/${teamName}`)
}

onMounted(async () => {
  await fetchTeamList()
  currentTeam.value = route.params.teamName
  fetchEspnTeamData(currentTeam.value)
})

watch(
  () => route.params.teamName,
  async (newTeam) => {
    currentTeam.value = newTeam
    fetchEspnTeamData(newTeam)
  },
  { immediate: true }
)
import { updateDoc, arrayUnion } from 'firebase/firestore'

const addFavoriteGame = async (game) => {
  const user = auth.currentUser
  if (!user) return alert('Please log in to favorite games.')

  const userRef = doc(db, 'users', user.uid)

  const favorite = {
    team: currentTeam.value,
    opponent: game.opponent,
    date: game.date,
    favoritedAt: new Date().toISOString()
  }

  try {
    await updateDoc(userRef, {
      favoriteGames: arrayUnion(favorite)
    })
    alert('✅ Game added to favorites!')
  } catch (err) {
    console.error('❌ Error saving favorite:', err)
    alert('Failed to favorite game.')
  }
}

</script>


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

    <!-- Main Content -->
    <main class="flex-1 p-10 text-center">
      <div v-if="teamData">
        <img :src="teamData.logo" alt="Team Logo" class="w-32 mb-6 mx-auto" />
        <h1 class="text-4xl font-bold mb-2">{{ teamData.displayName }}</h1>

        <div class="mt-6">
          <h2 class="text-xl font-semibold mb-4">Upcoming Games</h2>
          <ul class="space-y-2 text-gray-300">
            <li v-for="(event, index) in teamData.schedule" :key="index" class="mb-4">
  <div class="flex justify-between items-center bg-gray-800 p-3 rounded">
    <div class="text-left">
      <div class="text-lg font-semibold">{{ event.opponent }}</div>
      <div class="text-sm text-gray-400">{{ event.date }}</div>
    </div>
    <button
      class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-semibold"
      @click="addFavoriteGame(event)"
    >
      ❤️ Favorite
    </button>
  </div>
</li>
          </ul>
        </div>
      </div>
      <div v-else class="text-gray-400 mt-20">Loading ESPN data or team not found...</div>
      <TeamChat :teamName="route.params.teamName" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import TeamChat from '../components/TeamChat.vue'


const route = useRoute()
const router = useRouter()

const currentTeam = ref(route.params.teamName || '')
const teamList = ref([])
const teamData = ref(null)

const espnCodeMap = {
  // ✅ full NBA, NFL, MLB map
  "Atlanta Hawks": "ATL", "Boston Celtics": "BOS", "Brooklyn Nets": "BKN", "Charlotte Hornets": "CHA",
  "Chicago Bulls": "CHI", "Cleveland Cavaliers": "CLE", "Dallas Mavericks": "DAL", "Denver Nuggets": "DEN",
  "Detroit Pistons": "DET", "Golden State Warriors": "GSW", "Houston Rockets": "HOU", "Indiana Pacers": "IND",
  "Los Angeles Clippers": "LAC", "Los Angeles Lakers": "LAL", "Memphis Grizzlies": "MEM", "Miami Heat": "MIA",
  "Milwaukee Bucks": "MIL", "Minnesota Timberwolves": "MIN", "New Orleans Pelicans": "NOP", "New York Knicks": "NYK",
  "Oklahoma City Thunder": "OKC", "Orlando Magic": "ORL", "Philadelphia 76ers": "PHI", "Phoenix Suns": "PHX",
  "Portland Trail Blazers": "POR", "Sacramento Kings": "SAC", "San Antonio Spurs": "SAS", "Toronto Raptors": "TOR",
  "Utah Jazz": "UTA", "Washington Wizards": "WAS",
  "Arizona Cardinals": "ARI", "Atlanta Falcons": "ATL", "Baltimore Ravens": "BAL", "Buffalo Bills": "BUF",
  "Carolina Panthers": "CAR", "Chicago Bears": "CHI", "Cincinnati Bengals": "CIN", "Cleveland Browns": "CLE",
  "Dallas Cowboys": "DAL", "Denver Broncos": "DEN", "Detroit Lions": "DET", "Green Bay Packers": "GB",
  "Houston Texans": "HOU", "Indianapolis Colts": "IND", "Jacksonville Jaguars": "JAX", "Kansas City Chiefs": "KC",
  "Las Vegas Raiders": "LV", "Los Angeles Chargers": "LAC", "Los Angeles Rams": "LAR", "Miami Dolphins": "MIA",
  "Minnesota Vikings": "MIN", "New England Patriots": "NE", "New Orleans Saints": "NO", "New York Giants": "NYG",
  "New York Jets": "NYJ", "Philadelphia Eagles": "PHI", "Pittsburgh Steelers": "PIT", "San Francisco 49ers": "SF",
  "Seattle Seahawks": "SEA", "Tampa Bay Buccaneers": "TB", "Tennessee Titans": "TEN", "Washington Commanders": "WSH",
  "Arizona Diamondbacks": "ARI", "Atlanta Braves": "ATL", "Baltimore Orioles": "BAL", "Boston Red Sox": "BOS",
  "Chicago White Sox": "CHW", "Chicago Cubs": "CHC", "Cincinnati Reds": "CIN", "Cleveland Guardians": "CLE",
  "Colorado Rockies": "COL", "Detroit Tigers": "DET", "Houston Astros": "HOU", "Kansas City Royals": "KC",
  "Los Angeles Angels": "LAA", "Los Angeles Dodgers": "LAD", "Miami Marlins": "MIA", "Milwaukee Brewers": "MIL",
  "Minnesota Twins": "MIN", "New York Yankees": "NYY", "New York Mets": "NYM", "Oakland Athletics": "OAK",
  "Philadelphia Phillies": "PHI", "Pittsburgh Pirates": "PIT", "San Diego Padres": "SD", "San Francisco Giants": "SF",
  "Seattle Mariners": "SEA", "St. Louis Cardinals": "STL", "Tampa Bay Rays": "TB", "Texas Rangers": "TEX",
  "Toronto Blue Jays": "TOR", "Washington Nationals": "WSH"
}

const getLeagueFromTeam = (teamName) => {
  const code = espnCodeMap[teamName]
  if (!code) return null

  const nba = ["LAL", "GSW", "NYK", "BOS", "PHX", "DAL", "MIA", "CHI", "CLE"]
  const nfl = ["DAL", "BUF", "PHI", "NE", "KC", "NYG", "GB", "SF", "MIN"]
  const mlb = ["NYY", "LAD", "BOS", "ATL", "HOU", "NYM", "CHC", "PHI"]

  if (nba.includes(code)) return "basketball/nba"
  if (nfl.includes(code)) return "football/nfl"
  if (mlb.includes(code)) return "baseball/mlb"

  return null
}

const fetchEspnTeamData = async (teamName) => {
  teamData.value = null
  const code = espnCodeMap[teamName]
  const league = getLeagueFromTeam(teamName)

  if (!code || !league) return

  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${league}/teams/${code}`)
    const data = await res.json()

    const logo = data.team?.logos?.[0]?.href
    const displayName = data.team?.displayName || teamName

    const schedule = (data.team?.nextEvent || []).map((event) => {
      const opponent = event.competitions?.[0]?.competitors?.find(c => c.team?.abbreviation !== code)
      return {
        date: new Date(event.date).toLocaleString(),
        opponent: opponent?.team?.displayName || 'Unknown'
      }
    })

    teamData.value = {
      displayName,
      logo,
      schedule
    }
  } catch (err) {
    console.error('❌ ESPN API error:', err)
  }
}

const fetchTeamList = async () => {
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
  } else {
    router.push('/create-profile')
  }
}

const goToTeam = (teamName) => {
  router.push(`/team/${teamName}`)
}

onMounted(async () => {
  await fetchTeamList()
  currentTeam.value = route.params.teamName
  fetchEspnTeamData(currentTeam.value)
})

watch(
  () => route.params.teamName,
  async (newTeam) => {
    currentTeam.value = newTeam
    fetchEspnTeamData(newTeam)
  },
  { immediate: true }
)
import { updateDoc, arrayUnion } from 'firebase/firestore'

const addFavoriteGame = async (game) => {
  const user = auth.currentUser
  if (!user) return alert('Please log in to favorite games.')

  const userRef = doc(db, 'users', user.uid)

  const favorite = {
    team: currentTeam.value,
    opponent: game.opponent,
    date: game.date,
    favoritedAt: new Date().toISOString()
  }

  try {
    await updateDoc(userRef, {
      favoriteGames: arrayUnion(favorite)
    })
    alert('✅ Game added to favorites!')
  } catch (err) {
    console.error('❌ Error saving favorite:', err)
    alert('Failed to favorite game.')
  }
}

</script>


