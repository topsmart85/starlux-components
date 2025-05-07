<script setup lang="ts">
import FlightSearch from "~/components/FlightSearch.vue";
import InteractiveTabs from "~/components/InteractiveTabs.vue";
import { onMounted, ref } from "vue";
import bgImage from '@/assets/img/bg.jpg';

// Carousel slide indicators
const currentSlide = ref(3);
const totalSlides = ref(3);

// Ensure we announce page load for screen readers
onMounted(() => {
  document.title = "STARLUX Airlines - Book Your Flight";
});

</script>

<template>
  <div class="app min-h-screen flex flex-col">   
  
    <!-- Navigation header -->
    <StarluxHeader 
      announcementText="Special offer: 20% off all flights to Japan!"
      :showAnnouncementBanner="true"
      currentLanguage="English"
      currentRegion="Taiwan"
    />
    <div class="w-full">
    <!-- Hero search section with background image -->
      <section class="relative">                
        <!-- Flight search overlay -->
        <div class="relative z-10 bg-cover min-h-[697px] bg-center" :style="{ backgroundImage: `url(${bgImage})` }">
          <!-- Translucent purple flight search bar -->
          <FlightSearch />

          <!-- Caption area -->
          <div class="container mx-auto px-4 pb-8 absolute bottom-0">
            <div class="flex flex-col items-start">
              <h1 class="text-5xl font-light text-white drop-shadow-lg mb-4">
                Voyage
              </h1>
              <p class="text-white text-lg drop-shadow-lg max-w-2xl">
                Let the gentle breeze guide your journey as the light of a spring
                dawn awakens your senses.
              </p>
              <div class="mt-2 flex items-center justify-between w-full">
                <div>
                  <h2 class="text-white text-2xl font-light drop-shadow-lg">
                    Takamatsu
                  </h2>
                </div>
                <div class="flex items-center">
                  <button class="text-white mr-2" aria-label="Play">
                    <span class="text-xl">▶</span>
                  </button>
                  <span class="text-white">1 / 6</span>
                  <button class="text-white ml-2" aria-label="Next">
                    <span class="text-xl">▶</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InteractiveTabs />

      <!-- Chat with agent button -->
      <div class="fixed bottom-4 right-4 z-50">
        <button
          class="bg-black text-white py-2 px-4 rounded-lg flex items-center shadow-lg"
        >
          <span class="mr-2">💬</span>
          Chat with an Agent
        </button>
      </div>
    </div>
  </div>
</template>
