<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { Users, X, Minus, Plus, AlertCircle } from 'lucide-vue-next'
import type { PassengerType } from '~/types'

const props = defineProps({
  passengers: {
    type: Array as () => PassengerType[],
    required: true
  }
})

const emit = defineEmits(['update:passengers'])

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)

// Close dropdown when clicking outside
onClickOutside(dropdownRef, () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false
  }
})

// Toggle passenger dropdown
const toggleDropdown = (event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  
  // Store reference to the trigger button for returning focus later
  if (!isDropdownOpen.value && event?.target) {
    triggerRef.value = event.target as HTMLElement
  }
  
  isDropdownOpen.value = !isDropdownOpen.value
    
  if (isDropdownOpen.value) {
    // Focus the close button when modal opens
    nextTick(() => {
      if (closeButtonRef.value) {
        closeButtonRef.value.focus()
      }
    })
  } else {
    // Return focus to the trigger button when closing without using the close button
    nextTick(() => {
      if (triggerRef.value) {
        triggerRef.value.focus()
      }
    })
  }
}

// Close passenger selection and restore focus
const closeDropdown = () => {
  isDropdownOpen.value = false
  
  // Return focus to passenger dropdown trigger
  nextTick(() => {
    if (triggerRef.value) {
      triggerRef.value.focus()
    }
  })
}

// Computed total passengers
const totalPassengers = computed(() => {
  return props.passengers.reduce((acc, passenger) => acc + passenger.count, 0)
})

// Passenger display text
const passengerDisplayText = computed(() => {
  if (totalPassengers.value === 0) return 'Please Select'
  
  const parts = []
  if (props.passengers[0].count > 0) {
    parts.push(`${props.passengers[0].count} Adult${props.passengers[0].count > 1 ? 's' : ''}`)
  }
  if (props.passengers[1].count > 0) {
    parts.push(`${props.passengers[1].count} Child${props.passengers[1].count > 1 ? 'ren' : ''}`)
  }
  if (props.passengers[2].count > 0) {
    parts.push(`${props.passengers[2].count} Infant${props.passengers[2].count > 1 ? 's' : ''}`)
  }
  
  return parts.join(', ')
})

// Increment/decrement passenger counts
const updatePassengerCount = (index: number, change: number) => {
  const updatedPassengers = [...props.passengers]
  const newCount = updatedPassengers[index].count + change
  
  if (index === 0 && newCount < 1) return // At least 1 adult required
  if (newCount < 0) return
  if (index === 2 && newCount > updatedPassengers[0].count) return // Infants cannot exceed adults
  
  updatedPassengers[index].count = newCount
  emit('update:passengers', updatedPassengers)
}
</script>

<template>
  <div class="mb-4 relative" ref="dropdownRef">
    <div 
      class="flex items-center border border-gray-500 rounded p-3 cursor-pointer transition-colors hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
      tabindex="0"
      role="button"
      aria-haspopup="true"
      :aria-expanded="isDropdownOpen"
      aria-controls="passenger-selection-dropdown"
      aria-label="Select passengers"
      @click.stop="toggleDropdown($event)"
      @keydown.enter.prevent="toggleDropdown($event)"
      @keydown.space.prevent="toggleDropdown($event)"
    >
      <Users class="mr-3 text-amber-500" aria-hidden="true" />
      <div class="flex-1">
        <div class="text-sm text-gray-300">Passengers / Class / Bank Discount</div>
        <div class="font-medium">{{ passengerDisplayText }}</div>
      </div>
      <ChevronRight v-if="!isDropdownOpen" aria-hidden="true" />
      <ChevronDown v-else aria-hidden="true" />
    </div>
    
    <!-- Passenger Dropdown Menu -->
    <div v-if="isDropdownOpen" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50" id="passenger-selection-dropdown">
      <div class="bg-white p-5 rounded-lg w-full max-w-xl relative text-gray-800">
        <button 
          class="absolute top-3 right-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500" 
          @click="closeDropdown"
          ref="closeButtonRef"
          aria-label="Close passenger selection"
        >
          <X />
        </button>
        <div class="mb-5">
          <h2 class="mt-0 text-2xl pb-3 border-b">Passengers and Class</h2>
          <div class="flex flex-col md:flex-row px-4 my-5 text-sm">
            <div class="w-full md:w-1/2 md:pr-4 md:border-r mb-4 md:mb-0">
              <h3 class="text-xl mb-5">Passengers</h3>
              <div v-for="(passenger, index) in passengers" :key="passenger.type">
                <div :id="`passenger-type-${passenger.type}`" class="flex justify-between mb-3 items-center">
                  <span>{{ passenger.label }} ({{ passenger.description }})</span>
                  <div class="flex items-center" role="group" :aria-labelledby="`passenger-type-${passenger.type}`">
                    <button
                      type="button"
                      class="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                      :aria-label="`Decrease ${passenger.label}`"
                      :disabled="index === 0 && passenger.count <= 1 || passenger.count <= 0"
                      @click="updatePassengerCount(index, -1)"
                    >
                      <Minus :size="20" :class="index === 0 && passenger.count <= 1 || passenger.count <= 0 ? 'text-gray-300' : 'text-gray-800'" />
                    </button>
                    
                    <span class="mx-2 w-6 text-center" aria-live="polite">{{ passenger.count }}</span>
                    
                    <button
                      type="button"
                      class="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                      :aria-label="`Increase ${passenger.label}`"
                      :disabled="index === 2 && passenger.count >= passengers[0].count"
                      @click="updatePassengerCount(index, 1)"
                    >
                      <Plus :size="20" :class="index === 2 && passenger.count >= passengers[0].count ? 'text-gray-300' : 'text-gray-800'" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full md:w-1/2 md:pl-4">
              <div class="mb-5">
                <h3 class="text-xl mb-3">Class</h3>
                <select class="w-full p-2 border rounded">
                  <option>Please Select</option>
                  <option>Economy</option>
                  <option>Business</option>
                  <option>First Class</option>
                </select>
              </div>
              <div class="mb-5">
                <h3 class="text-xl mb-3">Bank Discount</h3>
                <p class="mb-2 text-sm">Discounts are limited to specific cardholders...</p>
                <select class="w-full p-2 border rounded">
                  <option>None</option>
                  <option>Bank A - 10% off</option>
                  <option>Bank B - 5% off</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          class="bg-gray-700 text-white py-2 px-4 rounded w-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          @click="closeDropdown"
        >
          Confirm
        </button>
      </div>
    </div>
    
    <!-- Notice About Children and Infants -->
    <div class="flex items-start mt-4 text-sm" aria-live="polite">
      <AlertCircle class="text-amber-500 mr-2 flex-shrink-0 mt-1" :size="18" aria-hidden="true" />
      <div>Children under 12 must be accompanied by an adult. Infants must sit on an adult's lap or in a separate seat.</div>
    </div>
  </div>
</template>
