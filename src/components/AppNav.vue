<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])
const router = useRouter()

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Champions', path: '/champions' },
  { name: 'Drafts', path: '/drafts' },
  { name: 'Teams', path: '/teams' },
  { name: 'About', path: '/about' },
]

const navigateTo = (path) => {
  router.push(path)
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
    class="fixed inset-0 bg-black/50 z-40"
    @click="$emit('close')"
  />

  <!-- Drawer -->
  <aside
    :class="[
      'fixed top-0 left-0 h-full w-64 bg-black text-white z-50 transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="p-4 border-b border-gray-700">
      <h2 class="text-lg font-medium">Our Big League</h2>
    </div>
    <nav class="py-4">
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigateTo(item.path)"
        class="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors"
      >
        {{ item.name }}
      </button>
    </nav>
  </aside>
</template>
