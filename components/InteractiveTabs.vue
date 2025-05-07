<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { User, CheckSquare, Clock, ChevronLeft, ChevronRight } from 'lucide-vue-next'

// Define tabs
const tabs = [
  { id: 'my-trip', label: 'My Trip', icon: User },
  { id: 'check-in', label: 'Check In', icon: CheckSquare },
  { id: 'flight-status', label: 'Flight Status', icon: Clock }
]

//Define flight status
const flightStatus = [
  { id: 'route', label: 'By Route'},
  { id: 'flight-number', label: 'By Flight Number'}
]

const selectedFlightStatus = ref('route') //Default Flight Status

const activeTab = ref('') // No default active tab
const showTabs = ref(true) // Control visibility of tabs navigation

// Form data
const bookingRef = ref('')
const lastName = ref('')
const firstName = ref('')

// Refs for focus management - use proper typing
const tabRefs = ref<Record<string, HTMLElement | null>>({})
const backButtonRef = ref<HTMLElement | null>(null)

// Function to set ref safely with proper type casting
const setTabRef = (el: any, id: string) => {
  if (el) {
    // Use $el for component instances or the element itself for DOM elements
    tabRefs.value[id] = el instanceof HTMLElement ? el : null
  }
}

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  // Hide tabs navigation when "My Trip" or "Check In" is selected
  if (tabId === 'my-trip' || tabId === 'check-in' || tabId === 'flight-status') {
    showTabs.value = false
    
    // Focus the back button after tab content is rendered
    nextTick(() => {
      if (backButtonRef.value) {
        backButtonRef.value.focus()
      }
    })
  }
}

const selectFlightStatus = (evt: Event) => {
  const target = evt.target as HTMLSelectElement
  selectedFlightStatus.value = target.value
}

// Go back to tabs view
const backToTabs = () => {
  showTabs.value = true
  activeTab.value = '' // Clear active tab when returning to tabs view
  
  // Focus the previously active tab after returning to tabs view
  nextTick(() => {
    // Focus the first tab by default
    const firstTabRef = tabRefs.value[tabs[0].id]
    if (firstTabRef) {
      firstTabRef.focus()
    }
  })
}

const handleSubmit = () => {
  // In a real implementation, this would handle form submission
  console.log('Form submitted', { bookingRef: bookingRef.value, lastName: lastName.value, firstName: firstName.value })
}

// Handle keyboard navigation for tabs
const handleTabKeyDown = (event: KeyboardEvent, tabId: string) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    setActiveTab(tabId)
  }
}

// Focus the first tab on component mount
onMounted(() => {
  nextTick(() => {
    const firstTabRef = tabRefs.value[tabs[0].id]
    if (firstTabRef) {
      firstTabRef.focus()
    }
  })
})
</script>

<template>
  <div class="bg-[#2c2020] border-t border-b border-white">
    <div class="interactive-tabs max-w-7xl mx-auto">
          
      <!-- Tabs Navigation - Only shown when showTabs is true -->
      <div v-if="showTabs" class="bg-[#2c2020] text-gray-300 flex" role="tablist">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="setActiveTab(tab.id)"
          @keydown="(e) => handleTabKeyDown(e, tab.id)"
          :class="[
            'tab-item flex-1 flex justify-center items-center p-6 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white font-light',
            activeTab === tab.id ? 'text-white border-b-2 border-amber-500' : 'hover:text-white'
          ]"
          :aria-selected="activeTab === tab.id"
          :tabindex="0"
          role="tab"
          :id="`tab-${tab.id}`"
          :aria-controls="`panel-${tab.id}`"
          :ref="el => setTabRef(el, tab.id)"
        >
          <component :is="tab.icon" class="mr-3" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content - Only shown when an activeTab is selected -->
      <div v-if="activeTab" class="bg-[#2c2020]">
        <!-- My Trip Panel -->
        <div 
          v-if="activeTab === 'my-trip'"
          role="tabpanel"
          id="panel-my-trip"
          aria-labelledby="tab-my-trip"
          class="tab-panel py-3 text-white"
        >
          <form @submit.prevent="handleSubmit" class="flex flex-col md:flex-row items-center gap-4">
            <button 
              @click="backToTabs" 
              type="button" 
              class="text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white" 
              aria-label="Back to tabs"
              ref="backButtonRef"
            >
              <ChevronLeft :size="24" />
            </button>

            <div class="w-[150px] flex"><component :is="User" class="mr-3" />My Trip</div>
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
              <ChevronRight :size="24" />
            </button>
          </form>
        </div>

        <!-- Check In Panel -->
        <div 
          v-if="activeTab === 'check-in'"
          role="tabpanel"
          id="panel-check-in"
          aria-labelledby="tab-check-in"
          class="tab-panel py-3 text-white"
        >
          <form @submit.prevent="handleSubmit" class="flex flex-col md:flex-row items-center gap-4">
            <button 
              @click="backToTabs" 
              type="button" 
              class="text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white" 
              aria-label="Back to tabs"
              ref="backButtonRef"
            >
              <ChevronLeft :size="24" />
            </button>

            <div class="w-[150px] flex"><component :is="CheckSquare" class="mr-3" />Check in</div>
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
                  class="w-full bg-white border border-gray-300 rounded p-3 pl-4 text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
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
                  class="w-full bg-white border border-gray-300 rounded p-3 pl-4 text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
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
              aria-label="Submit check-in details"
            >
              <ChevronRight :size="24" />
            </button>
          </form>
        </div>

        <!-- Flight Status Panel -->
        <div 
          v-if="activeTab === 'flight-status'"
          role="tabpanel"
          id="panel-flight-status"
          aria-labelledby="tab-flight-status"
          class="tab-panel py-3 text-white"
        >
          <form @submit.prevent="handleSubmit" class="flex flex-col md:flex-row items-center gap-4">
            <button 
              @click="backToTabs" 
              type="button" 
              class="text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white" 
              aria-label="Back to tabs"
              ref="backButtonRef"
            >
              <ChevronLeft :size="24" />
            </button>
            
            <div class="w-[150px] flex items-center">
              <Clock class="mr-3" />
              Flight Status
            </div>
            
            <div class="flex-1 flex flex-col md:flex-row gap-4 w-full">
              <div class="relative w-[200px]">
                <select 
                  @change="selectFlightStatus"
                  class="w-full appearance-none bg-white text-black border border-white rounded px-4 py-2 pr-8 focus:outline-none focus:border-amber-500"
                  :value="selectedFlightStatus"
                >
                  <option value="" disabled>Search By Route</option>
                  <option value="route">By Route</option>
                  <option value="flight">By Flight Number</option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight :size="16" class="text-black" />
                </div>
              </div>
              
              <div v-if="selectedFlightStatus === 'route'" class="flex-1 flex items-center gap-4">
                <div class="flex-1 relative flex gap-8 mx-4 cursor-pointer">
                  <div class="text-3xl">From</div>
                  <div class="hover:underline">Please select</div>
                </div>
                
                <div class="flex items-center justify-center">
                  <ChevronRight :size="24" class="text-amber-500" />
                </div>
                
                <div class="flex-1 relative flex gap-8 mx-4 cursor-pointer">
                  <div class="text-3xl">To</div>
                  <div class="hover:underline">Please select</div>
                </div>
              </div>
              <div v-if="selectedFlightStatus === 'flight'" class="relative flex-1">
                <input
                  v-model="firstName"
                  type="text"
                  class="w-1/2 bg-white border border-gray-300 rounded pl-4 text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Flight Number"
                  aria-label="Flight Number"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              class="bg-amber-500 hover:bg-amber-600 text-black p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Search flight status"
            >
              <ChevronRight :size="24" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
