<template>
    <div class="container">
      <h1>Upcoming Sports Games</h1>
  
      <!-- Filter Section -->
      <div class="filters">
        <input v-model="searchQuery" placeholder="Search by team or league" />
        <select v-model="selectedSport">
          <option value="">All Sports</option>
          <option value="Soccer">Soccer</option>
          <option value="Basketball">Basketball</option>
          <option value="Tennis">Tennis</option>
        </select>
      </div>
  
      <!-- Games List -->
      <div class="games-list">
        <div v-for="game in filteredGames" :key="game.id" class="game-card">
          <h3>{{ game.league }}</h3>
          <p>{{ game.team1 }} vs {{ game.team2 }}</p>
          <p>{{ game.date }} | {{ game.time }}</p>
          <button @click="addToFavorites(game)">Add to Favorites</button>
        </div>
      </div>
  
      <router-link to="/favorites">View Favorites</router-link>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        searchQuery: '',
        selectedSport: '',
        games: []
      };
    },
    computed: {
      filteredGames() {
        return this.games.filter(game =>
          (this.selectedSport ? game.sport === this.selectedSport : true) &&
          (this.searchQuery
            ? game.team1.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              game.team2.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              game.league.toLowerCase().includes(this.searchQuery.toLowerCase())
            : true)
        );
      }
    },
    methods: {
      async fetchGames() {
        try {
          const response = await axios.get('https://api.example.com/sports-games'); // Replace with real API
          this.games = response.data;
        } catch (error) {
          console.error('Error fetching games:', error);
          // Use sample data in case API is unavailable
          this.games = [
            { id: 1, league: 'NBA', team1: 'Lakers', team2: 'Warriors', sport: 'Basketball', date: 'March 25', time: '7:00 PM' },
            { id: 2, league: 'Premier League', team1: 'Man United', team2: 'Chelsea', sport: 'Soccer', date: 'March 26', time: '2:00 PM' },
            { id: 3, league: 'ATP Finals', team1: 'Nadal', team2: 'Djokovic', sport: 'Tennis', date: 'March 27', time: '4:00 PM' }
          ];
        }
      },
      addToFavorites(game) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.some(fav => fav.id === game.id)) {
          favorites.push(game);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          alert('Added to favorites!');
        }
      }
    },
    mounted() {
      this.fetchGames();
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: auto;
    text-align: center;
  }
  .filters {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  input, select {
    padding: 5px;
  }
  .games-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .game-card {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
  }
  button {
    background-color: blue;
    color: white;
    border: none;
    padding: 5px 10px;
  }
  </style>
  