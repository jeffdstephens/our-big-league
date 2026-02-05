<script setup>
import { computed } from 'vue'

const props = defineProps({
  teams: {
    type: Array,
    required: true
  },
  yearLabels: {
    type: Object,
    default: () => ({})
  }
})

const timelineEntries = computed(() => {
  // Group teams by join_year
  const grouped = {}
  props.teams
    .filter(t => t.join_year)
    .forEach(team => {
      const year = team.join_year
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(team)
    })

  const years = Object.keys(grouped).map(Number)
  if (!years.length) return []

  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)

  // Build entries for every year from min to max
  const entries = []
  for (let year = minYear; year <= maxYear; year++) {
    const teams = grouped[year] || []
    entries.push({
      year,
      label: props.yearLabels[year] || (year === minYear ? 'Founding Members' : null),
      teams: teams.sort((a, b) => a.name.localeCompare(b.name)),
      hasEvent: teams.length > 0
    })
  }

  return entries
})
</script>

<template>
  <div v-if="timelineEntries.length" class="mt-8">
    <h2 class="text-xl font-bold text-center mb-6">Owner Timeline</h2>

    <div class="relative max-w-2xl mx-auto pl-8">
      <!-- Vertical line -->
      <div class="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gray-300"></div>

      <div
        v-for="entry in timelineEntries"
        :key="entry.year"
        :class="entry.hasEvent ? 'relative mb-8' : 'relative mb-2'"
      >
        <!-- Year marker -->
        <div class="absolute left-[-18px] w-9 flex items-center justify-center">
          <div
            class="rounded-full border-2 border-white shadow"
            :class="entry.hasEvent
              ? 'w-4 h-4 bg-obl-accent'
              : 'w-2.5 h-2.5 bg-gray-300'"
          ></div>
        </div>

        <!-- Event year: full display with label and team cards -->
        <template v-if="entry.hasEvent">
          <div class="ml-6 mb-2">
            <span class="text-lg font-bold text-gray-900">{{ entry.year }}</span>
            <span v-if="entry.label" class="ml-2 text-sm font-medium text-obl-accent">{{ entry.label }}</span>
          </div>

          <div class="ml-6 space-y-2">
            <div
              v-for="team in entry.teams"
              :key="team.id"
              class="flex items-center gap-3 rounded-lg p-3 shadow-sm border"
              :class="team.is_active === false
                ? 'bg-gray-50 border-gray-200 opacity-60'
                : 'bg-white border-gray-100'"
            >
              <img
                v-if="team.logoUrl"
                :src="team.logoUrl"
                :alt="team.name"
                class="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div v-else class="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div>
                <p class="font-semibold text-sm" :class="team.is_active === false ? 'text-gray-500' : 'text-gray-900'">
                  {{ team.name }}
                </p>
                <p class="text-xs text-gray-500">{{ team.displayOwner }}</p>
              </div>
              <span
                v-if="team.firstChampionship && team.firstChampionship === entry.year"
                class="ml-auto text-xs font-medium text-amber-500 whitespace-nowrap"
              >
                Won Championship
              </span>
            </div>
          </div>
        </template>

        <!-- Empty year: compact display -->
        <template v-else>
          <div class="ml-6">
            <span class="text-xs text-gray-400">{{ entry.year }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
