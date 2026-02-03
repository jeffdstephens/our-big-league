<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'

const draftLocations = ref([])
const seasons = ref([])
const loading = ref(true)
const error = ref(null)
const mapRef = ref(null)

// Map configuration - centered on continental US
const defaultCenter = [39.5, -98.35]
const desktopZoom = 4
const mobileZoom = 3
const mobileBreakpoint = 640

const getDefaultZoom = () => {
  return window.innerWidth < mobileBreakpoint ? mobileZoom : desktopZoom
}

const mapCenter = ref([...defaultCenter])
const mapZoom = ref(getDefaultZoom())

const resetMap = () => {
  if (mapRef.value?.leafletObject) {
    mapRef.value.leafletObject.setView(defaultCenter, getDefaultZoom())
  }
}

onMounted(async () => {
  try {
    const response = await fetch('/data/championships.json')
    if (!response.ok) throw new Error('Failed to load draft data')
    const data = await response.json()
    draftLocations.value = data.draftLocations.filter(loc => loc.city !== 'Virtual')
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
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-center">Draft Locations</h1>

      <div v-if="loading" class="text-center py-8">Loading map...</div>
      <div v-else-if="error" class="text-red-500 py-8 text-center">{{ error }}</div>

      <template v-else>
        <!-- Map -->
        <div class="relative rounded-lg overflow-hidden shadow-lg border border-gray-200 mb-8">
          <!-- Home Button -->
          <button
            @click="resetMap"
            class="absolute top-3 right-3 z-[1000] bg-white hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg shadow-md border border-gray-300 flex items-center gap-2 transition-colors"
            title="Reset to default view"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="text-sm font-medium">Home</span>
          </button>

          <l-map
            ref="mapRef"
            :zoom="mapZoom"
            :center="mapCenter"
            :use-global-leaflet="false"
            style="height: 500px; width: 100%;"
          >
            <l-tile-layer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              layer-type="base"
              name="CartoDB Positron"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            <l-marker
              v-for="location in draftLocations"
              :key="location.city"
              :lat-lng="[location.lat, location.lng]"
            >
              <l-popup>
                <div class="text-center min-w-[150px]">
                  <h3 class="font-bold text-lg">{{ location.city }}</h3>
                  <p class="text-sm text-gray-600 mb-2">{{ location.years.length }} draft{{ location.years.length > 1 ? 's' : '' }}</p>
                  <div class="flex flex-wrap gap-1 justify-center">
                    <RouterLink
                      v-for="year in location.years"
                      :key="year"
                      :to="`/drafts/${year}`"
                      class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                    >
                      {{ year }}
                    </RouterLink>
                  </div>
                </div>
              </l-popup>
            </l-marker>
          </l-map>
        </div>

        <!-- Draft List -->
        <h2 class="text-xl font-bold mb-4">All Drafts</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <RouterLink
            v-for="season in seasons"
            :key="season.year"
            :to="`/drafts/${season.year}`"
            class="bg-white rounded-lg shadow-md p-3 text-center hover:shadow-lg hover:scale-105 transition-all border border-gray-200"
          >
            <div class="text-lg font-bold text-obl-header">{{ season.year }}</div>
            <div class="text-xs text-gray-500">{{ season.draftLocation }}</div>
          </RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>
