<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/favorites">Favorites</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
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
