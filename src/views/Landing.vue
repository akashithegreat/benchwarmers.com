<template>
    <div class="min-h-screen bg-black text-white font-sans">
      <!-- Header -->
      <header class="text-center py-10 text-4xl font-extrabold tracking-wide">
        benchwarmers.com
      </header>
  
      <!-- Hero Section -->
      <section class="flex flex-col items-center justify-center gap-6 mt-20 px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
          <router-link to="/login" class="box bg-gray-800 hover:bg-gray-700">
            <h2 class="text-2xl font-semibold">Get in the Game</h2>
            <p class="text-sm text-gray-400 mt-2">Already got an account? Let’s go.</p>
          </router-link>
  
          <router-link to="/register" class="box bg-gray-800 hover:bg-gray-700">
            <h2 class="text-2xl font-semibold">Make Your First Play</h2>
            <p class="text-sm text-gray-400 mt-2">Sign up and start tracking your teams.</p>
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
  