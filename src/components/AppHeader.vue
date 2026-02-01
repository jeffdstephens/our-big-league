<script setup>
import oblIcon from '../assets/obl-icon.png'

defineEmits(['toggle-nav'])
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-black text-white h-16 flex items-center px-4 shadow-lg">
    <button
      @click="$emit('toggle-nav')"
      class="p-2 hover:bg-gray-800 rounded-lg mr-4"
      aria-label="Toggle navigation"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    <div class="flex items-center">
      <img :src="oblIcon" alt="OBL Logo" class="w-10 h-10 mr-3" />
      <span class="text-xl font-medium">Our Big League</span>
    </div>
  </header>
</template>
