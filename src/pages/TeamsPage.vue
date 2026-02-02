<script setup>
import { ref, onMounted, computed } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from '@vue-leaflet/vue-leaflet'

const teams = ref([])
const loading = ref(true)
const error = ref(null)
const mapRef = ref(null)

// Map configuration - centered on continental US
const defaultCenter = [39.5, -98.35]
const desktopZoom = 4
const mobileZoom = 3
const mobileBreakpoint = 640  // Phones only - tablets use desktop zoom

const getDefaultZoom = () => {
  return window.innerWidth < mobileBreakpoint ? mobileZoom : desktopZoom
}

const mapCenter = ref([...defaultCenter])
const mapZoom = ref(getDefaultZoom())

// Import all logo images dynamically
const logoModules = import.meta.glob('@/assets/*.{jpg,png}', { eager: true })

const getLogoUrl = (logoFile) => {
  for (const [key, module] of Object.entries(logoModules)) {
    if (key.endsWith(logoFile)) {
      return module.default
    }
  }
  return null
}

const teamsWithLogos = computed(() => {
  return teams.value.map(team => ({
    ...team,
    logoUrl: getLogoUrl(team.logo)
  }))
})

const resetMap = () => {
  if (mapRef.value?.leafletObject) {
    mapRef.value.leafletObject.setView(defaultCenter, getDefaultZoom())
  }
}

onMounted(async () => {
  try {
    const response = await fetch('/data/teams.json')
    if (!response.ok) throw new Error('Failed to load team data')
    const data = await response.json()
    teams.value = data.teams
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
      <h1 class="text-2xl font-bold mb-6 text-center">Teams Map</h1>

      <div v-if="loading" class="text-center py-8">Loading map...</div>
      <div v-else-if="error" class="text-red-500 py-8 text-center">{{ error }}</div>

      <div v-else class="relative rounded-lg overflow-hidden shadow-lg border border-gray-200">
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
          style="height: 600px; width: 100%;"
        >
          <!-- CartoDB Positron - clean, modern, minimal -->
          <l-tile-layer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            layer-type="base"
            name="CartoDB Positron"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          <l-marker
            v-for="team in teamsWithLogos"
            :key="team.id"
            :lat-lng="[team.lat, team.lng]"
          >
            <l-icon
              :icon-url="team.logoUrl"
              :icon-size="[40, 40]"
              :icon-anchor="[20, 20]"
              :popup-anchor="[0, -20]"
              class-name="team-marker"
            />
            <l-popup>
              <div class="text-center min-w-[150px]">
                <img
                  :src="team.logoUrl"
                  :alt="team.name"
                  class="w-12 h-12 mx-auto mb-2 rounded"
                />
                <h3 class="font-bold text-lg">{{ team.name }}</h3>
                <p class="text-sm text-gray-600">{{ team.location }}</p>
                <div class="mt-2 text-sm">
                  <p><span class="font-medium">Championships:</span> {{ team.championships }}</p>
                  <p><span class="font-medium">Appearances:</span> {{ team.appearances }}</p>
                  <p v-if="team.championshipYears.length" class="text-xs text-gray-500 mt-1">
                    {{ team.championshipYears.join(', ') }}
                  </p>
                </div>
              </div>
            </l-popup>
          </l-marker>
        </l-map>
      </div>
    </div>
  </div>
</template>

<style>
.team-marker {
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.team-marker img {
  border-radius: 50%;
  object-fit: cover;
}
</style>
