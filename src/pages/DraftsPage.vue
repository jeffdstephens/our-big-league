<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import { useChampionshipData } from '../composables/useChampionshipData'
import { useDraftPositionData } from '../composables/useDraftPositionData'

const { seasons, draftLocations, loading, error } = useChampionshipData()
const {
  years: draftYears,
  positionGrid,
  teamStats,
  loading: positionsLoading
} = useDraftPositionData()
const mapRef = ref(null)

// Import all logo images dynamically
const logoModules = import.meta.glob('@/assets/*.{jpg,png}', { eager: true })

const getLogoUrl = (logoFile) => {
  if (!logoFile) return null
  for (const [key, module] of Object.entries(logoModules)) {
    if (key.endsWith(logoFile)) {
      return module.default
    }
  }
  return null
}

// All years from 2003 to current year (to show gaps)
const allYears = computed(() => {
  if (!draftYears.value.length) return []
  const minYear = Math.min(...draftYears.value)
  const maxYear = Math.max(...draftYears.value)
  const years = []
  for (let y = minYear; y <= maxYear; y++) {
    years.push(y)
  }
  return years
})

// Format year with tick mark
const formatYear = (year) => `'${String(year).slice(-2)}`

// Get champion team ID for a given year
const getChampionId = (year) => {
  const season = seasons.value?.find(s => s.year === year)
  return season?.champion?.id || null
}

// Get position cell class with champion highlight
const getPositionClass = (position, teamId, year) => {
  const isChampion = getChampionId(year) === teamId
  let classes = []

  if (position === 1) {
    classes.push('bg-amber-100 text-amber-800 font-bold')
  } else if (position === 14) {
    classes.push('bg-gray-200 text-gray-600')
  } else {
    classes.push('text-gray-700')
  }

  if (isChampion && position) {
    classes.push('ring-2 ring-amber-500 ring-inset')
  }

  return classes.join(' ')
}

// Teams that have never had #1 pick
const neverFirstPick = computed(() => {
  return teamStats.value.filter(s => s.firstPicks === 0)
})

// Teams that have never had last pick
const neverLastPick = computed(() => {
  return teamStats.value.filter(s => s.lastPicks === 0)
})

// Team name with asterisks for special notes (in alphabetical order: Jamaica's Finest, Junkyard Dawgs, Showtime)
const getTeamDisplayName = (teamName) => {
  if (teamName === "Jamaica's Finest") return `${teamName}*`
  if (teamName === 'Junkyard Dawgs') return `${teamName}**`
  if (teamName === 'Showtime') return `${teamName}***`
  return teamName
}

// Team stats sorted alphabetically for the grid
const teamStatsAlphabetical = computed(() => {
  return [...teamStats.value].sort((a, b) => a.team.name.localeCompare(b.team.name))
})

// Teams with most/least top 5 picks
const mostTop5Picks = computed(() => {
  if (!teamStats.value.length) return null
  return teamStats.value.reduce((a, b) => a.top5Picks > b.top5Picks ? a : b)
})

const leastTop5Picks = computed(() => {
  if (!teamStats.value.length) return null
  return teamStats.value.reduce((a, b) => a.top5Picks < b.top5Picks ? a : b)
})

// Average draft position for champions
const avgChampionDraftPosition = computed(() => {
  if (!seasons.value?.length || !positionGrid.value) return null

  const championPositions = []
  seasons.value.forEach(season => {
    const championId = season.champion?.id
    if (championId && positionGrid.value[championId]?.positions[season.year]) {
      championPositions.push(positionGrid.value[championId].positions[season.year])
    }
  })

  if (championPositions.length === 0) return null
  const avg = championPositions.reduce((a, b) => a + b, 0) / championPositions.length
  return Math.round(avg * 10) / 10
})

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
</script>

<template>
  <div class="py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-4 text-center">Drafts</h1>

      <!-- Quick Navigation -->
      <div class="flex flex-wrap justify-center gap-2 mb-6">
        <a href="#locations" class="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-obl-accent transition-colors">
          Locations
        </a>
        <a href="#all-drafts" class="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-obl-accent transition-colors">
          All Drafts
        </a>
        <a href="#stats" class="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-obl-accent transition-colors">
          Stats
        </a>
        <a href="#history" class="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-obl-accent transition-colors">
          Position History
        </a>
      </div>

      <div v-if="loading" class="text-center py-8">Loading...</div>
      <div v-else-if="error" class="text-red-500 py-8 text-center">{{ error }}</div>

      <template v-else>
        <!-- Map -->
        <div id="locations" class="relative rounded-lg overflow-hidden shadow-lg border border-gray-200 mb-8 scroll-mt-4">
          <h2 class="sr-only">Draft Locations Map</h2>
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
        <div id="all-drafts" class="scroll-mt-4">
          <h2 class="text-xl font-bold mb-4">All Drafts</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
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
        </div>

        <!-- Draft Position Stats -->
        <div v-if="!positionsLoading && teamStats.length" id="stats" class="mb-8 scroll-mt-4">
          <h2 class="text-xl font-bold mb-4">Draft Position Stats</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Best Avg Position -->
            <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">Best Avg Draft Position</div>
              <div class="flex items-center gap-3">
                <img
                  v-if="getLogoUrl(teamStats[0]?.team?.logo)"
                  :src="getLogoUrl(teamStats[0]?.team?.logo)"
                  :alt="teamStats[0]?.team?.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div class="font-bold">{{ teamStats[0]?.team?.name }}</div>
                  <div class="text-obl-accent text-lg font-semibold">{{ teamStats[0]?.avgPosition }}</div>
                </div>
              </div>
            </div>

            <!-- Worst Avg Position -->
            <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">Worst Avg Draft Position</div>
              <div class="flex items-center gap-3">
                <img
                  v-if="getLogoUrl(teamStats[teamStats.length - 1]?.team?.logo)"
                  :src="getLogoUrl(teamStats[teamStats.length - 1]?.team?.logo)"
                  :alt="teamStats[teamStats.length - 1]?.team?.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div class="font-bold">{{ teamStats[teamStats.length - 1]?.team?.name }}</div>
                  <div class="text-gray-600 text-lg font-semibold">{{ teamStats[teamStats.length - 1]?.avgPosition }}</div>
                </div>
              </div>
            </div>

            <!-- Most #1 Picks -->
            <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">Most #1 Picks</div>
              <div class="flex items-center gap-3">
                <img
                  v-if="getLogoUrl(teamStats.reduce((a, b) => a.firstPicks > b.firstPicks ? a : b)?.team?.logo)"
                  :src="getLogoUrl(teamStats.reduce((a, b) => a.firstPicks > b.firstPicks ? a : b)?.team?.logo)"
                  :alt="teamStats.reduce((a, b) => a.firstPicks > b.firstPicks ? a : b)?.team?.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div class="font-bold">{{ teamStats.reduce((a, b) => a.firstPicks > b.firstPicks ? a : b)?.team?.name }}</div>
                  <div class="text-amber-600 text-lg font-semibold">{{ teamStats.reduce((a, b) => a.firstPicks > b.firstPicks ? a : b)?.firstPicks }}</div>
                </div>
              </div>
            </div>

            <!-- Most Last Picks -->
            <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">Most Last Picks</div>
              <div class="flex items-center gap-3">
                <img
                  v-if="getLogoUrl(teamStats.reduce((a, b) => a.lastPicks > b.lastPicks ? a : b)?.team?.logo)"
                  :src="getLogoUrl(teamStats.reduce((a, b) => a.lastPicks > b.lastPicks ? a : b)?.team?.logo)"
                  :alt="teamStats.reduce((a, b) => a.lastPicks > b.lastPicks ? a : b)?.team?.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div class="font-bold">{{ teamStats.reduce((a, b) => a.lastPicks > b.lastPicks ? a : b)?.team?.name }}</div>
                  <div class="text-gray-600 text-lg font-semibold">{{ teamStats.reduce((a, b) => a.lastPicks > b.lastPicks ? a : b)?.lastPicks }}</div>
                </div>
              </div>
            </div>

            <!-- Avg Champion Draft Position -->
            <div v-if="avgChampionDraftPosition" class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">Avg Champion Draft Position</div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <div class="font-bold">Champions</div>
                  <div class="text-amber-600 text-lg font-semibold">{{ avgChampionDraftPosition }}</div>
                </div>
              </div>
            </div>

            <!-- Most Top 5 Picks -->
            <div v-if="mostTop5Picks" class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">Most Top 5 Picks</div>
              <div class="flex items-center gap-3">
                <img
                  v-if="getLogoUrl(mostTop5Picks.team?.logo)"
                  :src="getLogoUrl(mostTop5Picks.team?.logo)"
                  :alt="mostTop5Picks.team?.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div class="font-bold">{{ mostTop5Picks.team?.name }}</div>
                  <div class="text-obl-accent text-lg font-semibold">{{ mostTop5Picks.top5Picks }}</div>
                </div>
              </div>
            </div>

            <!-- Least Top 5 Picks -->
            <div v-if="leastTop5Picks" class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">Fewest Top 5 Picks</div>
              <div class="flex items-center gap-3">
                <img
                  v-if="getLogoUrl(leastTop5Picks.team?.logo)"
                  :src="getLogoUrl(leastTop5Picks.team?.logo)"
                  :alt="leastTop5Picks.team?.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div class="font-bold">{{ leastTop5Picks.team?.name }}</div>
                  <div class="text-gray-600 text-lg font-semibold">{{ leastTop5Picks.top5Picks }}</div>
                </div>
              </div>
            </div>

            <!-- Never Had #1 Pick -->
            <div v-if="neverFirstPick.length" class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">Never Had #1 Pick</div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="stat in neverFirstPick"
                  :key="stat.team.id"
                  class="flex items-center gap-1"
                >
                  <img
                    v-if="getLogoUrl(stat.team.logo)"
                    :src="getLogoUrl(stat.team.logo)"
                    :alt="stat.team.name"
                    class="w-6 h-6 rounded-full object-cover"
                  />
                  <span class="text-sm font-medium">{{ stat.team.name }}</span>
                </div>
              </div>
            </div>

            <!-- Never Drafted Last -->
            <div v-if="neverLastPick.length" class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div class="text-sm text-gray-500 mb-2">Never Drafted Last</div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="stat in neverLastPick"
                  :key="stat.team.id"
                  class="flex items-center gap-1"
                >
                  <img
                    v-if="getLogoUrl(stat.team.logo)"
                    :src="getLogoUrl(stat.team.logo)"
                    :alt="stat.team.name"
                    class="w-6 h-6 rounded-full object-cover"
                  />
                  <span class="text-sm font-medium">{{ stat.team.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Draft Position Grid -->
        <div v-if="!positionsLoading && allYears.length" id="history" class="mb-8 scroll-mt-4">
          <h2 class="text-xl font-bold mb-4">Draft Position History</h2>

          <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="bg-gray-50">
                  <th class="sticky left-0 bg-gray-50 px-3 py-1 text-left font-semibold text-gray-900 border-r border-gray-200" rowspan="2">Team</th>
                  <th class="sticky left-[140px] bg-gray-50 px-2 py-1 text-center font-semibold text-gray-900 border-r border-gray-200" rowspan="2">Avg</th>
                  <th
                    :colspan="allYears.length"
                    class="px-2 py-1 text-center font-semibold text-gray-500 border-b border-gray-200"
                  >
                    Year
                  </th>
                </tr>
                <tr class="bg-gray-50">
                  <th
                    v-for="year in allYears"
                    :key="year"
                    class="px-1 py-1 text-center font-medium text-gray-600 whitespace-nowrap text-xs"
                  >
                    {{ formatYear(year) }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="stat in teamStatsAlphabetical"
                  :key="stat.team.id"
                  class="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td class="sticky left-0 bg-white px-3 py-2 border-r border-gray-200">
                    <div class="flex items-center gap-2">
                      <img
                        v-if="getLogoUrl(stat.team.logo)"
                        :src="getLogoUrl(stat.team.logo)"
                        :alt="stat.team.name"
                        class="w-6 h-6 rounded-full object-cover flex-shrink-0"
                      />
                      <span class="font-medium whitespace-nowrap text-xs">{{ getTeamDisplayName(stat.team.name) }}</span>
                    </div>
                  </td>
                  <td class="sticky left-[140px] bg-white px-2 py-2 text-center font-semibold text-obl-accent border-r border-gray-200 text-xs">
                    {{ stat.avgPosition }}
                  </td>
                  <td
                    v-for="year in allYears"
                    :key="year"
                    class="px-1 py-2 text-center text-xs"
                    :class="getPositionClass(positionGrid[stat.team.id]?.positions[year], stat.team.id, year)"
                  >
                    {{ positionGrid[stat.team.id]?.positions[year] || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Legend and Notes -->
          <div class="mt-3 text-xs text-gray-500 space-y-1">
            <p>
              <span class="inline-block w-4 h-4 ring-2 ring-amber-500 ring-inset align-middle mr-1"></span>
              Gold outline indicates the team won the championship that year
            </p>
            <p>* Jamaica's Finest: Draft positions prior to 2011 are attributable to Stealth Bombers</p>
            <p>** Junkyard Dawgs: Draft positions prior to 2013 are attributable to Cornball Hustlers</p>
            <p>*** Showtime: Draft positions prior to 2011 are attributable to 2 Deep</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
