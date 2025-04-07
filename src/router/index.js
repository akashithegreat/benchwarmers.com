import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import CreateProfile from '../views/CreateProfile.vue'
import YourSquads from '../views/YourSquads.vue'
import TeamPage from '../views/TeamPage.vue'

const routes = [
    { path: '/', component: Landing },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/create-profile', component: CreateProfile },
    { path: '/squads', component: YourSquads },
    { path: '/team/:teamName', component: TeamPage }
  ]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
