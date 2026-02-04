<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import oblIcon from '../assets/obl-icon.png'

defineEmits(['toggle-nav', 'open-login'])

const { isAuthenticated, isAdmin, userProfile, logout } = useAuth()

const navItems = [
  { name: 'Teams', path: '/teams' },
  { name: 'Drafts', path: '/drafts' },
  { name: 'Champions', path: '/champions' },
]

// Import all logo images dynamically
const logoModules = import.meta.glob('@/assets/*.{jpg,png}', { eager: true })

const teamLogoUrl = computed(() => {
  if (!userProfile.value?.teamLogo) return null

  for (const [key, module] of Object.entries(logoModules)) {
    if (key.endsWith(userProfile.value.teamLogo)) {
      return module.default
    }
  }
  return null
})
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
      <!-- Main nav items -->
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="text-white hover:text-gray-300 transition-colors font-medium"
      >
        {{ item.name }}
      </router-link>

      <!-- Admin link (only visible to admins) -->
      <router-link
        v-if="isAdmin"
        to="/admin"
        class="text-white hover:text-gray-300 transition-colors font-medium"
      >
        Admin
      </router-link>

      <!-- Divider -->
      <div v-if="isAuthenticated" class="w-px h-6 bg-gray-600"></div>

      <!-- Login button (when not authenticated) -->
      <button
        v-if="!isAuthenticated"
        @click="$emit('open-login')"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        Login
      </button>

      <!-- User section (when authenticated) -->
      <div v-else class="flex items-center gap-3 pl-2">
        <!-- Team logo and name -->
        <div class="flex items-center gap-2 bg-gray-800 rounded-full py-1 pl-1 pr-3">
          <img
            v-if="teamLogoUrl"
            :src="teamLogoUrl"
            :alt="userProfile?.teamName"
            class="w-7 h-7 rounded-full object-cover border border-gray-600"
          />
          <div
            v-else
            class="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold"
          >
            {{ userProfile?.teamName?.charAt(0) }}
          </div>
          <span class="text-sm text-gray-200 font-medium">
            {{ userProfile?.teamName }}
          </span>
        </div>

        <!-- Logout button -->
        <button
          @click="logout"
          class="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Logout
        </button>
      </div>
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
