<template>
    <div class="min-h-screen bg-black text-white font-sans">
      <!-- Header -->
      <header class="text-center py-10 text-4xl font-extrabold tracking-wide">
        benchwarmers
      </header>
  
      <!-- Hero Section -->
      <section class="flex flex-col items-center justify-center gap-6 mt-20 px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
<router-link
  to="/login"
  class="block bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-lg shadow-md w-full max-w-md mx-auto
         transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105
         hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50 cursor-pointer"
>
  <h2 class="text-xl font-semibold text-center">Get in the Game</h2>
  <p class="text-sm text-gray-400 mt-1 text-center">Already got an account? Let’s go.</p>
</router-link>

<router-link
  to="/register"
  class="block bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-lg shadow-md w-full max-w-md mx-auto
         transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105
         hover:ring-2 hover:ring-green-500 hover:ring-opacity-50 cursor-pointer"
>
  <h2 class="text-xl font-semibold text-center">Make Your First Play</h2>
  <p class="text-sm text-gray-400 mt-1 text-center">Sign up and start tracking your teams.</p>
</router-link>
        </div>
      </section>
  
      <!-- Features Section -->
      <section class="mt-32 px-6 max-w-5xl mx-auto text-center">
        <h3 class="text-3xl font-bold mb-10">What You Can Do</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div class="feature">
            <h4 class="text-xl font-semibold mb-2">Live Scores</h4>
            <p class="text-sm text-gray-400">Follow your favorite teams and players in real-time.</p>
          </div>
          <div class="feature">
            <h4 class="text-xl font-semibold mb-2">Fan Chat</h4>
            <p class="text-sm text-gray-400">Talk trash or cheer together with live discussions.</p>
          </div>
          <div class="feature">
            <h4 class="text-xl font-semibold mb-2">Player Alerts</h4>
            <p class="text-sm text-gray-400">Get notified when your star drops 30 or gets ejected.</p>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  // No logic needed yet
  </script>
  
  <style>
 
  </style>
  