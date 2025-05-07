<script setup lang="ts">
const props = defineProps({
  promoCode: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:promo-code'])

const updatePromoCode = (event: Event) => {
  const input = event.target as HTMLInputElement
  emit('update:promo-code', input.value)
}
</script>

<template>
  <div class="mb-4">
    <label for="promo-code" class="text-sm text-gray-300 mb-1 block">Promo Code</label>
    <input
      id="promo-code"
      :value="promoCode"
      @input="updatePromoCode"
      type="text"
      class="w-full bg-purple-900 border border-gray-500 rounded p-3 text-gray-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400"
      placeholder="Enter promo code (optional)"
      aria-label="Promo code"
    />
  </div>
</template>
