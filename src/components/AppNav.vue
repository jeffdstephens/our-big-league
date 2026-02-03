<script setup>
import { watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'open-login'])
const router = useRouter()
const { isAuthenticated, isAdmin, userProfile, logout } = useAuth()

const navItems = [
  { name: 'Teams', path: '/teams' },
  { name: 'Drafts', path: '/drafts' },
  { name: 'Champions', path: '/champions' },
  { name: 'About', path: '/about' },
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

const navigateTo = (path) => {
  router.push(path)
  emit('close')
}

const handleLogin = () => {
  emit('close')
  emit('open-login')
}

const handleLogout = async () => {
  await logout()
  emit('close')
}

watch(() => router.currentRoute.value, () => {
  emit('close')
})
</script>

<template>
  <!-- Backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-[1100]"
    @click="$emit('close')"
  />

  <!-- Drawer -->
  <aside
    :class="[
      'fixed top-0 right-0 h-full w-64 bg-black text-white z-[1200] transform transition-transform duration-300 ease-in-out flex flex-col',
      isOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
  >
    <div class="p-4 border-b border-gray-700">
      <button @click="navigateTo('/')" class="text-lg font-medium hover:text-gray-300 transition-colors">
        Our Big League
      </button>
    </div>

    <nav class="py-4 flex-1">
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigateTo(item.path)"
        class="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors"
      >
        {{ item.name }}
      </button>

      <!-- Admin link (only visible to admins) -->
      <button
        v-if="isAdmin"
        @click="navigateTo('/admin')"
        class="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors"
      >
        Admin
      </button>
    </nav>

    <!-- Auth section at bottom -->
    <div class="border-t border-gray-700 p-4">
      <template v-if="isAuthenticated">
        <!-- Team info with logo -->
        <div class="flex items-center gap-3 mb-4">
          <img
            v-if="teamLogoUrl"
            :src="teamLogoUrl"
            :alt="userProfile?.teamName"
            class="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
          />
          <div
            v-else
            class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold"
          >
            {{ userProfile?.teamName?.charAt(0) }}
          </div>
          <div>
            <p class="text-white font-medium">{{ userProfile?.teamName }}</p>
            <p class="text-gray-500 text-xs">Logged in</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full text-left text-gray-400 hover:text-white transition-colors py-2"
        >
          Logout
        </button>
      </template>
      <template v-else>
        <button
          @click="handleLogin"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Login
        </button>
      </template>
    </div>
  </aside>
</template>
