import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue';
import Favorites from '../views/Favorites.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/home',
    component: Home
  },
  { 
    path: '/favorites',
    component: Favorites 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
