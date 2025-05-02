<script setup lang="ts">
import { ref } from 'vue'
import { CircleUser, CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-vue-next'

// Define tabs
const tabs = [
  { id: 'my-trip', label: 'My Trip', icon: CircleUser },
  { id: 'check-in', label: 'Check In', icon: CheckCircle },
  { id: 'flight-status', label: 'Flight Status', icon: Clock }
]

const activeTab = ref('') // No default active tab
const showTabs = ref(true) // Control visibility of tabs navigation

// Form data
const bookingRef = ref('')
const lastName = ref('')
const firstName = ref('')

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  // Hide tabs navigation when "My Trip" or "Check In" is selected
  if (tabId === 'my-trip' || tabId === 'check-in') {
    showTabs.value = false
  }
}

// Go back to tabs view
const backToTabs = () => {
  showTabs.value = true
  activeTab.value = '' // Clear active tab when returning to tabs view
}

const handleSubmit = () => {
  // In a real implementation, this would handle form submission
  console.log('Form submitted', { bookingRef: bookingRef.value, lastName: lastName.value, firstName: firstName.value })
}
</script>

<template>
  <div class="interactive-tabs max-w-4xl mx-auto">
    <!-- Tabs Navigation - Only shown when showTabs is true -->
    <div v-if="showTabs" class="tab-navigation bg-purple-950 text-gray-300 flex" role="tablist">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="setActiveTab(tab.id)"
        :class="[
          'tab-item flex-1 flex justify-center items-center p-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-400',
          activeTab === tab.id ? 'text-white border-b-2 border-amber-500' : 'hover:text-white'
        ]"
        :aria-selected="activeTab === tab.id"
        :tabindex="activeTab === tab.id ? 0 : -1"
        role="tab"
        :id="`tab-${tab.id}`"
        :aria-controls="`panel-${tab.id}`"
      >
        <component :is="tab.icon" class="mr-2" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content - Only shown when an activeTab is selected -->
    <div v-if="activeTab" class="tab-content bg-purple-950">
      <!-- My Trip Panel -->
      <div 
        v-if="activeTab === 'my-trip'"
        role="tabpanel"
        id="panel-my-trip"
        aria-labelledby="tab-my-trip"
        class="tab-panel p-6"
      >
        <form @submit.prevent="handleSubmit" class="flex flex-col md:flex-row items-center gap-4">
          <button 
            @click="backToTabs" 
            type="button" 
            class="text-white cursor-pointer" 
            aria-label="Back to tabs"
          >
            <ChevronLeft />
          </button>
          
          <div class="flex-1 flex flex-col md:flex-row gap-4 w-full">
            <div class="relative flex-1">
              <input
                v-model="bookingRef"
                type="text"
                class="w-full bg-white border border-gray-300 rounded p-3 pl-4 text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Booking reference/E-ticket number"
                aria-label="Booking reference or E-ticket number"
                required
              />
              <span class="absolute top-0 left-0 px-1 text-red-500">*</span>
            </div>
            
            <div class="relative flex-1">
              <input
                v-model="lastName"
                type="text"
                class="w-full bg-white border border-gray-300 rounded p-3 text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Last name/Surname"
                aria-label="Last name or Surname"
                required
              />
              <span class="absolute top-0 left-0 px-1 text-red-500">*</span>
            </div>
            
            <div class="relative flex-1">
              <input
                v-model="firstName"
                type="text"
                class="w-full bg-white border border-gray-300 rounded p-3 text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="First name/Given name"
                aria-label="First name or Given name"
                required
              />
              <span class="absolute top-0 left-0 px-1 text-red-500">*</span>
            </div>
          </div>
          
          <button 
            type="submit"
            class="bg-amber-500 hover:bg-amber-600 text-black p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Submit trip details"
          >
            <ChevronRight :size='24' />
          </button>
        </form>
      </div>

      <!-- Check In Panel -->
      <div 
        v-if="activeTab === 'check-in'"
        role="tabpanel"
        id="panel-check-in"
        aria-labelledby="tab-check-in"
        class="tab-panel p-6"
      >
        <form @submit.prevent="handleSubmit" class="flex flex-col md:flex-row items-center gap-4">
          <button 
            @click="backToTabs" 
            type="button" 
            class="text-white cursor-pointer" 
            aria-label="Back to tabs"
          >
            <ChevronLeft />
          </button>
          
          <div class="flex-1 flex flex-col md:flex-row gap-4 w-full">
            <div class="relative flex-1">
              <input
                v-model="bookingRef"
                type="text"
                class="w-full bg-purple-900 border border-gray-600 rounded p-3 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Booking reference/E-ticket number"
                aria-label="Booking reference or E-ticket number"
                required
              />
              <span class="absolute top-0 left-0 px-1 text-red-500">*</span>
            </div>
            
            <div class="relative flex-1">
              <input
                v-model="lastName"
                type="text"
                class="w-full bg-purple-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Last name/Surname"
                aria-label="Last name or Surname"
                required
              />
              <span class="absolute top-0 left-0 px-1 text-red-500">*</span>
            </div>
            
            <div class="relative flex-1">
              <input
                v-model="firstName"
                type="text"
                class="w-full bg-purple-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="First name/Given name"
                aria-label="First name or Given name"
                required
              />
              <span class="absolute top-0 left-0 px-1 text-red-500">*</span>
            </div>
          </div>
          
          <button 
            type="submit"
            class="bg-amber-500 hover:bg-amber-600 text-black p-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Submit check-in details"
          >
            <ChevronRight :size='24' />
          </button>
        </form>
      </div>

      <!-- Flight Status Panel -->
      <div 
        v-if="activeTab === 'flight-status'"
        role="tabpanel"
        id="panel-flight-status"
        aria-labelledby="tab-flight-status"
        class="tab-panel p-6 text-white"
      >
        <p class="text-center">Search for flight status information</p>
      </div>
    </div>
  </div>
</template>