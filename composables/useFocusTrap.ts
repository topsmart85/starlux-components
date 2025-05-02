// composables/useFocusTrap.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useFocusTrap(containerRef: any) {
  const focusableElements = ref<HTMLElement[]>([])
  const firstFocusableEl = ref<HTMLElement | null>(null)
  const lastFocusableEl = ref<HTMLElement | null>(null)

  // Handle tab key to trap focus
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // If shift + tab and focus is on first element, move to last element
      if (document.activeElement === firstFocusableEl.value) {
        e.preventDefault()
        lastFocusableEl.value?.focus()
      }
    } else {
      // If tab and focus is on last element, move to first element
      if (document.activeElement === lastFocusableEl.value) {
        e.preventDefault()
        firstFocusableEl.value?.focus()
      }
    }
  }

  // Set initial focus to first element
  const setInitialFocus = () => {
    firstFocusableEl.value?.focus()
  }

  onMounted(() => {    
    
    if (containerRef.value) {
      containerRef.value.addEventListener('keydown', handleKeyDown)
    }
  })

  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('keydown', handleKeyDown)
    }
  })

  return {
    setInitialFocus,    
    focusableElements,
    firstFocusableEl,
    lastFocusableEl
  }
}