<script setup>
import { computed } from 'vue'

const props = defineProps({
  tiers: {
    type: Array,
    required: true
  }
})

// Import all logo images dynamically
const logoModules = import.meta.glob('@/assets/*.{jpg,png}', { eager: true })

const getLogoUrl = (teamName) => {
  // Map team names to logo filenames
  const logoMap = {
    'AMW': 'amw.jpg',
    'Blank': 'blank.jpg',
    'Birrrdy': 'birrrdy.jpg',
    'Burghman': 'burghman.jpg',
    'Gunslingers': 'gunslingers.jpg',
    'Hampton Ballers': 'hb.jpg',
    "Jamaica's Finest": 'jf.jpg',
    'Junkyard Dawgs': 'jyd.jpg',
    'Makaveli': 'mak.jpg',
    'Menace': 'menace.jpg',
    'Outta Control': 'oc.jpg',
    'Showtime': 'showtime.jpg',
    'Skindeep Ballaz': 'skindeep.png',
    'Stout': 'stout.jpg'
  }

  const logoFile = logoMap[teamName]
  if (!logoFile) return null

  for (const [key, module] of Object.entries(logoModules)) {
    if (key.endsWith(logoFile)) {
      return module.default
    }
  }
  return null
}

// Flatten tiers into teams array and sort by appearances
const rankedTeams = computed(() => {
  const teams = []

  props.tiers.forEach(tier => {
    tier.teams.forEach(team => {
      teams.push({
        name: team.name,
        championships: tier.count,
        appearances: team.appearances,
        logoUrl: getLogoUrl(team.name)
      })
    })
  })

  // Sort by appearances descending (most at top), then by championships
  return teams.sort((a, b) => {
    if (b.appearances !== a.appearances) {
      return b.appearances - a.appearances
    }
    return b.championships - a.championships
  })
})

// Max appearances for scaling
const maxAppearances = computed(() => {
  return Math.max(...rankedTeams.value.map(t => t.appearances))
})
</script>

<template>
  <div class="mt-8">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Championships (Appearances)</h2>

    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- Chart container -->
      <div class="space-y-2">
        <!-- Header row with scale -->
        <div class="flex items-end">
          <div class="w-36 flex-shrink-0"></div>
          <div class="flex-1 pr-16">
            <div
              class="grid h-6"
              :style="{ gridTemplateColumns: `repeat(${maxAppearances}, 1fr)` }"
            >
              <div
                v-for="n in maxAppearances"
                :key="'header-' + n"
                class="text-xs text-gray-400 text-center"
              >
                {{ n }}
              </div>
            </div>
          </div>
        </div>

        <!-- Team rows -->
        <div
          v-for="team in rankedTeams"
          :key="team.name"
          class="flex items-center"
        >
          <!-- Team name -->
          <div class="w-36 flex-shrink-0 text-right text-sm font-medium text-gray-700 pr-4">
            {{ team.name }}
          </div>

          <!-- Bar area with fixed grid for alignment -->
          <div class="flex-1 relative pr-16">
            <div
              class="grid h-8"
              :style="{ gridTemplateColumns: `repeat(${maxAppearances}, 1fr)` }"
            >
              <div
                v-for="n in maxAppearances"
                :key="team.name + '-cell-' + n"
                class="h-full"
              >
                <div
                  v-if="n <= team.appearances"
                  class="w-full h-full border-r-2"
                  :class="n <= Math.ceil(team.championships)
                    ? 'bg-amber-500 border-amber-600'
                    : 'bg-gray-300 border-gray-400'"
                ></div>
              </div>
            </div>

            <!-- Logo and count positioned after the bar -->
            <div
              class="absolute top-0 h-8 flex items-center pl-1"
              :style="{ left: `calc(${(team.appearances / maxAppearances) * 100}% - 64px * ${team.appearances / maxAppearances})` }"
            >
              <img
                v-if="team.logoUrl"
                :src="team.logoUrl"
                :alt="team.name"
                class="w-8 h-8 rounded-full border-2 border-gray-200"
              />
              <span class="ml-1 text-sm font-semibold text-gray-700">
                {{ team.appearances }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <div class="w-6 h-4 bg-amber-500 rounded"></div>
          <span>Championships</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-6 h-4 bg-gray-300 rounded"></div>
          <span>Runner-Up Appearances</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-grid {
  display: grid;
  gap: 0;
}
</style>
