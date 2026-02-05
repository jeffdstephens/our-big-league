<script setup>
import { useChampionshipData } from '../composables/useChampionshipData'
import ChampionshipStats from '../components/champions/ChampionshipStats.vue'
import ChampionshipHistory from '../components/champions/ChampionshipHistory.vue'
import ChampionshipSummary from '../components/champions/ChampionshipSummary.vue'
import YearsSinceLastTitle from '../components/champions/YearsSinceLastTitle.vue'

const { seasons, loading, error, stats, championshipTiers, yearsSinceLastTitle } = useChampionshipData()
</script>

<template>
  <div class="py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-center">Our Big League (OBL) - History</h1>

      <div v-if="loading" class="text-center py-8">Loading championship data...</div>
      <div v-else-if="error" class="text-red-500 py-8 text-center">{{ error }}</div>

      <template v-else>
        <!-- Stats Cards -->
        <ChampionshipStats v-if="stats" :stats="stats" />

        <!-- History Table -->
        <ChampionshipHistory :seasons="seasons" />

        <!-- Championship Summary by Tier -->
        <ChampionshipSummary :tiers="championshipTiers" />

        <!-- Years Since Last Title -->
        <YearsSinceLastTitle :data="yearsSinceLastTitle" />
      </template>
    </div>
  </div>
</template>
