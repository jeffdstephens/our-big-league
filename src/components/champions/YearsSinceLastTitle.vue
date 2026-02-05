<script setup>
const props = defineProps({
  data: {
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

const formatYears = (team) => {
  if (!team.hasWon) {
    const times = team.appearances === 1 ? 'time' : 'times'
    return `Never won, but they have appeared in the title game ${team.appearances} ${times}`
  }
  if (team.yearsSince === 0) {
    return 'Current champion'
  }
  if (team.yearsSince === 1) {
    return '1 year'
  }
  return `${team.yearsSince} years`
}
</script>

<template>
  <div class="mt-8">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Years Since Last Title</h2>

    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Years Since Title</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="team in data"
            :key="team.name"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img
                  v-if="getLogoUrl(team.name)"
                  :src="getLogoUrl(team.name)"
                  :alt="team.name"
                  class="w-8 h-8 rounded-full border-2 border-gray-200 mr-3"
                />
                <div v-else class="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                <span class="text-sm font-medium text-gray-900">{{ team.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <span
                :class="{
                  'text-amber-600 font-semibold': team.yearsSince === 0,
                  'text-gray-600': team.hasWon && team.yearsSince > 0,
                  'text-gray-400 italic': !team.hasWon
                }"
              >
                {{ formatYears(team) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
