<script setup lang="ts">
import { Plane } from 'lucide-vue-next'

defineEmits(['swap-locations'])
</script>

<template>
  <button 
    class="flex items-center justify-center bg-amber-500 rounded-full w-10 h-10 text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
    @click="$emit('swap-locations')"
    aria-label="Swap departure and destination"
  >
    <Plane class="transform rotate-90" :size="20" />
  </button>
</template>
