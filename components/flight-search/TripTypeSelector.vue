<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { ChevronDown } from 'lucide-vue-next'
import type { TripType } from '~/types'

const props = defineProps({
  tripTypes: {
    type: Array as () => TripType[],
    required: true
  },
  selectedTripType: {
    type: Object as () => TripType,
    required: true
  }
})

const emit = defineEmits(['update:trip-type', 'expand-panel'])

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const firstOptionRef = ref<HTMLElement | null>(null)
const focusedIndex = ref(-1)

// Close dropdown when clicking outside
onClickOutside(dropdownRef, () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false
  }
})

const toggleDropdown = (event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  // Emit event to expand the panel in parent component
  emit('expand-panel')
  isDropdownOpen.value = !isDropdownOpen.value
    
  if (isDropdownOpen.value) {
    setTimeout(() => {
      if (firstOptionRef.value) {
        firstOptionRef.value.focus()
      }
    }, 100)
  }
}

const selectTripType = (tripType: TripType, event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  emit('update:trip-type', tripType)
  isDropdownOpen.value = false
  
  // Return focus to dropdown trigger
  const tripTypeButton = dropdownRef.value?.querySelector('[role="button"]')
  if (tripTypeButton instanceof HTMLElement) {
    tripTypeButton.focus()
  }
}

const onElementFocus = (index: number) => {
  focusedIndex.value = index
}

const onElementBlur = (index: number) => {
  if (focusedIndex.value === index) {
    focusedIndex.value = -1
  }
}

// Add a function to handle keydown events
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' && focusedIndex.value === 2) {
    event.preventDefault()
  }
  if (event.key === 'ArrowUp' && focusedIndex.value === 0  ) {
    event.preventDefault()
  }
}

// Example function to focus an option (implement according to your needs)
const focusOption = (index: number) => {
  // Implementation depends on your component structure
  // For example, if you have refs for each option:
  // optionRefs.value[index]?.focus()
}

</script>

<template>
  <div class="relative w-full md:w-1/4" ref="dropdownRef" @keydown="handleKeyDown">
    <div 
      @click.stop="toggleDropdown"
      @keydown.enter.stop="toggleDropdown"
      @keydown.space.stop="toggleDropdown"
      tabindex="0"
      role="button"
      aria-haspopup="listbox"
      :aria-expanded="isDropdownOpen"
      class="flex flex-col text-gray-500 border-b border-gray-400 pb-2 cursor-pointer"
    >
      <span class="text-sm text-gray-300">Trip Type</span>
      <div class="flex items-center justify-between">
        <span class="font-medium">{{ selectedTripType.name }}</span>
        <ChevronDown class="ml-1" :class="{ 'transform rotate-180': isDropdownOpen }" />
      </div>
    </div>
    
    <!-- Trip Type Dropdown -->
    <div 
      v-if="isDropdownOpen"
      class="absolute top-full left-0 mt-1 bg-purple-900 border border-gray-500 rounded shadow-lg z-20 w-full"
      role="listbox"
      aria-labelledby="trip-type-label"
    >
      <div 
        v-for="(tripType, index) in tripTypes" 
        :key="tripType.id"
        class="p-3 hover:bg-purple-800 cursor-pointer border-b border-gray-700 last:border-b-0 text-white/50"
        :class="{ 
          'bg-purple-800': tripType.id === selectedTripType.id,
          'outline outline-2 outline-amber-500 bg-purple-700': focusedIndex === index 
        }"
        @click.stop="selectTripType(tripType, $event)"
        @keydown.enter.stop="selectTripType(tripType, $event)"
        @keydown.space.stop="selectTripType(tripType, $event)"
        @focus="onElementFocus(index)"
        @blur="onElementBlur(index)"
        role="option"
        :aria-selected="tripType.id === selectedTripType.id"
        tabindex="0"
        :ref="index === 0 ? (el) => {firstOptionRef = el as HTMLElement } : undefined"
      >
        {{ tripType.name }}
      </div>
    </div>
  </div>
</template>
