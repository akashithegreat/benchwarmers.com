<template>
  <div id="app">
    <nav v-if="!isAuthPage">
      <router-link to="/">Home</router-link>
      <router-link to="/favorites">Favorites</router-link>
    </nav>
    <div v-else class="site-header">
      <h1>benchwarmers.com</h1> 
    </div>
    <router-view />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: "App",
  setup() {
    const route = useRoute()
    const isAuthPage = computed(() =>
      route.path === '/login' || route.path === '/register'
    )
    return { isAuthPage }
  }
}
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
}
nav {
  background: #333;
  padding: 10px;
}
nav a {
  color: white;
  text-decoration: none;
  margin: 0 10px;
}
nav a:hover {
  text-decoration: underline;
}
</style>
