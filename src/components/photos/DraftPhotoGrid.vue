<script setup>
defineProps({
  photos: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['open-lightbox', 'delete'])

const openLightbox = (index) => {
  emit('open-lightbox', index)
}

const confirmDelete = (photo) => {
  if (confirm('Are you sure you want to delete this photo?')) {
    emit('delete', photo)
  }
}
</script>

<template>
  <div class="photo-grid">
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="aspect-square bg-gray-200 animate-pulse rounded-lg"
      />
    </div>

    <!-- Photos Grid -->
    <div v-else-if="photos.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="relative aspect-square group cursor-pointer overflow-hidden rounded-lg bg-gray-100"
        @click="openLightbox(index)"
      >
        <img
          v-if="photo.url"
          :src="photo.url"
          :alt="photo.caption || 'Draft photo'"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-gray-400"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Caption overlay on hover -->
        <div
          v-if="photo.caption"
          class="absolute bottom-0 left-0 right-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <p class="text-white text-sm truncate">{{ photo.caption }}</p>
        </div>

        <!-- Delete button (only for owner's photos) -->
        <button
          v-if="photo.canDelete"
          @click.stop="confirmDelete(photo)"
          class="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
          title="Delete photo"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-lg font-medium">No photos yet</p>
      <p class="text-sm">Be the first to upload a photo from this draft!</p>
    </div>
  </div>
</template>
