<script setup>
import { ref, onMounted, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppNav from './components/AppNav.vue'
import LoginModal from './components/LoginModal.vue'
import { useAuth } from './composables/useAuth'

const isNavOpen = ref(false)
const isLoginModalOpen = ref(false)

const { initAuth, error, isAuthenticated } = useAuth()

onMounted(() => {
  initAuth()
})

// Watch for auth errors and show modal with error message
watch(error, (newError) => {
  if (newError && !isAuthenticated.value) {
    // Re-open the login modal to show the error
    isLoginModalOpen.value = true
  }
})

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}

const closeNav = () => {
  isNavOpen.value = false
}

const openLoginModal = () => {
  isLoginModalOpen.value = true
}

const closeLoginModal = () => {
  isLoginModalOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader @toggle-nav="toggleNav" @open-login="openLoginModal" />
    <AppNav :is-open="isNavOpen" @close="closeNav" @open-login="openLoginModal" />
    <LoginModal :is-open="isLoginModalOpen" @close="closeLoginModal" />
    <main class="pt-16">
      <router-view />
    </main>
  </div>
</template>
