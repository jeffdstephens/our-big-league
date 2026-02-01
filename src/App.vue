<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppNav from './components/AppNav.vue'

const isNavOpen = ref(false)

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}

const closeNav = () => {
  isNavOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader @toggle-nav="toggleNav" />
    <AppNav :is-open="isNavOpen" @close="closeNav" />
    <main class="pt-16">
      <router-view />
    </main>
  </div>
</template>
