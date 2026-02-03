<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  seasons: {
    type: Array,
    required: true
  }
})

// Teams no longer in the league
const defunctTeams = new Set([
  'Cornball Hustlers',
  'The Wedding Fund',
  'Stealth Bombers',
  '2 Deep',
])

const isDefunct = (name) => defunctTeams.has(name)

// Sort seasons by year descending (most recent first)
const sortedSeasons = computed(() => {
  return [...props.seasons].sort((a, b) => b.year - a.year)
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
      <thead>
        <tr class="bg-obl-header text-white">
          <th class="px-4 py-3 text-center text-sm font-semibold w-16">Year</th>
          <th class="px-4 py-3 text-center text-sm font-semibold w-20">Season</th>
          <th class="px-4 py-3 text-center text-sm font-semibold">Draft Location</th>
          <th class="px-4 py-3 text-center text-sm font-semibold bg-gray-500">Runner Up</th>
          <th class="px-4 py-3 text-center text-sm font-semibold bg-amber-500">Champion</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="season in sortedSeasons"
          :key="season.year"
          class="border-t border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <td class="px-4 py-3 text-center font-medium text-gray-600">
            {{ season.seasonNumber }}
          </td>
          <td class="px-4 py-3 text-center font-semibold">
            {{ season.year }}
          </td>
          <td class="px-4 py-3 text-center">
            <RouterLink
              :to="`/drafts/${season.year}`"
              class="text-obl-accent hover:text-blue-700 hover:underline transition-colors"
            >
              {{ season.draftLocation }}
            </RouterLink>
          </td>
          <td class="px-4 py-3 text-center bg-gray-50">
            <span :class="isDefunct(season.runnerUp) ? 'text-gray-300' : 'text-gray-600'">
              {{ season.runnerUp }}
            </span>
          </td>
          <td class="px-4 py-3 text-center font-semibold bg-amber-50 text-amber-600">
            {{ season.champion }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
