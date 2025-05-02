<script setup>
import { ref } from 'vue';

// Props for customization
const props = defineProps({
  announcementText: {
    type: String,
    default: 'Fly to and from Ontario with STARLUX from June 2!'
  },
  showAnnouncementBanner: {
    type: Boolean,
    default: true
  },
  currentLanguage: {
    type: String,
    default: 'English'
  },
  currentRegion: {
    type: String,
    default: 'Taiwan'
  }
});

// Carousel slide indicators
const currentSlide = ref(1);
const totalSlides = ref(3);

// Navigation items - can be moved to props if needed for customization
const navigationItems = [
  { text: 'Plan a Trip', href: '#' },
  { text: 'Timetable', href: '#' },
  { text: 'Flight Status', href: '#' },
  { text: 'Check-in & Fly', href: '#' },
  { text: 'Experience', href: '#' },
  { text: 'COSMILE', href: '#' },
  { text: 'Support', href: '#' },
];

// Methods
const nextSlide = () => {
  if (currentSlide.value < totalSlides.value) {
    currentSlide.value++;
  } else {
    currentSlide.value = 1;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 1) {
    currentSlide.value--;
  } else {
    currentSlide.value = totalSlides.value;
  }
};
</script>

<template>
  <div class="starlux-header">
    <!-- Announcement banner -->
    <div
      v-if="showAnnouncementBanner"
      class="bg-red-600 text-white py-2 px-4 flex justify-between items-center"
    >
      <div class="flex items-center">
        <span
          class="rounded-full bg-white text-red-600 w-5 h-5 flex items-center justify-center mr-2 text-xs"
          >!</span
        >
        <span>{{ announcementText }}</span>
      </div>
      <div class="flex items-center">
        <button class="mr-2 text-white" aria-label="Pause">
          <span class="text-xl">⏸</span>
        </button>
        <button @click="prevSlide" class="mr-2 text-white" aria-label="Previous slide">
          <span class="text-xl">◀</span>
        </button>
        <span class="mx-2">{{ currentSlide }}/{{ totalSlides }}</span>
        <button @click="nextSlide" class="mr-2 text-white" aria-label="Next slide">
          <span class="text-xl">▶</span>
        </button>
        <a href="#" class="text-white underline">View All</a>
      </div>
    </div>

    <!-- Navigation header -->
    <header class="bg-slate-800 text-white py-4 shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="flex items-center py-3 justify-between">
              <!-- STARLUX Logo -->
              <a
                href="/"
                aria-label="Starlux Airlines Homepage"
                class="flex space-x-1 items-end text-white nuxt-link-exact-active nuxt-link-active"
              >
                <!-- Star logo -->
                <svg
                  width="36"
                  height="30"
                  viewBox="0 0 36 30"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  class="flex-shrink-0 pointer-events-none"
                >
                  <path
                    d="M15.0002 12.9998L25.0002 2.9998C26.1002 1.9998 27.3002 1.2998 28.8002 0.799805H18.8002C18.7002 0.799805 18.6002 0.799805 18.4002 0.799805H18.2002H18.1002C17.8002 0.799805 17.5002 0.899805 17.2002 0.899805H17.0002C16.0002 1.1998 15.2002 1.5998 14.4002 2.1998C14.2002 2.3998 14.0002 2.4998 13.8002 2.6998L1.7002 14.9998H10.0002C11.9002 14.9998 13.7002 14.2998 15.0002 12.9998Z"
                    fill="#996A4E"
                  ></path>
                  <path
                    d="M13.8 17.1L3.9 27C2.9 28 1.6 28.8 0 29.2H10C10.2 29.2 10.4 29.2 10.5 29.2H10.6C10.9 29.2 11.2 29.1 11.5 29.1H11.7C12.6 28.8 13.5 28.4 14.3 27.8C14.5 27.6 14.7 27.5 14.9 27.3L27.2 15H18.9C17 15 15.2 15.8 13.8 17.1Z"
                    fill="#84754E"
                  ></path>
                  <path
                    d="M31.2999 8.5998C31.2999 8.4998 31.2999 8.4998 31.3999 8.4998C32.4999 8.1998 35.6999 7.7998 35.6999 7.7998C35.6999 7.7998 32.4999 7.5998 31.3999 7.2998L31.2999 7.1998C31.3999 6.7998 32.3999 5.4998 32.3999 5.4998L30.6999 6.6998C30.6999 6.6998 30.5999 6.6998 30.5999 6.5998C30.2999 4.8998 29.9999 1.7998 29.9999 1.7998C29.9999 1.7998 29.7999 4.8998 29.3999 6.5998C29.3999 6.5998 29.3999 6.6998 29.2999 6.6998L27.5999 5.4998C27.5999 5.4998 28.5999 6.7998 28.7999 7.1998C28.7999 7.1998 28.7999 7.2998 28.6999 7.2998C27.5999 7.5998 24.3999 7.8998 24.3999 7.8998C24.3999 7.8998 27.5999 8.1998 28.6999 8.5998L28.7999 8.6998C28.6999 9.0998 27.6999 10.2998 27.6999 10.2998L29.3999 9.2998C29.3999 9.2998 29.4999 9.2998 29.4999 9.3998C29.7999 11.0998 30.0999 14.1998 30.0999 14.1998C30.0999 14.1998 30.2999 11.0998 30.6999 9.3998C30.6999 9.3998 30.6999 9.2998 30.7999 9.2998L32.4999 10.2998C32.4999 10.1998 31.4999 8.9998 31.2999 8.5998Z"
                    fill="#996A4E"
                  ></path>
                </svg>
                <!-- Text logo -->
                <svg
                  width="109"
                  height="16"
                  viewBox="0 0 109 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  class="flex-shrink-0 pointer-events-none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11 6.80039C14.6 6.80039 16.3 7.90039 16.3 10.3004V11.5004C16.3 14.9004 13.5 15.2004 10.7 15.2004H0.4C0.2 15.2004 0 15.0004 0 14.8004V13.3004C0 13.1004 0.2 12.9004 0.4 12.9004H9.9C12.5 12.9004 13.3 12.6004 13.3 10.7004C13.3 9.10039 12.7 8.80039 10.4 8.80039H7.9C2.3 8.80039 0.3 8.50039 0.3 4.70039C0.3 1.40039 2.3 0.900391 6.1 0.900391H15.4C15.6 0.900391 15.8 1.10039 15.8 1.30039V2.70039C15.8 2.90039 15.6 3.10039 15.4 3.10039H7.6C7.32026 3.10039 7.05705 3.09895 6.80957 3.0976H6.80951H6.80945C4.13762 3.08301 3.3 3.07844 3.3 5.00039C3.3 6.40039 3.5 6.80039 6.5 6.80039H11ZM57.9 9.30039C62.1 14.8004 62.4 15.2004 62.4 15.2004H59.4C59 15.2004 58.7 15.1004 58.4 14.8004L53.1 7.20039H54.4H55.7C56.7 7.20039 58.5 6.70039 58.6 5.00039C58.6 4.30039 58.3 3.70039 57.5 3.40039C57 3.20039 56.2 3.00039 55.8 3.00039C55.5856 3.00039 55.3138 2.97167 55.0616 2.94501C54.8431 2.92193 54.6392 2.90039 54.5 2.90039H50.7C50.5 2.90039 50.2 3.00039 50.2 3.40039V14.9004C50.2 15.1004 50 15.3004 49.8 15.3004H47.4C47.2 15.3004 47 15.1004 47 14.9004V1.50039C47 1.30039 47.2 1.10039 47.4 1.10039H55.2H55.8C56 1.10039 57.9 1.10039 59.4 2.00039C60.7 2.80039 61.5 3.90039 61.5 5.00039C61.5 7.90039 58.1 8.80039 58 8.80039C57.7 8.90039 57.7 9.00039 57.7 9.00039C57.7 9.10039 57.7 9.20039 57.9 9.30039ZM76.7 13.6004C76.7 13.4004 76.5 13.2004 76.3 13.2004C76.3 13.2004 66.9 13.2004 66.9 13.3004C66.7 13.3004 66.5 13.1004 66.5 12.9004V1.70039C66.5 1.40039 66.2 1.10039 65.9 1.10039H64C63.7 1.10039 63.4 1.40039 63.4 1.70039V14.7004C63.4 15.0004 63.7 15.3004 64 15.3004H76.3C76.5 15.3004 76.7 15.1004 76.7 14.9004V13.6004ZM91.5 0.900391C91.8 0.900391 92.1 1.20039 92.1 1.50039V10.3004C92.1 13.2004 89 15.2004 84.7 15.2004C80.4 15.2004 77.3 13.1004 77.3 10.3004V1.50039C77.3 1.20039 77.6 0.900391 77.9 0.900391H79.8C80.1 0.900391 80.4 1.20039 80.4 1.50039V10.0004C80.4 11.9004 82 13.0004 84.7 13.0004C87.3 13.0004 89 11.8004 89 10.0004V1.50039C89 1.20039 89.3 0.900391 89.6 0.900391H91.5ZM108.7 15.2004L102.5 8.10039C102.5 8.00039 102.5 7.90039 102.6 7.80039L107.8 1.70039C107.9 1.60039 107.9 1.50039 107.9 1.40039C107.9 1.20039 107.7 1.00039 107.5 1.00039H105.6C105.2 1.00039 104.7 1.20039 104.5 1.40039L100.8 5.60039C100.8 5.70039 100.7 5.70039 100.6 5.70039C100.558 5.70039 100.533 5.70039 100.511 5.69272C100.482 5.68233 100.458 5.6579 100.4 5.60039L96.7 1.40039C96.5 1.20039 96 1.00039 95.6 1.00039H93.7C93.5 1.00039 93.3 1.20039 93.3 1.40039C93.3 1.50039 93.3 1.60039 93.4 1.70039L98.6 7.80039C98.7 7.90039 98.7 8.00039 98.6 8.10039L92.4 15.2004H95.2C95.8 15.2004 96.1 15.0004 96.3 14.8004L100.3 10.1004C100.3 10.0004 100.4 10.0004 100.5 10.0004C100.542 10.0004 100.567 10.0004 100.589 10.0081C100.618 10.0184 100.642 10.0429 100.7 10.1004L104.8 14.8004C105 15.0004 105.3 15.2004 105.9 15.2004H108.7ZM43.1 15.2004C42.7 15.2004 42.4 15.0004 42.2 14.7004L37 4.20039C37 4.10039 36.9 4.10039 36.9 4.10039C36.8 4.10039 36.8 4.10039 36.7 4.20039C36.7 4.20039 32.4 13.0004 31.5 14.6004C31.3 14.9004 31 15.2004 30.6 15.2004H28L35.4 1.30039C35.5 1.10039 35.7 1.00039 36 1.00039H37.8C38 1.00039 38.2 1.10039 38.4 1.30039L45.8 15.2004H43.1ZM31.5 1.40039C31.5 1.20039 31.3 1.00039 31.1 1.00039H17.2C17 1.00039 16.8 1.20039 16.8 1.40039V2.50039C16.8 2.70039 17 2.90039 17.2 2.90039H22.2C22.4 2.90039 22.6 3.10039 22.6 3.30039V14.9004C22.6 15.1004 22.8 15.3004 23 15.3004H25.3C25.5 15.3004 25.7 15.1004 25.7 14.9004V3.30039C25.7 3.10039 25.9 2.90039 26.1 2.90039H31.1C31.3 2.90039 31.5 2.70039 31.5 2.50039V1.40039Z"
                    fill="white"
                  ></path>
                </svg>
              </a>
              <!-- Search icon in original but removed for simplicity -->
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <button class="text-white" aria-label="Search">
              <span class="text-xl">🔍</span>
            </button>
            <a href="#" class="text-white hover:underline">béshopping</a>
            <div class="flex items-center">
              <span>{{ currentRegion }} ({{ currentLanguage }})</span>
              <span class="ml-2">🌐</span>
            </div>
            <a href="#" class="text-white hover:underline flex items-center">
              Login
              <span class="ml-1">👤</span>
            </a>
          </div>
        </div>

        <!-- Main navigation -->
        <nav class="mt-4">
          <ul class="flex justify-around">
            <li v-for="(item, index) in navigationItems" :key="index">
              <a :href="item.href" class="px-4 py-2 hover:underline">{{ item.text }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  </div>
</template>