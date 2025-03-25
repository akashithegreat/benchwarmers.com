<template>
    <div class="container">
      <h1>Favorite Games</h1>
  
      <div v-if="favorites.length === 0">No favorites added yet.</div>
  
      <div v-for="game in favorites" :key="game.id" class="game-card">
        <h3>{{ game.league }}</h3>
        <p>{{ game.team1 }} vs {{ game.team2 }}</p>
        <p>{{ game.date }} | {{ game.time }}</p>
        <button @click="removeFromFavorites(game.id)">Remove</button>
      </div>
  
      <router-link to="/">Back to Home</router-link>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        favorites: []
      };
    },
    methods: {
      loadFavorites() {
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      },
      removeFromFavorites(id) {
        this.favorites = this.favorites.filter(game => game.id !== id);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      }
    },
    mounted() {
      this.loadFavorites();
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: auto;
    text-align: center;
  }
  .game-card {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  button {
    background-color: red;
    color: white;
    border: none;
    padding: 5px 10px;
  }
  </style>
  