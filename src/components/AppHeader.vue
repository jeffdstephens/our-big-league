<script setup>
import { RouterLink } from 'vue-router'
import oblIcon from '../assets/obl-icon.png'

defineEmits(['toggle-nav'])

const navItems = [
  { name: 'Teams', path: '/teams' },
  { name: 'Drafts', path: '/drafts' },
  { name: 'Champions', path: '/champions' },
  { name: 'About', path: '/about' },
]
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-black text-white h-16 flex items-center justify-between px-4 shadow-lg">
    <!-- Logo - links to home -->
    <router-link to="/" class="flex items-center hover:opacity-80 transition-opacity">
      <img :src="oblIcon" alt="OBL Logo" class="w-10 h-10 mr-3" />
      <span class="text-xl font-medium">Our Big League</span>
    </router-link>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center gap-6">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="text-white hover:text-gray-300 transition-colors font-medium"
      >
        {{ item.name }}
      </router-link>
    </nav>

    <!-- Mobile Hamburger Button -->
    <button
      @click="$emit('toggle-nav')"
      class="md:hidden p-2 hover:bg-gray-800 rounded-lg"
      aria-label="Toggle navigation"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </header>
</template>
