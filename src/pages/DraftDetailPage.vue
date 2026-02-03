<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const year = computed(() => parseInt(route.params.year))

const seasons = ref([])
const loading = ref(true)
const error = ref(null)

const season = computed(() => {
  return seasons.value.find(s => s.year === year.value)
})

const prevYear = computed(() => {
  const idx = seasons.value.findIndex(s => s.year === year.value)
  return idx > 0 ? seasons.value[idx - 1].year : null
})

const nextYear = computed(() => {
  const idx = seasons.value.findIndex(s => s.year === year.value)
  return idx < seasons.value.length - 1 ? seasons.value[idx + 1].year : null
})

onMounted(async () => {
  try {
    const response = await fetch('/data/championships.json')
    if (!response.ok) throw new Error('Failed to load draft data')
    const data = await response.json()
    seasons.value = data.seasons
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Back link -->
      <RouterLink
        to="/drafts"
        class="inline-flex items-center text-obl-accent hover:text-blue-700 mb-6"
      >
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to All Drafts
      </RouterLink>

      <div v-if="loading" class="text-center py-8">Loading...</div>
      <div v-else-if="error" class="text-red-500 py-8 text-center">{{ error }}</div>
      <div v-else-if="!season" class="text-center py-8 text-gray-500">Draft not found</div>

      <template v-else>
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <RouterLink
              v-if="prevYear"
              :to="`/drafts/${prevYear}`"
              class="text-obl-accent hover:text-blue-700 flex items-center"
            >
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              {{ prevYear }}
            </RouterLink>
            <div v-else class="w-16"></div>

            <div class="text-center">
              <h1 class="text-3xl font-bold text-obl-header">{{ year }} Draft</h1>
              <p class="text-gray-500">Season {{ season.seasonNumber }}</p>
            </div>

            <RouterLink
              v-if="nextYear"
              :to="`/drafts/${nextYear}`"
              class="text-obl-accent hover:text-blue-700 flex items-center"
            >
              {{ nextYear }}
              <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
            <div v-else class="w-16"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <!-- Location -->
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <div class="text-sm text-gray-500 mb-1">Location</div>
              <div class="text-lg font-semibold">{{ season.draftLocation }}</div>
            </div>

            <!-- Runner Up -->
            <div class="bg-gray-50 rounded-lg p-4 text-center border-2 border-gray-400">
              <div class="text-sm text-gray-500 mb-1">Runner Up</div>
              <div class="text-lg font-semibold text-gray-600">{{ season.runnerUp }}</div>
            </div>

            <!-- Champion -->
            <div class="bg-amber-50 rounded-lg p-4 text-center border-2 border-amber-500">
              <div class="text-sm text-gray-500 mb-1">Champion</div>
              <div class="text-lg font-bold text-amber-600">{{ season.champion }}</div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="season.note" class="mt-4 text-center text-sm text-gray-500 italic">
            {{ season.note }}
          </div>
        </div>

        <!-- Placeholder for future draft details -->
        <div class="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
          <p>Draft results and details coming soon...</p>
        </div>
      </template>
    </div>
  </div>
</template>
