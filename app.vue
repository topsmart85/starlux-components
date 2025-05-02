<script setup lang="ts">

import FlightSearch from '~/components/FlightSearch.vue'
import InteractiveTabs from '~/components/InteractiveTabs.vue'
import { onMounted } from 'vue'

// Ensure we announce page load for screen readers
onMounted(() => {
  document.title = 'StarLux Airlines - Book Your Flight'
})
</script>

<template>
  <div class="app min-h-screen flex flex-col">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:p-4 focus:bg-blue-600 focus:text-white focus:absolute focus:z-50">
      Skip to main content
    </a>
    
    <header class="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-6 shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-center">
          <h1 class="text-3xl font-bold">
            <span aria-hidden="true" class="mr-2">✈️</span>
            StarLux Airlines
          </h1>
        </div>
        <p class="text-center mt-2 text-blue-100">Elevate Your Journey</p>
      </div>
    </header>
    
    <main id="main-content" class="container mx-auto px-4 py-8 flex-grow">
      <section class="mb-12 bg-white rounded-lg shadow-md p-6" aria-labelledby="search-heading">
        <h2 id="search-heading" class="text-2xl font-semibold mb-4 text-blue-800 border-b pb-2">
          Expandable Flight Search
        </h2>
        <FlightSearch />
      </section>

      <section class="bg-white rounded-lg shadow-md p-6" aria-labelledby="tabs-heading">
        <h2 id="tabs-heading" class="text-2xl font-semibold mb-4 text-blue-800 border-b pb-2">
          Interactive Tabs
        </h2>
        <InteractiveTabs />
      </section>
    </main>
    
    <footer class="bg-gray-800 text-white py-6 mt-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row md:justify-between">
          <div class="mb-4 md:mb-0">
            <p class="font-semibold mb-2">StarLux Airlines</p>
            <p class="text-sm text-gray-300">© 2025 All Rights Reserved</p>
          </div>
          <nav aria-label="Footer Navigation">
            <ul class="flex flex-wrap gap-6">
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Accessibility</a></li>
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
:root {
  --primary-color: #1e40af;
  --primary-hover: #1e3a8a;
  --accent-color: #4f46e5;
  --text-color: #333333;
  --background-color: #f5f5f5;
  --card-background: #ffffff;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

/* Focus styles for accessibility */
*:focus-visible {
  outline: 3px solid var(--accent-color);
  outline-offset: 2px;
}

/* Ensure all interactive elements have accessible hover/focus states */
a:hover, 
button:hover:not(:disabled) {
  filter: brightness(110%);
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>