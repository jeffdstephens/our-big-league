<script setup>
import { computed } from 'vue'

const props = defineProps({
  tiers: {
    type: Array,
    required: true
  }
})

// Tiers are already sorted 0 to highest from composable
const sortedTiers = computed(() => props.tiers)

// Get color based on championship count
const getTierColor = (count) => {
  if (count >= 5) return 'bg-obl-champion text-white'
  if (count >= 4) return 'bg-yellow-500 text-white'
  if (count >= 3) return 'bg-yellow-400 text-gray-800'
  if (count >= 2) return 'bg-obl-header text-white'
  if (count >= 1) return 'bg-blue-400 text-white'
  return 'bg-gray-400 text-white'
}
</script>

<template>
  <div class="mt-8">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Championships (Appearances)</h2>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr>
            <th
              v-for="tier in sortedTiers"
              :key="tier.count"
              :class="[getTierColor(tier.count), 'px-4 py-3 text-center text-sm font-bold']"
            >
              {{ tier.count }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              v-for="tier in sortedTiers"
              :key="tier.count"
              class="px-2 py-3 align-top border-r border-gray-200 last:border-r-0"
            >
              <div class="space-y-1">
                <div
                  v-for="team in tier.teams"
                  :key="team.name"
                  class="text-xs text-center"
                >
                  <span class="font-medium text-gray-700">{{ team.name }}</span>
                  <span class="text-gray-400 ml-1">({{ team.appearances }})</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
