<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { X, ChevronDown } from 'lucide-vue-next'

// Define the Airport type
interface Airport {
  code: string;
  city: string;
}

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  location: {
    type: Object as () => Airport,
    required: true
  },
  airports: {
    type: Array as () => Airport[],
    required: true
  }
})

// Update the emits to include expand-panel
const emit = defineEmits(['update:location', 'expand-panel'])

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

// Update the toggleDropdown function to focus on the close button
const toggleDropdown = (event?: Event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  // Emit event to expand the panel in parent component
  emit('expand-panel')
  
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
    // Return focus to the trigger button when closing
    nextTick(() => {
      if (triggerRef.value) {
        triggerRef.value.focus()
      }
    })
  }
}


const closeDropdown = (event?: Event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  isDropdownOpen.value = false
  
  // Return focus to the trigger button
  nextTick(() => {
    if (triggerRef.value) {
      triggerRef.value.focus()
    }
  })
}

const selectLocation = (airport: Airport, event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  emit('update:location', airport)
  isDropdownOpen.value = false
  
  // Return focus to trigger button
  nextTick(() => {
    if (triggerRef.value) {
      triggerRef.value.focus()
    }
  })
}
</script>

<template>
  <div class="relative w-full md:w-1/4" ref="dropdownRef">
    <div 
      class="flex flex-col text-gray-500 border-b border-gray-400 pb-2 cursor-pointer"
      @click.stop="toggleDropdown($event)"
      @keydown.enter.stop="toggleDropdown($event)"
      @keydown.space.stop="toggleDropdown($event)"
      tabindex="0"
      role="button"
      aria-haspopup="listbox"
      :aria-expanded="isDropdownOpen"
    >
      <span class="text-sm text-gray-300">{{ label }}</span>
      <div class="flex items-center">
        <span class="text-xl font-medium mr-2">{{ location.code }}</span>
        <span class="text-sm text-gray-200">{{ location.city }}</span>
      </div>
    </div>
    
    <!-- Location Dropdown -->
    <div v-if="isDropdownOpen" class="text-black fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
      <div class="bg-white p-5 rounded-lg w-full max-w-xl relative">
        <button 
          class="absolute top-3 right-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500" 
          @click="closeDropdown($event)"
          @keydown.space.prevent="closeDropdown($event)"
          @keydown.enter.prevent="closeDropdown($event)"
          ref="closeButtonRef"
          aria-label="Close location selection"
        >
          <X />
        </button>
        <h2 class="mt-0 text-2xl mb-2">Please select</h2>
        <input type="text" class="w-full mb-5 p-2 border rounded" placeholder="Select Airport">
        <div class="flex">
          <div class="w-36 bg-amber-50 p-3">
            <ul>
              <li class="mb-2 cursor-pointer" v-for="airport in airports" :key="airport.code" @click.stop="selectLocation(airport)">
                {{ airport.city }}
              </li>
            </ul>
          </div>
          <div class="p-3 flex-1">
            <p>Operated by STARLUX Airlines</p>
            <div 
              v-for="airport in airports" 
              :key="airport.code"
              :class="[
                'flex justify-between p-3 py-1 cursor-pointer hover:underline',
                { 'bg-amber-100 text-gray-800': location.code === airport.code }
              ]" 
              @click.stop="selectLocation(airport)"
            >
              <div>
                <strong>{{ airport.city }}</strong>
                <p>{{ airport.city }}</p>
              </div>
              <div class="font-semibold">{{ airport.code }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
