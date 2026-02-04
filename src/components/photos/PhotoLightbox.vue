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
const zoomLevel = ref(1)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const imageOffset = ref({ x: 0, y: 0 })

const zoomLevels = [1, 1.5, 2, 3]

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
    resetZoom()
  }
}

const goToNext = () => {
  if (hasNext.value) {
    currentIndex.value++
    resetZoom()
  }
}

const close = () => {
  resetZoom()
  emit('close')
}

// Zoom functions
const zoomIn = () => {
  const currentIdx = zoomLevels.indexOf(zoomLevel.value)
  if (currentIdx < zoomLevels.length - 1) {
    zoomLevel.value = zoomLevels[currentIdx + 1]
  }
}

const zoomOut = () => {
  const currentIdx = zoomLevels.indexOf(zoomLevel.value)
  if (currentIdx > 0) {
    zoomLevel.value = zoomLevels[currentIdx - 1]
    if (zoomLevel.value === 1) {
      imageOffset.value = { x: 0, y: 0 }
    }
  }
}

const resetZoom = () => {
  zoomLevel.value = 1
  imageOffset.value = { x: 0, y: 0 }
}

const toggleZoom = () => {
  if (zoomLevel.value === 1) {
    zoomLevel.value = 2
  } else {
    resetZoom()
  }
}

// Pan when zoomed
const startDrag = (e) => {
  if (zoomLevel.value > 1) {
    isDragging.value = true
    dragStart.value = {
      x: e.clientX - imageOffset.value.x,
      y: e.clientY - imageOffset.value.y
    }
  }
}

const onDrag = (e) => {
  if (isDragging.value && zoomLevel.value > 1) {
    imageOffset.value = {
      x: e.clientX - dragStart.value.x,
      y: e.clientY - dragStart.value.y
    }
  }
}

const endDrag = () => {
  isDragging.value = false
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
    case '+':
    case '=':
      zoomIn()
      break
    case '-':
      zoomOut()
      break
  }
}

// Reset when opened
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    currentIndex.value = props.initialIndex
    resetZoom()
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

watch(() => props.initialIndex, (newIndex) => {
  if (props.isOpen) {
    currentIndex.value = newIndex
    resetZoom()
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('mouseup', endDrag)
  window.addEventListener('mousemove', onDrag)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('mousemove', onDrag)
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

      <!-- Zoom controls -->
      <div class="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1.5">
        <button
          @click="zoomOut"
          :disabled="zoomLevel === 1"
          class="text-white/70 hover:text-white disabled:text-white/30 p-1 transition-colors"
          title="Zoom out (-)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
        <span class="text-white/70 text-sm min-w-[3rem] text-center">{{ Math.round(zoomLevel * 100) }}%</span>
        <button
          @click="zoomIn"
          :disabled="zoomLevel === zoomLevels[zoomLevels.length - 1]"
          class="text-white/70 hover:text-white disabled:text-white/30 p-1 transition-colors"
          title="Zoom in (+)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        </button>
      </div>

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
      <div
        class="relative z-10 max-w-[90vw] max-h-[85vh] flex flex-col items-center overflow-hidden"
        :class="{ 'cursor-grab': zoomLevel > 1, 'cursor-grabbing': isDragging }"
      >
        <div
          class="overflow-hidden"
          @mousedown="startDrag"
        >
          <img
            :src="currentPhoto.url"
            alt="Draft photo"
            class="max-w-full max-h-[75vh] object-contain rounded-lg transition-transform duration-200 select-none"
            :style="{
              transform: `scale(${zoomLevel}) translate(${imageOffset.x / zoomLevel}px, ${imageOffset.y / zoomLevel}px)`,
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
            }"
            @click="zoomLevel === 1 ? toggleZoom() : null"
            draggable="false"
          />
        </div>

        <!-- Photo counter -->
        <div class="mt-4 text-center">
          <p class="text-white/60 text-sm">
            {{ currentIndex + 1 }} / {{ photos.length }}
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
