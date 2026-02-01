<script setup>
import { ref, computed } from 'vue'
import { useTeamData } from '../composables/useTeamData'

const activeTab = ref('team')
const sortColumn = ref('championships')
const sortDirection = ref('desc')

const { teams, loading, error } = useTeamData()

const sortedTeams = computed(() => {
  if (!teams.value) return []

  return [...teams.value]
    .map(team => ({
      ...team,
      yearsSinceLastChampionship: team.championshipYears.length
        ? new Date().getFullYear() - Math.max(...team.championshipYears)
        : null
    }))
    .sort((a, b) => {
      const aVal = a[sortColumn.value]
      const bVal = b[sortColumn.value]
      const modifier = sortDirection.value === 'desc' ? -1 : 1

      if (aVal === null) return 1
      if (bVal === null) return -1
      return (aVal - bVal) * modifier
    })
})

const chronologicalChampions = computed(() => {
  if (!teams.value) return []

  const championsMap = {}
  teams.value.forEach(team => {
    team.championshipYears.forEach(year => {
      if (!championsMap[year]) championsMap[year] = []
      championsMap[year].push(team.name)
    })
  })

  return Object.entries(championsMap)
    .map(([year, teamNames]) => ({ year: parseInt(year), teams: teamNames.join(', ') }))
    .sort((a, b) => b.year - a.year)
})

const toggleSort = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'desc'
  }
}

const getYearsColor = (years) => {
  if (years === null) return 'bg-gray-200 text-gray-500'
  if (years <= 5) return 'bg-green-500 text-white'
  if (years <= 10) return 'bg-yellow-500 text-white'
  return 'bg-red-500 text-white'
}
</script>

<template>
  <div class="p-4">
    <!-- Tab buttons -->
    <div class="flex border-b border-gray-200 mb-4">
      <button
        @click="activeTab = 'team'"
        :class="[
          'px-6 py-3 font-medium transition-colors',
          activeTab === 'team'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        Team View
      </button>
      <button
        @click="activeTab = 'chronological'"
        :class="[
          'px-6 py-3 font-medium transition-colors',
          activeTab === 'chronological'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        Chronological View
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else-if="error" class="text-red-500 py-8">{{ error }}</div>

    <!-- Team View Table -->
    <div v-else-if="activeTab === 'team'" class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Team Name</th>
            <th
              @click="toggleSort('championships')"
              class="px-4 py-3 text-center text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
            >
              Championships
              <span v-if="sortColumn === 'championships'" class="ml-1">{{ sortDirection === 'desc' ? '▼' : '▲' }}</span>
            </th>
            <th
              @click="toggleSort('appearances')"
              class="px-4 py-3 text-center text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
            >
              Appearances
              <span v-if="sortColumn === 'appearances'" class="ml-1">{{ sortDirection === 'desc' ? '▼' : '▲' }}</span>
            </th>
            <th
              @click="toggleSort('yearsSinceLastChampionship')"
              class="px-4 py-3 text-center text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
            >
              Years Since Last
              <span v-if="sortColumn === 'yearsSinceLastChampionship'" class="ml-1">{{ sortDirection === 'desc' ? '▼' : '▲' }}</span>
            </th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Championship Years</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in sortedTeams" :key="team.id" class="border-t border-gray-200 hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ team.name }}</td>
            <td class="px-4 py-3 text-center">{{ team.championships }}</td>
            <td class="px-4 py-3 text-center">{{ team.appearances }}</td>
            <td class="px-4 py-3 text-center">
              <span
                :class="[getYearsColor(team.yearsSinceLastChampionship), 'px-3 py-1 rounded text-sm font-medium']"
              >
                {{ team.yearsSinceLastChampionship ?? 'N/A' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center text-sm text-gray-600">
              {{ team.championshipYears.length ? team.championshipYears.join(', ') : 'None' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Chronological View Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Year</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Champion(s)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in chronologicalChampions" :key="row.year" class="border-t border-gray-200 hover:bg-gray-50">
            <td class="px-4 py-3 text-center font-medium">{{ row.year }}</td>
            <td class="px-4 py-3 text-center">{{ row.teams }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
