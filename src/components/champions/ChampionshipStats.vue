<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
    <!-- Total Seasons -->
    <div class="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-obl-header">
      <div class="text-3xl font-bold text-obl-header">{{ stats.totalSeasons }}</div>
      <div class="text-sm text-gray-500 mt-1">Total Seasons</div>
    </div>

    <!-- No Titles -->
    <div class="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-gray-400">
      <div class="text-3xl font-bold text-gray-600">{{ stats.noTitles.count }}</div>
      <div class="text-sm text-gray-500 mt-1">No Titles</div>
      <div class="text-xs text-gray-400">
        {{ stats.noTitles.teams.join(', ') }}
      </div>
    </div>

    <!-- Half Championship -->
    <div class="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-amber-300">
      <div class="text-3xl font-bold text-amber-500">{{ stats.halfChampionships.count }}</div>
      <div class="text-sm text-gray-500 mt-1">Half a Championship</div>
      <div class="text-xs text-gray-400">
        {{ stats.halfChampionships.teams.join(', ') }}
      </div>
    </div>

    <!-- Back to Back -->
    <div class="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-green-500">
      <div class="text-3xl font-bold text-green-600">{{ stats.backToBack.count }}</div>
      <div class="text-sm text-gray-500 mt-1">Back to Back Champs</div>
      <div class="text-xs text-gray-400">
        {{ stats.backToBack.teams.join(', ') }}
      </div>
    </div>

    <!-- Years Since Title -->
    <div class="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-red-500">
      <template v-if="stats.longestDrought">
        <div class="text-3xl font-bold text-red-600">{{ stats.longestDrought.years }}</div>
        <div class="text-sm text-gray-500 mt-1">Most Years Since Title</div>
        <div class="text-xs text-gray-400">{{ stats.longestDrought.team }}</div>
      </template>
      <template v-else>
        <div class="text-3xl font-bold text-gray-600">--</div>
        <div class="text-sm text-gray-500 mt-1">Longest Drought</div>
      </template>
    </div>

    <!-- Most Titles -->
    <div class="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-amber-500">
      <div class="text-3xl font-bold text-amber-600">{{ stats.mostTitles.count }}</div>
      <div class="text-sm text-gray-500 mt-1">Most Titles</div>
      <div class="text-xs text-gray-400">
        {{ stats.mostTitles.teams.join(' & ') }}
      </div>
    </div>
  </div>
</template>
