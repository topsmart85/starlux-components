<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import type { TripType, PassengerType } from '~/types'
import { X } from 'lucide-vue-next'

// Import our components
import FlightSearchHeader from '~/components/flight-search/FlightSearchHeader.vue'
import LocationSelector from '~/components/flight-search/LocationSelector.vue'
import TripTypeSelector from '~/components/flight-search/TripTypeSelector.vue'
import DateSelector from '~/components/flight-search/DateSelector.vue'
import PassengerSelector from '~/components/flight-search/PassengerSelector.vue'
import PromoCodeInput from '~/components/flight-search/PromoCodeInput.vue'

// Panel state
const isPanelExpanded = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const firstFocusableElementRef = ref<HTMLElement | null>(null)

// Add a ref for the close button
const closeButtonRef = ref<HTMLElement | null>(null)

// Responsive state
const isMobile = useMediaQuery('(max-width: 768px)')

// Trip type selection
const tripTypes: TripType[] = [
  { id: 'round-trip', name: 'Round Trip'},
  { id: 'one-way', name: 'One Way'},
  { id: 'multi-city', name: 'Multi-City'}
]
const selectedTripType = ref(tripTypes[0])

// Origin and destination
const fromLocation = ref({ code: '', city: 'Please select' })
const toLocation = ref({ code: '', city: 'Please select' })

// Sample airports for demo
const airports = [
  { code: 'TPE', city: 'Taipei, Taiwan' },
  { code: 'HND', city: 'Tokyo, Japan' },
  { code: 'SIN', city: 'Singapore' },
  { code: 'LAX', city: 'Los Angeles, USA' },
  { code: 'BKK', city: 'Bangkok, Thailand' }
]

// Dates
const departureDate = ref('')
const returnDate = ref('')

// Passenger selection state
const passengerTypes: PassengerType[] = [
  { type: 'adult', label: 'Adults', count: 1, description: '12+' },
  { type: 'child', label: 'Children', count: 0, description: '2 to 11' },
  { type: 'infant', label: 'Infants', count: 0, description: '1 to 2' }
]
const passengers = ref([...passengerTypes])

// Promo code
const promoCode = ref('')

// Toggle panel expansion
const togglePanel = () => {
  isPanelExpanded.value = !isPanelExpanded.value
    
  if (isPanelExpanded.value) {
    setTimeout(() => {
      if (firstFocusableElementRef.value) {
        firstFocusableElementRef.value.focus()
      }
    }, 100)
  }
}

// Toggle panel dropdown
const toggleExpandPanelDropdown = () => {
  if (!isPanelExpanded.value) {
    isPanelExpanded.value = true
    setTimeout(() => {
      if (closeButtonRef.value) {
        closeButtonRef.value.focus()
      }
    }, 100)
  }
}

// Swap origin and destination
const swapLocations = () => {
  const temp = { ...fromLocation.value }
  fromLocation.value = { ...toLocation.value }
  toLocation.value = temp
}

// Update trip type
const updateTripType = (tripType: TripType) => {
  selectedTripType.value = tripType
}

// Update locations
const updateFromLocation = (location: typeof airports[0]) => {
  fromLocation.value = location
}

const updateToLocation = (location: typeof airports[0]) => {
  toLocation.value = location
}

// Update dates
const updateDates = (dates: { departure: string, return: string }) => {
  departureDate.value = dates.departure
  returnDate.value = dates.return
}

// Update passengers
const updatePassengers = (updatedPassengers: PassengerType[]) => {
  passengers.value = updatedPassengers
}

// Update promo code
const updatePromoCode = (code: string) => {
  promoCode.value = code
}

// Handle search action
const handleSearch = () => {  
  console.log('Searching flights with parameters:', {
    tripType: selectedTripType.value.id,
    from: fromLocation.value,
    to: toLocation.value,
    departureDate: departureDate.value,
    returnDate: returnDate.value,
    passengers: passengers.value,
    promoCode: promoCode.value
  })
}

// Handle keyboard navigation for the panel
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isPanelExpanded.value) {
    isPanelExpanded.value = false
    e.preventDefault()
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
  // Close panel on mobile resize if needed
  if (newValue && isPanelExpanded.value) {
    isPanelExpanded.value = false
  }
})
</script>

<template>
  <div class="w-full bg-purple-950 bg-opacity-90">
    <div class="container w-full mx-auto rounded shadow-lg" ref="panelRef">
      <!-- Main Search Bar -->
      <div 
        @click="toggleExpandPanelDropdown"
        @keydown.enter.prevent="toggleExpandPanelDropdown"
        @keydown.space.prevent="toggleExpandPanelDropdown"
        tabindex="0"
        role="button"
        aria-haspopup="listbox"
        :aria-expanded="isPanelExpanded"
        class="p-4 rounded-t">
        <div class="flex flex-col md:flex-row items-center gap-4">
          <!-- From Location -->
          <LocationSelector
            label="From"
            :location="fromLocation"
            :airports="airports"
            @update:location="updateFromLocation"
            @click.stop
            @expand-panel="toggleExpandPanelDropdown"
          />
          
          <!-- Swap Button -->
          <FlightSearchHeader 
            @swap-locations="swapLocations"
          />
          
          <!-- To Location -->
          <LocationSelector
            label="To"
            :location="toLocation"
            :airports="airports"
            @update:location="updateToLocation"
            @click.stop
            @expand-panel="toggleExpandPanelDropdown"
          />
          
          <!-- Trip Type Selection -->
          <TripTypeSelector
            :trip-types="tripTypes"
            :selected-trip-type="selectedTripType"
            @update:trip-type="updateTripType"
            @expand-panel="toggleExpandPanelDropdown"
          />
        </div>
      </div>
      
      <!-- Toggle Button for Expanded Panel -->
      <div class="flex justify-end" v-if="isPanelExpanded">
        <button 
          type="button" 
          class="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded flex items-center focus:outline-none focus:ring-2 focus:ring-amber-400"
          @click="togglePanel"
          aria-controls="flight-search-panel"
          :aria-expanded="isPanelExpanded"
          aria-label="Collapse search panel"
        >
          <X aria-hidden="true" />
        </button>
      </div>

      <!-- Expanded Panel -->
      <div 
        v-if="isPanelExpanded"
        id="flight-search-panel"
        class="flight-search-panel text-gray-500 p-6 rounded-b"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div>
            <!-- Departure & Return Date -->
            <DateSelector
              :departure-date="departureDate"
              :return-date="returnDate"
              @update:dates="updateDates"
              ref="firstFocusableElementRef"
            />

            <!-- Promo Code -->
            <PromoCodeInput
              :promo-code="promoCode"
              @update:promo-code="updatePromoCode"
            />
          </div>

          <!-- Right Column -->
          <div>
            <!-- Passengers Selection -->
            <PassengerSelector
              :passengers="passengers"
              @update:passengers="updatePassengers"
            />
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
            <X :size="20" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
