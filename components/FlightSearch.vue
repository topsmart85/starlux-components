<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { onClickOutside, useMediaQuery } from '@vueuse/core'
import { Plane, Calendar, Users, X, ChevronDown, ChevronRight, ChevronLeft, AlertCircle, Minus, Plus } from 'lucide-vue-next'
import type { TripType, PassengerType } from '~/types'

// Panel state
const isPanelExpanded = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const isPassengerDropdownOpen = ref(false)
const passengerDropdownRef = ref<HTMLElement | null>(null)
const isTripTypeDropdownOpen = ref(false)
const tripTypeDropdownRef = ref<HTMLElement | null>(null)
const isFromDropdownOpen = ref(false)
const fromDropdownRef = ref<HTMLElement | null>(null)
const isToDropdownOpen = ref(false)
const toDropdownRef = ref<HTMLElement | null>(null)

// Responsive state
const isMobile = useMediaQuery('(max-width: 768px)')

// Trip type selection
const tripTypes: TripType[] = [
  { id: 'round-trip', name: 'Round Trip' },
  { id: 'one-way', name: 'One Way' },
  { id: 'multi-city', name: 'Multi-City' }
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
const isCalendarOpen = ref(false)
const currentMonth = ref(new Date())
const isSelectingEndDate = ref(false);

// Add these methods
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const handleDateClick = (date: string) => {
  if (!isSelectingEndDate.value) {
    departureDate.value = date
    isSelectingEndDate.value = true
    returnDate.value = ''
  } else {
    const start = new Date(departureDate.value)
    const end = new Date(date)
    
    if (end < start) {
      returnDate.value = departureDate.value
      departureDate.value = date
    } else {
      returnDate.value = date
    }
    
    departureDate.value = departureDate.value
    returnDate.value = returnDate.value
    isCalendarOpen.value = false
    isSelectingEndDate.value = false
  }
}

const nextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.setMonth(currentMonth.value.getMonth() + 1))
}

const prevMonth = () => {
  currentMonth.value = new Date(currentMonth.value.setMonth(currentMonth.value.getMonth() - 1))
}

const isDateInRange = (date: string) => {
  if (!departureDate.value || !returnDate.value) return false
  const current = new Date(date)
  const start = new Date(departureDate.value)
  const end = new Date(returnDate.value)
  return current >= start && current <= end
}

const isDateSelected = (date: string) => {
  return date === departureDate.value || date === returnDate.value
}

// Passenger selection state
const passengerTypes: PassengerType[] = [
  { type: 'adult', label: 'Adults', count: 1, description: '12+' },
  { type: 'child', label: 'Children', count: 0, description: '2 to 11' },
  { type: 'infant', label: 'Infants', count: 0, description: '1 to 2' }
]
const passengers = ref([...passengerTypes])

// Focus management
const firstFocusableElementRefs = {
  panel: ref<HTMLElement | null>(null),
  passengerDropdown: ref<HTMLElement | null>(null),
  tripTypeDropdown: ref<HTMLElement | null>(null),
  fromDropdown: ref<HTMLElement | null>(null),
  toDropdown: ref<HTMLElement | null>(null)
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

// Close from dropdown when clicking outside
onClickOutside(fromDropdownRef, () => {
  if (isFromDropdownOpen.value) {
    isFromDropdownOpen.value = false
  }
})

// Close to dropdown when clicking outside
onClickOutside(toDropdownRef, () => {
  if (isToDropdownOpen.value) {
    isToDropdownOpen.value = false
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
    
  if (!isPanelExpanded.value) {
    isPanelExpanded.value = true;
    setTimeout(() => {
      if (firstFocusableElementRefs.panel.value) {
        firstFocusableElementRefs.panel.value.focus()
      }
    }, 100)
  }
}

// Toggle from dropdown
const toggleFromDropdown = (event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  isFromDropdownOpen.value = !isFromDropdownOpen.value
  isToDropdownOpen.value = false
    
  if (isFromDropdownOpen.value) {
    setTimeout(() => {
      if (firstFocusableElementRefs.fromDropdown.value) {
        firstFocusableElementRefs.fromDropdown.value.focus()
      }
    }, 100)
  }
}

// Toggle to dropdown
const toggleToDropdown = (event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  isToDropdownOpen.value = !isToDropdownOpen.value
  isFromDropdownOpen.value = false
    
  if (isToDropdownOpen.value) {
    setTimeout(() => {
      if (firstFocusableElementRefs.toDropdown.value) {
        firstFocusableElementRefs.toDropdown.value.focus()
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

// Select from location
const selectFromLocation = (airport: typeof airports[0], event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  fromLocation.value = airport
  isFromDropdownOpen.value = false
  
  // Return focus to from dropdown trigger
  const fromButton = fromDropdownRef.value?.querySelector('[role="button"]')
  if (fromButton instanceof HTMLElement) {
    fromButton.focus()
  }
}

// Select to location
const selectToLocation = (airport: typeof airports[0], event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  toLocation.value = airport
  isToDropdownOpen.value = false
  
  // Return focus to to dropdown trigger
  const toButton = toDropdownRef.value?.querySelector('[role="button"]')
  if (toButton instanceof HTMLElement) {
    toButton.focus()
  }
}

// Swap origin and destination
const swapLocations = () => {
  const temp = { ...fromLocation.value }
  fromLocation.value = { ...toLocation.value }
  toLocation.value = temp
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
    from: fromLocation.value,
    to: toLocation.value,
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

const closeCalendarModal = () => {
  if (event) {
    event.stopPropagation()
  }
  isCalendarOpen.value = false
  
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
    } else if (isFromDropdownOpen.value) {
      isFromDropdownOpen.value = false
      e.preventDefault()
    } else if (isToDropdownOpen.value) {
      isToDropdownOpen.value = false
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
    isFromDropdownOpen.value = false
    isToDropdownOpen.value = false
  }
})
</script>

<template>
  <div class="w-full bg-purple-950 bg-opacity-90">
    <div class="container w-full mx-auto rounded shadow-lg" ref="panelRef">
      <!-- Main Search Bar -->
      <div class="flight-search-bar p-4 rounded-t">
        <div class="flex flex-col md:flex-row items-center gap-4">
          <!-- From Location -->
          <div class="relative w-full md:w-1/4" ref="fromDropdownRef">
            <div 
              class="flex flex-col text-gray-500 border-b border-gray-400 pb-2 cursor-pointer"
              @click.stop="toggleFromDropdown"
              @keydown.enter.stop="toggleFromDropdown"
              @keydown.space.stop="toggleFromDropdown"
              tabindex="0"
              role="button"
              aria-haspopup="listbox"
              :aria-expanded="isFromDropdownOpen"
            >
              <span class="text-sm text-gray-300">From</span>
              <div class="flex items-center">
                <span class="text-xl font-medium mr-2">{{ fromLocation.code }}</span>
                <span class="text-sm text-gray-200">{{ fromLocation.city }}</span>
              </div>
            </div>
            
            <!-- From Dropdown -->
            <div v-if="isFromDropdownOpen" class="text-black fixed top-0 left-0 w-full h-full bg-[#000000]/50 flex justify-center items-center z-[1000]">
              <div class="bg-white p-[20px] rounded-[8px] w-[600px] relative">
                <button class="absolute top-[10px] right-[10px] cursor-pointer" @click="toggleFromDropdown">X</button>
                <h2 class="mt-0 text-2xl mb-2">Please select</h2>
                  <input type="text" class="w-full mb-5" placeholder="Select Airport">
                  <div class="flex">
                    <div class="w-[150px] bg-[#f4e8de] p-[10px]">
                    <ul>
                      <li class="mb-2 cursor-pointer" v-for="airport in airports" @click="selectFromLocation(airport)">{{ airport.city }}</li>
                    </ul>
                  </div>
                  <div class="content p-[10px] flex-1">
                    <p>Operated by STARLUX Airlines</p>
                    <div v-for="airport in airports" :class="['flex justify-between p-[10px] py-[5px] cursor-pointer hover:underline', { selected: fromLocation.code === airport.code }, fromLocation.code === airport.code ? 'bg-[#d3c4b7] text-gray-500' : '' ]" @click="selectFromLocation(airport)">
                      <div>
                        <strong>{{ airport.city }}</strong>
                        <p>{{ airport.city }}</p>
                      </div>
                      <div class="airport-code font-semi-bold">{{ airport.code }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Swap Button -->
          <button 
            class="flex items-center justify-center bg-amber-500 rounded-full w-10 h-10 text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
            @click="swapLocations"
            aria-label="Swap departure and destination"
          >
            <Plane class="transform rotate-90" :size="20" />
          </button>
          
          <!-- To Location -->
          <div class="relative w-full md:w-1/4" ref="toDropdownRef">
            <div 
              class="flex flex-col text-gray-500 border-b border-gray-400 pb-2 cursor-pointer"
              @click.stop="toggleToDropdown"
              @keydown.enter.stop="toggleToDropdown"
              @keydown.space.stop="toggleToDropdown"
              tabindex="0"
              role="button"
              aria-haspopup="listbox"
              :aria-expanded="isToDropdownOpen"
            >
              <span class="text-sm text-gray-300">To</span>
              <div class="flex items-center">
                <span class="text-xl font-medium mr-2">{{ toLocation.code }}</span>
                <span class="text-sm text-gray-200">{{ toLocation.city }}</span>
              </div>
            </div>
            
            <!-- To Dropdown -->
            <div v-if="isToDropdownOpen" class="text-black fixed top-0 left-0 w-full h-full bg-[#000000]/50 flex justify-center items-center z-[1000]">
              <div class="bg-white p-[20px] rounded-[8px] w-[600px] relative">
                <button class="absolute top-[10px] right-[10px] cursor-pointer" @click="toggleToDropdown">X</button>
                <h2 class="mt-0 text-2xl mb-2">Please select</h2>
                  <input type="text" class="w-full mb-5" placeholder="Select Airport">
                  <div class="flex">
                    <div class="w-[150px] bg-[#f4e8de] p-[10px]">
                    <ul>
                      <li class="mb-2 cursor-pointer" v-for="airport in airports" @click="selectToLocation(airport)">{{ airport.city }}</li>
                    </ul>
                  </div>
                  <div class="content p-[10px] flex-1">
                    <p>Operated by STARLUX Airlines</p>
                    <div v-for="airport in airports" :class="['flex justify-between p-[10px] py-[5px] cursor-pointer hover:underline', { selected: toLocation.code === airport.code }, toLocation.code === airport.code ? 'bg-[#d3c4b7] text-gray-500' : '' ]" @click="selectToLocation(airport)">
                      <div>
                        <strong>{{ airport.city }}</strong>
                        <p>{{ airport.city }}</p>
                      </div>
                      <div class="airport-code font-semi-bold">{{ airport.code }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Trip Type Selection -->
          <div 
            class="relative w-full md:w-1/4"
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
              class="flex flex-col text-gray-500 border-b border-gray-400 pb-2 cursor-pointer"
            >
              <span class="text-sm text-gray-300">Trip Type</span>
              <div class="flex items-center justify-between">
                <span class="font-medium">{{ selectedTripType.name }}</span>
                <ChevronDown class="ml-1" :class="{ 'transform rotate-180': isTripTypeDropdownOpen }" />
              </div>
            </div>
            
            <!-- Trip Type Dropdown -->
            <div 
              v-if="isTripTypeDropdownOpen"
              class="absolute top-full left-0 mt-1 bg-purple-900 border border-gray-500 rounded shadow-lg z-20 w-full"
              role="listbox"
              aria-labelledby="trip-type-label"
            >
              <div 
                v-for="(tripType, index) in tripTypes" 
                :key="tripType.id"
                class="p-3 hover:bg-purple-800 cursor-pointer border-b border-gray-700 last:border-b-0"
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
        </div>
        
        <!-- Toggle Button for Expanded Panel -->
        <div class="flex justify-end" v-if="isPanelExpanded">
          <button 
            type="button" 
            class="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded flex items-center focus:outline-none focus:ring-2 focus:ring-amber-400"
            @click="togglePanel"
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
        class="flight-search-panel text-gray-500 p-6 rounded-b"
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
              
              <div v-if="isCalendarOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
                <div class="bg-white rounded-lg p-6 w-[600px]">
                  <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">Select Dates</h2>
                    <button 
                      @click="closeCalendarModal"
                      class="text-gray-500 hover:text-gray-700"
                    >
                      <X :size="24" />
                    </button>
                  </div>

                  <div class="flex gap-4">
                    <!-- Current Month -->
                    <div class="flex-1">
                      <div class="flex justify-between items-center mb-4">
                        <button @click="prevMonth" class="p-1 hover:bg-gray-100 rounded">
                          <ChevronLeft :size="20" />
                        </button>
                        <span class="font-medium">
                          {{ currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' }) }}
                        </span>
                        <span></span>
                      </div>

                      <div class="grid grid-cols-7 gap-1">
                        <!-- Week days header -->
                        <template v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']">
                          <div class="text-center text-sm text-gray-500 py-2">{{ day }}</div>
                        </template>

                        <!-- Calendar days -->
                        <template v-for="n in getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth())">
                          <div></div>
                        </template>

                        <template v-for="day in getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth())">
                          <div
                            class="aspect-square flex items-center justify-center cursor-pointer text-sm"
                            :class="[
                              isDateSelected(formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))) 
                                ? 'bg-amber-500 text-gray rounded-full' 
                                : isDateInRange(formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)))
                                ? 'bg-amber-100'
                                : 'hover:bg-gray-100 rounded-full'
                            ]"
                            @click="handleDateClick(formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)))"
                          >
                            {{ day }}
                          </div>
                        </template>
                      </div>
                    </div>

                    <!-- Next Month -->
                    <div class="flex-1">
                      <div class="flex justify-between items-center mb-4">
                        <span></span>
                        <span class="font-medium">
                          {{ new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).toLocaleString('default', { month: 'long', year: 'numeric' }) }}
                        </span>
                        <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
                          <ChevronRight :size="20" />
                        </button>
                      </div>

                      <div class="grid grid-cols-7 gap-1">
                        <!-- Week days header -->
                        <template v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']">
                          <div class="text-center text-sm text-gray-500 py-2">{{ day }}</div>
                        </template>

                        <!-- Calendar days -->
                        <template v-for="n in getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth() + 1)">
                          <div></div>
                        </template>

                        <template v-for="day in getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth() + 1)">
                          <div
                            class="aspect-square flex items-center justify-center cursor-pointer text-sm"
                            :class="[
                              isDateSelected(formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day))) 
                                ? 'bg-amber-500 text-gray-500 rounded-full' 
                                : isDateInRange(formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day)))
                                ? 'bg-amber-100'
                                : 'hover:bg-gray-100 rounded-full'
                            ]"
                            @click="handleDateClick(formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day)))"
                          >
                            {{ day }}
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 text-sm text-gray-500">
                    {{ departureDate ? `Selected: ${departureDate}${returnDate ? ` - ${returnDate}` : ''}` : 'Select departure date' }}
                  </div>
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
                class="w-full bg-purple-900 border border-gray-500 rounded p-3 text-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400"
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
              <div v-if="isPassengerDropdownOpen" class="text-black fixed top-0 left-0 w-full h-full bg-[#000000]/50 flex justify-center items-center">
                <div class="bg-white p-[20px] rounded-[8px] w-[600px] relative">
                  <button class="absolute top-[10px] right-[10px] cursor-pointer" @click="closePassengerDropdown">X</button>
                  <div class="mb-[20px]">
                    <h2 class="mt-0 text-2xl pb-3 border-b">Passengers and Class</h2>
                    <div class="flex px-4 my-5 text-sm">
                      <div  class="w-full px-5 border-r">
                        <h2 class="text-xl mb-5">Passengers</h2>
                        <div v-for="(passenger, index) in passengers" :key="passenger.type">
                          <div :id="`passenger-type-${passenger.type}`" class="flex justify-between mb-[10px] items-center">
                            <span>{{ passenger.label }} ({{ passenger.description }})</span>
                            <div class="flex items-center" role="group" :aria-labelledby="`passenger-type-${passenger.type}`">
                              <button
                                type="button"
                                class="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                                :aria-label="`Decrease ${passenger.label}`"
                                :disabled="index === 0 && passenger.count <= 1 || passenger.count <= 0"
                                @click="updatePassengerCount(index, -1)"
                                :ref="index === 0 ? firstFocusableElementRefs.passengerDropdown : undefined"
                              >
                                <Minus :size='20' :class="index === 0 && passenger.count <= 1 || passenger.count <= 0 ? 'text-gray-500' : 'text-black'" />
                              </button>
                              
                              <span class="mx-1 w-6 text-center" aria-live="polite">{{ passenger.count }}</span>
                              
                              <button
                                type="button"
                                class="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                                :aria-label="`Increase ${passenger.label}`"
                                :disabled="index === 2 && passenger.count >= passengers[0].count"
                                @click="updatePassengerCount(index, 1)"
                              >
                                <Plus :size='20' :class="index === 2 && passenger.count >= passengers[0].count ? 'text-gray-500 border' : 'text-black'" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="w-full px-5">
                        <div class="mb-[20px]">
                        <h2 class="text-xl mb-5">Class</h2>
                        <select>
                          <option>Please Select</option>
                          <!-- Add options here -->
                        </select>
                      </div>
                      <div class="mb-[20px]">
                        <h2 class="text-xl mb-5">Bank Discount</h2>
                        <p>Discounts are limited to specific cardholders...</p>
                        <select class="w-full">
                          <option>None</option>
                          <!-- Add options here -->
                        </select>
                      </div>
                      </div>
                    </div>
                    
                  </div>
                  
                  <button class="bg-[#5a5a5a] text-gray-500 px-[20px] py-[10px] rounded-[4px] cursor-pointer w-full">Confirm</button>
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
  </div>
</template>