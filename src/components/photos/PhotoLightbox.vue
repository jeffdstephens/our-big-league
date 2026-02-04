<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  photos: {
    type: Array,
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])

const currentIndex = ref(0)

// Current photo
const currentPhoto = computed(() => {
  if (!props.photos.length) return null
  return props.photos[currentIndex.value]
})

// Navigation
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < props.photos.length - 1)

const goToPrev = () => {
  if (hasPrev.value) {
    currentIndex.value--
  }
}

const goToNext = () => {
  if (hasNext.value) {
    currentIndex.value++
  }
}

const close = () => {
  emit('close')
}

// Keyboard navigation
const handleKeydown = (event) => {
  if (!props.isOpen) return

  switch (event.key) {
    case 'Escape':
      close()
      break
    case 'ArrowLeft':
      goToPrev()
      break
    case 'ArrowRight':
      goToNext()
      break
  }
}

// Reset index when opened with a new initial index
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    currentIndex.value = props.initialIndex
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

watch(() => props.initialIndex, (newIndex) => {
  if (props.isOpen) {
    currentIndex.value = newIndex
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && currentPhoto"
      class="fixed inset-0 z-[3000] flex items-center justify-center"
      @click.self="close"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/90" @click="close" />

      <!-- Close button -->
      <button
        @click="close"
        class="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-2 transition-colors"
        title="Close (Esc)"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Previous button -->
      <button
        v-if="hasPrev"
        @click="goToPrev"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white p-2 transition-colors"
        title="Previous (Left Arrow)"
      >
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Next button -->
      <button
        v-if="hasNext"
        @click="goToNext"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white p-2 transition-colors"
        title="Next (Right Arrow)"
      >
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Image container -->
      <div class="relative z-10 max-w-[90vw] max-h-[85vh] flex flex-col items-center">
        <img
          :src="currentPhoto.url"
          :alt="currentPhoto.caption || 'Draft photo'"
          class="max-w-full max-h-[75vh] object-contain rounded-lg"
        />

        <!-- Caption and counter -->
        <div class="mt-4 text-center">
          <p v-if="currentPhoto.caption" class="text-white text-lg mb-2">
            {{ currentPhoto.caption }}
          </p>
          <p class="text-white/60 text-sm">
            {{ currentIndex + 1 }} / {{ photos.length }}
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
