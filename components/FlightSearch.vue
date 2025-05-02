<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { onClickOutside, useMediaQuery } from '@vueuse/core'
import { Plane, Calendar, Users, X, ChevronDown, ChevronRight, AlertCircle, Minus, Plus } from 'lucide-vue-next'
import type { TripType, PassengerType } from '~/types'

// Panel state
const isPanelExpanded = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const isPassengerDropdownOpen = ref(false)
const passengerDropdownRef = ref<HTMLElement | null>(null)
const isTripTypeDropdownOpen = ref(false)
const tripTypeDropdownRef = ref<HTMLElement | null>(null)

// Responsive state
const isMobile = useMediaQuery('(max-width: 768px)')

// Trip type selection
const tripTypes: TripType[] = [
  { id: 'round-trip', name: 'Round Trip' },
  { id: 'one-way', name: 'One Way' },
  { id: 'multi-city', name: 'Multi-City' }
]
const selectedTripType = ref(tripTypes[0])

// Dates
const departureDate = ref('')
const returnDate = ref('')
const isCalendarOpen = ref(false)

// Passenger selection state
const passengerTypes: PassengerType[] = [
  { type: 'adult', label: 'Adults', count: 1, description: '12+ years' },
  { type: 'child', label: 'Children', count: 0, description: '2-11 years' },
  { type: 'infant', label: 'Infants', count: 0, description: 'Under 2 years' }
]
const passengers = ref([...passengerTypes])

// Focus management
const firstFocusableElementRefs = {
  panel: ref<HTMLElement | null>(null),
  passengerDropdown: ref<HTMLElement | null>(null),
  tripTypeDropdown: ref<HTMLElement | null>(null)
}

// Promo code
const promoCode = ref('')

// Close panel when clicking outside
onClickOutside(panelRef, () => {
  if (isPanelExpanded.value) {
    isPanelExpanded.value = false
  }
})

// Close passenger dropdown when clicking outside
onClickOutside(passengerDropdownRef, () => {
  if (isPassengerDropdownOpen.value) {
    isPassengerDropdownOpen.value = false
  }
})

// Close trip type dropdown when clicking outside
onClickOutside(tripTypeDropdownRef, () => {
  if (isTripTypeDropdownOpen.value) {
    isTripTypeDropdownOpen.value = false
  }
})

// Toggle panel expansion
const togglePanel = () => {
  isPanelExpanded.value = !isPanelExpanded.value
    
  if (isPanelExpanded.value) {
    setTimeout(() => {
      if (firstFocusableElementRefs.panel.value) {
        firstFocusableElementRefs.panel.value.focus()
      }
    }, 100)
  }
}

// Toggle passenger dropdown
const togglePassengerDropdown = (event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  isPassengerDropdownOpen.value = !isPassengerDropdownOpen.value
    
  if (isPassengerDropdownOpen.value) {
    setTimeout(() => {
      if (firstFocusableElementRefs.passengerDropdown.value) {
        firstFocusableElementRefs.passengerDropdown.value.focus()
      }
    }, 100)
  }
}

// Toggle trip type dropdown
const toggleTripTypeDropdown = (event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  isTripTypeDropdownOpen.value = !isTripTypeDropdownOpen.value
    
  if (isTripTypeDropdownOpen.value) {
    setTimeout(() => {
      if (firstFocusableElementRefs.tripTypeDropdown.value) {
        firstFocusableElementRefs.tripTypeDropdown.value.focus()
      }
    }, 100)
  }
}

// Select trip type
const selectTripType = (tripType: TripType, event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  selectedTripType.value = tripType
  isTripTypeDropdownOpen.value = false
  
  // Return focus to trip type dropdown trigger
  const tripTypeButton = tripTypeDropdownRef.value?.querySelector('[role="button"]')
  if (tripTypeButton instanceof HTMLElement) {
    tripTypeButton.focus()
  }
}

// Computed total passengers
const totalPassengers = computed(() => {
  return passengers.value.reduce((acc, passenger) => acc + passenger.count, 0)
})

// Passenger display text
const passengerDisplayText = computed(() => {
  if (totalPassengers.value === 0) return 'Please Select'
  
  const parts = []
  if (passengers.value[0].count > 0) {
    parts.push(`${passengers.value[0].count} Adult${passengers.value[0].count > 1 ? 's' : ''}`)
  }
  if (passengers.value[1].count > 0) {
    parts.push(`${passengers.value[1].count} Child${passengers.value[1].count > 1 ? 'ren' : ''}`)
  }
  if (passengers.value[2].count > 0) {
    parts.push(`${passengers.value[2].count} Infant${passengers.value[2].count > 1 ? 's' : ''}`)
  }
  
  return parts.join(', ')
})

// Increment/decrement passenger counts
const updatePassengerCount = (index: number, change: number) => {
  const newCount = passengers.value[index].count + change
  
  if (index === 0 && newCount < 1) return // At least 1 adult required
  if (newCount < 0) return
  if (index === 2 && newCount > passengers.value[0].count) return // Infants cannot exceed adults
  
  passengers.value[index].count = newCount
}

// Close passenger selection and restore focus
const closePassengerDropdown = () => {
  isPassengerDropdownOpen.value = false
  
  // Return focus to passenger dropdown trigger
  const passengerButton = passengerDropdownRef.value?.querySelector('[role="button"]')
  if (passengerButton instanceof HTMLElement) {
    passengerButton.focus()
  }
}

// Handle search action
const handleSearch = () => {  
  console.log('Searching flights with parameters:', {
    tripType: selectedTripType.value.id,
    departureDate: departureDate.value,
    returnDate: returnDate.value,
    passengers: passengers.value,
    promoCode: promoCode.value
  })
}

// Open calendar modal
const openCalendarModal = () => {
  isCalendarOpen.value = true
  // In a real implementation, you would handle the calendar modal opening here
}

// Handle keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  // Global escape key handler
  if (e.key === 'Escape') {
    if (isPassengerDropdownOpen.value) {
      isPassengerDropdownOpen.value = false
      e.preventDefault()
    } else if (isTripTypeDropdownOpen.value) {
      isTripTypeDropdownOpen.value = false
      e.preventDefault()
    } else if (isPanelExpanded.value) {
      isPanelExpanded.value = false
      e.preventDefault()
    }
  }
}

// Set up event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

// Clean up event listeners
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// Watch for mobile changes to update UI
watch(isMobile, (newValue) => {
  // Close dropdowns on mobile resize
  if (newValue) {
    isPassengerDropdownOpen.value = false
    isTripTypeDropdownOpen.value = false
  }
})
</script>

<template>
  <div class="flight-search-container w-full max-w-4xl mx-auto bg-purple-950 rounded shadow-lg" ref="panelRef">
    <!-- Header/Collapsed View -->
    <div 
      class="flight-search-header text-white p-4 flex items-center justify-between rounded-t cursor-pointer"
      @click="togglePanel"
      @keydown.enter.prevent="togglePanel"
      @keydown.space.prevent="togglePanel"
      tabindex="0"
      role="button"
      :aria-expanded="isPanelExpanded"
      aria-controls="flight-search-panel"
    >
      <div class="flex items-center">
        <div class="mr-2 text-xl">TPE <span class="text-sm text-gray-200">Taipei, Taiwan</span></div>
        <Plane class="mx-2 transform rotate-90 text-amber-500" aria-hidden="true" />
        <div class="ml-2">To <span class="text-sm text-gray-200">Please select</span></div>
      </div>
      <div class="flex items-center">
        <div 
          class="mr-4 relative"
          ref="tripTypeDropdownRef"
        >
          <div 
            @click.stop="toggleTripTypeDropdown"
            @keydown.enter.stop="toggleTripTypeDropdown"
            @keydown.space.stop="toggleTripTypeDropdown"
            tabindex="0"
            role="button"
            aria-haspopup="listbox"
            :aria-expanded="isTripTypeDropdownOpen"
            class="flex items-center focus:outline-none focus:ring-2 focus:ring-amber-400 rounded p-1"
          >
            <span class="text-gray-200">Trip type:</span>
            <span class="font-semibold ml-1">{{ selectedTripType.name }}</span>
            <ChevronDown class="ml-1" :class="{ 'transform rotate-180': isTripTypeDropdownOpen }" :size='16' />
          </div>
          
          <!-- Trip Type Dropdown -->
          <div 
            v-if="isTripTypeDropdownOpen"
            class="absolute top-full left-0 mt-1 bg-purple-900 border border-gray-500 rounded shadow-lg z-20 w-40"
            role="listbox"
            aria-labelledby="trip-type-label"
          >
            <div 
              v-for="(tripType, index) in tripTypes" 
              :key="tripType.id"
              class="p-3 hover:bg-purple-800 cursor-pointer"
              :class="{ 'bg-purple-800': tripType.id === selectedTripType.id }"
              @click.stop="selectTripType(tripType, $event)"
              @keydown.enter.stop="selectTripType(tripType, $event)"
              @keydown.space.stop="selectTripType(tripType, $event)"
              role="option"
              :aria-selected="tripType.id === selectedTripType.id"
              tabindex="0"
              :ref="index === 0 ? firstFocusableElementRefs.tripTypeDropdown : undefined"
            >
              {{ tripType.name }}
            </div>
          </div>
        </div>
        
        <button 
          type="button" 
          class="focus:outline-none focus:ring-2 focus:ring-amber-400 rounded p-1"
          @click.stop="togglePanel"
          :aria-label="isPanelExpanded ? 'Collapse flight search panel' : 'Expand flight search panel'"
        >
          <ChevronDown v-if="!isPanelExpanded" aria-hidden="true" />
          <X v-else aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Expanded Panel -->
    <div 
      v-if="isPanelExpanded"
      id="flight-search-panel"
      class="flight-search-panel text-white p-6 rounded-b"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div>
          <!-- Departure & Return Date -->
          <div 
            class="flight-date-selector flex items-center border border-gray-500 rounded p-3 mb-4 cursor-pointer transition-colors hover:border-amber-500 focus-within:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            tabindex="0"
            role="button"
            aria-haspopup="dialog"
            aria-label="Select departure and return dates"
            @click="openCalendarModal"
            @keydown.enter.prevent="openCalendarModal"
            @keydown.space.prevent="openCalendarModal"
            :ref="firstFocusableElementRefs.panel"
          >
            <Calendar class="mr-3 text-amber-500" aria-hidden="true" />
            <div class="flex-1">
              <div class="text-sm text-gray-300">Departure Date - Return Date</div>
              <div class="font-medium">
                <span v-if="departureDate && returnDate">
                  {{ departureDate }} - {{ returnDate }}
                </span>
                <span v-else>Please Select</span>
              </div>
            </div>
          </div>

          <!-- Promo Code -->
          <div class="mb-4">
            <label for="promo-code" class="text-sm text-gray-300 mb-1 block">Promo Code</label>
            <input
              id="promo-code"
              v-model="promoCode"
              type="text"
              class="w-full bg-purple-900 border border-gray-500 rounded p-3 text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400"
              placeholder="Enter promo code (optional)"
              aria-label="Promo code"
            />
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <!-- Passengers Selection -->
          <div class="mb-4 relative" ref="passengerDropdownRef">
            <div 
              class="passenger-selector flex items-center border border-gray-500 rounded p-3 cursor-pointer transition-colors hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              tabindex="0"
              role="button"
              aria-haspopup="true"
              :aria-expanded="isPassengerDropdownOpen"
              aria-controls="passenger-selection-dropdown"
              aria-label="Select passengers"
              @click.stop="togglePassengerDropdown"
              @keydown.enter.prevent="togglePassengerDropdown"
              @keydown.space.prevent="togglePassengerDropdown"
            >
              <Users class="mr-3 text-amber-500" aria-hidden="true" />
              <div class="flex-1">
                <div class="text-sm text-gray-300">Passengers / Class / Bank Discount</div>
                <div class="font-medium">{{ passengerDisplayText }}</div>
              </div>
              <ChevronRight aria-hidden="true" :class="{ 'transform rotate-90': isPassengerDropdownOpen }" />
            </div>
            
            <!-- Passenger Dropdown Menu -->
            <div
              v-if="isPassengerDropdownOpen"
              id="passenger-selection-dropdown"
              class="absolute top-full left-0 right-0 mt-1 bg-purple-900 border border-gray-500 rounded shadow-lg z-10"
              role="dialog"
              aria-label="Passenger selection"
            >
              <div class="p-4">
                <h3 class="font-semibold mb-3" id="passenger-dropdown-title">Select Passengers</h3>
                
                <div v-for="(passenger, index) in passengers" :key="passenger.type" class="mb-4 last:mb-0">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium" :id="`passenger-type-${passenger.type}`">{{ passenger.label }}</div>
                      <div class="text-sm text-gray-300">{{ passenger.description }}</div>
                    </div>
                    
                    <div class="flex items-center" role="group" :aria-labelledby="`passenger-type-${passenger.type}`">
                      <button
                        type="button"
                        class="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                        :aria-label="`Decrease ${passenger.label}`"
                        :disabled="index === 0 && passenger.count <= 1 || passenger.count <= 0"
                        @click="updatePassengerCount(index, -1)"
                        :ref="index === 0 ? firstFocusableElementRefs.passengerDropdown : undefined"
                      >
                        <Minus :size='20' :class="index === 0 && passenger.count <= 1 || passenger.count <= 0 ? 'text-gray-500' : 'text-white'" />
                      </button>
                      
                      <span class="mx-3 w-6 text-center" aria-live="polite">{{ passenger.count }}</span>
                      
                      <button
                        type="button"
                        class="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                        :aria-label="`Increase ${passenger.label}`"
                        :disabled="index === 2 && passenger.count >= passengers[0].count"
                        @click="updatePassengerCount(index, 1)"
                      >
                        <Plus :size='20' :class="index === 2 && passenger.count >= passengers[0].count ? 'text-gray-500' : 'text-white'" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="border-t border-gray-600 p-4 flex justify-end">
                <button
                  type="button"
                  class="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                  @click="closePassengerDropdown"
                >
                  Done
                </button>
              </div>
            </div>
          </div>

          <!-- Notice About Children and Infants -->
          <div class="flex items-start mt-4 text-sm" aria-live="polite">
            <AlertCircle class="text-amber-500 mr-2 flex-shrink-0 mt-1" :size="18" aria-hidden="true" />
            <div>Children under 12 must be accompanied by an adult. Infants must sit on an adult's lap or in a separate seat.</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end mt-6">
        <button
          type="button"
          class="bg-amber-500 hover:bg-amber-600 text-black font-semibold p-3 px-6 rounded flex items-center focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Search flights"
          @click="handleSearch"
        >
          <span class="mr-2">Search</span>
          <ChevronRight :size="20" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>