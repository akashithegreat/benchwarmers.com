<template>
    <div class="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div class="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Pick Your Sports</h2>
  
        <!-- Step 1: Choose Sports -->
        <div class="mb-6 space-y-3">
          <div v-for="sport in sportsList" :key="sport" class="flex items-center">
            <input
              type="checkbox"
              :value="sport"
              v-model="selectedSports"
              class="mr-2 accent-green-600"
            />
            <label>{{ sport }}</label>
          </div>
        </div>
  
        <!-- Step 2: Choose Favorite Team per Selected Sport -->
        <div v-for="sport in selectedSports" :key="sport" class="mb-4">
          <label class="block mb-1 text-sm font-semibold">Favorite {{ sport }} Team:</label>
          <select
            v-model="selectedTeams[sport]"
            class="w-full p-2 bg-black border border-gray-700 rounded text-white"
          >
            <option disabled value="">Select a team</option>
            <option v-for="team in teamsBySport[sport]" :key="team" :value="team">
              {{ team }}
            </option>
          </select>
        </div>
  
        <!-- Submit -->
        <button
          @click="submitProfile"
          class="mt-6 bg-green-600 hover:bg-green-700 py-2 px-4 rounded w-full font-semibold"
        >
          Save Profile
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { db, auth } from '../firebase'
  import { doc, updateDoc } from 'firebase/firestore'
  
  // Sport options
  const sportsList = ['Basketball', 'Football', 'Baseball']
  
  // Team options (hardcoded)
  const teamsBySport = {
    Basketball: [
  "Atlanta Hawks",
  "Boston Celtics",
  "Brooklyn Nets",
  "Charlotte Hornets",
  "Chicago Bulls",
  "Cleveland Cavaliers",
  "Dallas Mavericks",
  "Denver Nuggets",
  "Detroit Pistons",
  "Golden State Warriors",
  "Houston Rockets",
  "Indiana Pacers",
  "Los Angeles Clippers",
  "Los Angeles Lakers",
  "Memphis Grizzlies",
  "Miami Heat",
  "Milwaukee Bucks",
  "Minnesota Timberwolves",
  "New Orleans Pelicans",
  "New York Knicks",
  "Oklahoma City Thunder",
  "Orlando Magic",
  "Philadelphia 76ers",
  "Phoenix Suns",
  "Portland Trail Blazers",
  "Sacramento Kings",
  "San Antonio Spurs",
  "Toronto Raptors",
  "Utah Jazz",
  "Washington Wizards"
],
    Football: [
  "Arizona Cardinals",
  "Atlanta Falcons",
  "Baltimore Ravens",
  "Buffalo Bills",
  "Carolina Panthers",
  "Chicago Bears",
  "Cincinnati Bengals",
  "Cleveland Browns",
  "Dallas Cowboys",
  "Denver Broncos",
  "Detroit Lions",
  "Green Bay Packers",
  "Houston Texans",
  "Indianapolis Colts",
  "Jacksonville Jaguars",
  "Kansas City Chiefs",
  "Las Vegas Raiders",
  "Los Angeles Chargers",
  "Los Angeles Rams",
  "Miami Dolphins",
  "Minnesota Vikings",
  "New England Patriots",
  "New Orleans Saints",
  "New York Giants",
  "New York Jets",
  "Philadelphia Eagles",
  "Pittsburgh Steelers",
  "San Francisco 49ers",
  "Seattle Seahawks",
  "Tampa Bay Buccaneers",
  "Tennessee Titans",
  "Washington Commanders"
],
    Baseball: [
  "Arizona Diamondbacks",
  "Atlanta Braves",
  "Baltimore Orioles",
  "Boston Red Sox",
  "Chicago White Sox",
  "Chicago Cubs",
  "Cincinnati Reds",
  "Cleveland Guardians",
  "Colorado Rockies",
  "Detroit Tigers",
  "Houston Astros",
  "Kansas City Royals",
  "Los Angeles Angels",
  "Los Angeles Dodgers",
  "Miami Marlins",
  "Milwaukee Brewers",
  "Minnesota Twins",
  "New York Yankees",
  "New York Mets",
  "Oakland Athletics",
  "Philadelphia Phillies",
  "Pittsburgh Pirates",
  "San Diego Padres",
  "San Francisco Giants",
  "Seattle Mariners",
  "St. Louis Cardinals",
  "Tampa Bay Rays",
  "Texas Rangers",
  "Toronto Blue Jays",
  "Washington Nationals"
],
  }
  
  const selectedSports = ref([])
  const selectedTeams = ref({})
  
  const router = useRouter()
  
  const submitProfile = async () => {
    if (selectedSports.value.length === 0) {
      alert('Please select at least one sport.')
      return
    }
  
    for (const sport of selectedSports.value) {
      if (!selectedTeams.value[sport]) {
        alert(`Please select a team for ${sport}.`)
        return
      }
    }
  
    try {
      const user = auth.currentUser
      if (!user) throw new Error('User not logged in')
  
      const profileData = {
        selectedSports: selectedSports.value,
        favoriteTeams: selectedTeams.value,
      }
  
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, profileData)
  
      alert('✅ Profile saved successfully!')
      // Redirect to home or dashboard
      router.push('/squads')
    } catch (err) {
      console.error('❌ Error saving profile:', err)
      alert('Failed to save profile: ' + err.message)
    }
  }
  </script>
  
