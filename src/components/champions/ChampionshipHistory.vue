<script setup>
import { ref, computed } from 'vue'
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

// Sorting state
const sortColumn = ref('year')
const sortDirection = ref('desc')

// Toggle sort column
const toggleSort = (column) => {
  if (sortColumn.value === column) {
    // Toggle direction if same column
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // New column, default to ascending
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

// Sort seasons based on current sort state
const sortedSeasons = computed(() => {
  const sorted = [...props.seasons].sort((a, b) => {
    let aVal, bVal

    switch (sortColumn.value) {
      case 'seasonNumber':
        aVal = a.seasonNumber
        bVal = b.seasonNumber
        break
      case 'year':
        aVal = a.year
        bVal = b.year
        break
      case 'draftLocation':
        aVal = a.draftLocation.toLowerCase()
        bVal = b.draftLocation.toLowerCase()
        return sortDirection.value === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      case 'runnerUp':
        aVal = a.runnerUp.toLowerCase()
        bVal = b.runnerUp.toLowerCase()
        return sortDirection.value === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      case 'champion':
        aVal = a.championDisplay.toLowerCase()
        bVal = b.championDisplay.toLowerCase()
        return sortDirection.value === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      default:
        aVal = a.year
        bVal = b.year
    }

    return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
  })

  return sorted
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
      <thead>
        <tr class="bg-obl-header text-white">
          <th
            @click="toggleSort('seasonNumber')"
            class="px-4 py-3 text-center text-sm font-semibold w-16 cursor-pointer hover:bg-blue-700 transition-colors select-none"
          >
            <div class="flex items-center justify-center gap-1">
              <span>Year</span>
              <span v-if="sortColumn === 'seasonNumber'" class="text-xs">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </div>
          </th>
          <th
            @click="toggleSort('year')"
            class="px-4 py-3 text-center text-sm font-semibold w-20 cursor-pointer hover:bg-blue-700 transition-colors select-none"
          >
            <div class="flex items-center justify-center gap-1">
              <span>Season</span>
              <span v-if="sortColumn === 'year'" class="text-xs">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </div>
          </th>
          <th
            @click="toggleSort('draftLocation')"
            class="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors select-none"
          >
            <div class="flex items-center justify-center gap-1">
              <span>Draft Location</span>
              <span v-if="sortColumn === 'draftLocation'" class="text-xs">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </div>
          </th>
          <th
            @click="toggleSort('runnerUp')"
            class="px-4 py-3 text-center text-sm font-semibold bg-gray-500 cursor-pointer hover:bg-gray-600 transition-colors select-none"
          >
            <div class="flex items-center justify-center gap-1">
              <span>Runner Up</span>
              <span v-if="sortColumn === 'runnerUp'" class="text-xs">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </div>
          </th>
          <th
            @click="toggleSort('champion')"
            class="px-4 py-3 text-center text-sm font-semibold bg-amber-500 cursor-pointer hover:bg-amber-600 transition-colors select-none"
          >
            <div class="flex items-center justify-center gap-1">
              <span>Champion</span>
              <span v-if="sortColumn === 'champion'" class="text-xs">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </div>
          </th>
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
            {{ season.championDisplay }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
