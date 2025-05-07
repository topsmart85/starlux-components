<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  departureDate: {
    type: String,
    default: ''
  },
  returnDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:dates'])

const isCalendarOpen = ref(false)
const currentMonth = ref(new Date())
const isSelectingEndDate = ref(false)
const closeButtonRef = ref<HTMLElement | null>(null)
const calendarTriggerRef = ref<HTMLElement | null>(null)

// Format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// Get number of days in a month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// Get first day of the month (0-6, where 0 is Sunday)
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

// Handle date selection
const handleDateClick = (date: string) => {
  if (!isSelectingEndDate.value) {
    isSelectingEndDate.value = true
    emit('update:dates', { departure: date, return: '' })
  } else {
    const start = new Date(props.departureDate)
    const end = new Date(date)
    
    if (end < start) {
      emit('update:dates', { departure: date, return: props.departureDate })
    } else {
      emit('update:dates', { departure: props.departureDate, return: date })
    }
    
    isCalendarOpen.value = false
    isSelectingEndDate.value = false
  }
}

// Navigate to next month
const nextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.setMonth(currentMonth.value.getMonth() + 1))
}

// Navigate to previous month
const prevMonth = () => {
  currentMonth.value = new Date(currentMonth.value.setMonth(currentMonth.value.getMonth() - 1))
}

// Check if a date is in the selected range
const isDateInRange = (date: string) => {
  if (!props.departureDate || !props.returnDate) return false
  const current = new Date(date)
  const start = new Date(props.departureDate)
  const end = new Date(props.returnDate)
  return current >= start && current <= end
}

// Check if a date is selected as departure or return
const isDateSelected = (date: string) => {
  return date === props.departureDate || date === props.returnDate
}

// Open calendar modal
const openCalendarModal = (event?: Event) => {
  if (event?.currentTarget) {
    calendarTriggerRef.value = event.currentTarget as HTMLElement
  }
  isCalendarOpen.value = true

  // Focus the close button after modal is rendered
  nextTick(() => {
    if (closeButtonRef.value) {
      closeButtonRef.value.focus()
    }
  })
}

const handleCloseKeyDown = (event: KeyboardEvent) => {
  if(event.key === 'Enter' || event.key === ' '){
    event.preventDefault()
    closeCalendarModal()
  }
}

// Close calendar modal
const closeCalendarModal = () => {
  console.log('closing calender modal')
  isCalendarOpen.value = false

  // Return focus to the date picker element
  nextTick(() => {
    if (calendarTriggerRef.value) {
      calendarTriggerRef.value.focus()
    }
  })
}

defineExpose({
  focus: () => {
    const element = document.querySelector('.flight-date-selector')
    if (element instanceof HTMLElement) {
      element.focus()
    }
  }
})
</script>

<template>
  <div 
    class="flight-date-selector flex items-center border border-gray-500 rounded p-3 mb-4 cursor-pointer transition-colors hover:border-amber-500 focus-within:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
    tabindex="0"
    role="button"
    aria-haspopup="dialog"
    aria-label="Select departure and return dates"
    @click="openCalendarModal($event)"
    @keydown.enter.prevent="openCalendarModal($event)"
    @keydown.space.prevent="openCalendarModal($event)"
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
    
    <!-- Calendar Modal -->
    <div v-if="isCalendarOpen" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50" @click.self="closeCalendarModal">
      <div class="bg-white rounded-lg p-6 w-full max-w-xl" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Select Dates</h2>
          <button 
            @click.stop="closeCalendarModal"
            @keydown.space.prevent="() => closeCalendarModal()"
            @keydown.enter.prevent="() => closeCalendarModal()"
            ref="closeButtonRef"
            class="text-gray-500 hover:text-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Close calendar"
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
                      ? 'bg-amber-500 text-white rounded-full' 
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
                      ? 'bg-amber-500 text-white rounded-full' 
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
</template>
