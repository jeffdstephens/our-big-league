<script setup>
import { ref, watch, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { useAdminData } from '../composables/useAdminData'
import { useChampionshipData } from '../composables/useChampionshipData'
import { getDraftPositionsBySeason, saveDraftPositions } from '../services/draftPositionService'
import { updateSeasonResults, createSeason } from '../services/seasonService'
import ToastNotification from '../components/ToastNotification.vue'

const { isAdmin, loading: authLoading } = useAuth()
const router = useRouter()
const { teams, loading, error } = useAdminData()
const { seasons, loading: seasonsLoading, refetch: refetchSeasons } = useChampionshipData()

// Separate active and inactive teams
const activeTeams = computed(() => teams.value.filter(t => t.isActive))
const inactiveTeams = computed(() => teams.value.filter(t => !t.isActive))

// Redirect if not admin (backup protection, route guard handles primary check)
watch([isAdmin, authLoading], ([admin, isLoading]) => {
  if (!isLoading && !admin) {
    router.push('/')
  }
}, { immediate: true })

// Draft Position Editor state
const draftEditorOpen = ref(false)
const selectedYear = ref(null)
const draftOrder = ref([]) // Array of team IDs in draft order
const championId = ref(null)
const runnerUpId = ref(null)
const draftSaving = ref(false)
const draftLoading = ref(false)
const draftError = ref(null)

// Add New Year state
const showAddYear = ref(false)
const newYear = ref(new Date().getFullYear())
const isNewYear = ref(false) // True when editing a not-yet-saved new year

// Toast state
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Get sorted years for dropdown (most recent first)
const sortedYears = computed(() => {
  if (!seasons.value) return []
  return [...seasons.value].sort((a, b) => b.year - a.year)
})

// Calculate season number based on year (league started in 1998 = Season 1)
const seasonNumberForYear = computed(() => {
  return newYear.value - 1997
})

// Check if year already exists
const yearExists = computed(() => {
  if (!seasons.value) return false
  return seasons.value.some(s => s.year === newYear.value)
})

// Get selected season object
const selectedSeason = computed(() => {
  if (!selectedYear.value || !seasons.value) return null
  return seasons.value.find(s => s.year === selectedYear.value)
})

// Teams available to add (not yet in draft order), sorted alphabetically
const availableTeams = computed(() => {
  const orderedIds = new Set(draftOrder.value)
  return activeTeams.value
    .filter(t => !orderedIds.has(t.id))
    .sort((a, b) => a.name.localeCompare(b.name))
})

// Teams in draft order with their details
const orderedTeams = computed(() => {
  return draftOrder.value.map((teamId, index) => {
    const team = activeTeams.value.find(t => t.id === teamId)
    return {
      id: teamId,
      name: team?.name || 'Unknown',
      position: index + 1
    }
  })
})

// Load draft positions when year changes (skip for new years)
watch(selectedYear, async (newYearValue) => {
  // Skip if no year selected, or if it's a new year (data already reset)
  if (!newYearValue || isNewYear.value) return

  // Skip if season doesn't exist yet
  if (!selectedSeason.value) return

  draftLoading.value = true
  draftError.value = null

  try {
    // Load champion/runner-up from season data
    const season = selectedSeason.value
    championId.value = season.champion?.id || null
    runnerUpId.value = season.runnerUpTeam?.id || null

    // Load draft positions
    const { data, error: fetchError } = await getDraftPositionsBySeason(season.id)

    if (fetchError) {
      throw new Error(fetchError.message)
    }

    // Build draft order array from positions (sorted by position)
    if (data && data.length > 0) {
      const sorted = [...data].sort((a, b) => a.draft_position - b.draft_position)
      draftOrder.value = sorted.map(p => p.team?.id).filter(Boolean)
    } else {
      draftOrder.value = []
    }
  } catch (e) {
    draftError.value = e.message
    console.error('Error loading draft positions:', e)
  } finally {
    draftLoading.value = false
  }
})

// Add team to draft order
const addToDraftOrder = (teamId) => {
  if (!draftOrder.value.includes(teamId)) {
    draftOrder.value.push(teamId)
  }
}

// Remove team from draft order
const removeFromDraftOrder = (teamId) => {
  const index = draftOrder.value.indexOf(teamId)
  if (index > -1) {
    draftOrder.value.splice(index, 1)
  }
}

// Clear all draft order
const clearDraftOrder = () => {
  draftOrder.value = []
}

// Drag and drop state
const draggedIndex = ref(null)

// Drag handlers for reordering
const onDragStart = (index) => {
  draggedIndex.value = index
}

const onDragOver = (event, index) => {
  event.preventDefault()
  if (draggedIndex.value === null || draggedIndex.value === index) return

  // Reorder the array
  const draggedItem = draftOrder.value[draggedIndex.value]
  draftOrder.value.splice(draggedIndex.value, 1)
  draftOrder.value.splice(index, 0, draggedItem)
  draggedIndex.value = index
}

const onDragEnd = () => {
  draggedIndex.value = null
}

// Open add year form with sensible default
const openAddYear = () => {
  // Default to next year after most recent season
  if (sortedYears.value.length > 0) {
    newYear.value = sortedYears.value[0].year + 1
  } else {
    newYear.value = new Date().getFullYear()
  }
  showAddYear.value = true
}

// Cancel add year
const cancelAddYear = () => {
  showAddYear.value = false
}

// "Create" button - shows the editor for a new year (doesn't save to DB yet)
const handleAddYear = () => {
  if (yearExists.value) {
    showToast('This year already exists', 'error')
    return
  }

  // Enter "new year" mode - show editor with empty data
  isNewYear.value = true
  selectedYear.value = newYear.value
  showAddYear.value = false

  // Reset editor to empty state
  draftOrder.value = []
  championId.value = null
  runnerUpId.value = null
}

// Save handler
const handleDraftSave = async () => {
  draftSaving.value = true

  try {
    let seasonId

    // If this is a new year, create the season first
    if (isNewYear.value) {
      const seasonNumber = selectedYear.value - 1997
      const { data: newSeason, success, error: createError } = await createSeason(selectedYear.value, seasonNumber)

      if (!success) {
        throw new Error(createError?.message || 'Failed to create season')
      }

      seasonId = newSeason.id

      // Refresh seasons list so selectedSeason will work
      await refetchSeasons()
      isNewYear.value = false
    } else {
      if (!selectedSeason.value) return
      seasonId = selectedSeason.value.id
    }

    // Build positions array from draft order
    const positions = draftOrder.value.map((teamId, index) => ({
      teamId,
      position: index + 1
    }))

    // Save draft positions
    const { success: posSuccess, error: posError } = await saveDraftPositions(
      seasonId,
      positions
    )

    if (!posSuccess) {
      throw new Error(posError?.message || 'Failed to save draft positions')
    }

    // Save champion/runner-up
    const { success: resSuccess, error: resError } = await updateSeasonResults(
      seasonId,
      championId.value,
      runnerUpId.value
    )

    if (!resSuccess) {
      throw new Error(resError?.message || 'Failed to save season results')
    }

    showToast('Draft data saved successfully', 'success')
  } catch (e) {
    showToast(e.message || 'Failed to save', 'error')
  } finally {
    draftSaving.value = false
  }
}

// Cancel handler - reload data or exit new year mode
const handleDraftCancel = () => {
  if (isNewYear.value) {
    // Exit new year mode without saving
    isNewYear.value = false
    selectedYear.value = null
    draftOrder.value = []
    championId.value = null
    runnerUpId.value = null
  } else {
    // Trigger reload by re-setting the year
    const year = selectedYear.value
    selectedYear.value = null
    setTimeout(() => {
      selectedYear.value = year
    }, 0)
  }
}

// Toast helpers
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
}

const closeToast = () => {
  toast.value.show = false
}
</script>

<template>
  <div class="py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p class="text-gray-600 mb-8">Manage league owners and team settings</p>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600 mt-4">Loading owner data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-300 rounded-lg p-4 text-red-700">
        <p class="font-medium">Error loading data</p>
        <p class="text-sm">{{ error }}</p>
      </div>

      <!-- Active Teams Table -->
      <template v-else>
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="bg-black text-white">
                  <th class="px-4 py-2 text-left font-semibold">Team</th>
                  <th class="px-4 py-2 text-left font-semibold">Owner</th>
                  <th class="px-4 py-2 text-left font-semibold">Email</th>
                  <th class="px-4 py-2 text-center font-semibold">Admin</th>
                  <th class="px-4 py-2 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="team in activeTeams"
                  :key="team.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-2">
                    <span class="font-medium">{{ team.name }}</span>
                  </td>
                  <td class="px-4 py-2">
                    <template v-if="team.ownerFirstName || team.ownerLastName">
                      {{ team.ownerFirstName }} {{ team.ownerLastName }}
                    </template>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-4 py-2">
                    <span v-if="team.ownerEmail" class="text-blue-600">
                      {{ team.ownerEmail }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-4 py-2 text-center">
                    <span
                      v-if="team.isAdmin"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                    >
                      Yes
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-4 py-2 text-center">
                    <router-link
                      :to="`/admin/teams/${team.id}`"
                      class="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Inactive Teams Table -->
        <div v-if="inactiveTeams.length > 0" class="mt-8">
          <h2 class="text-lg font-semibold text-gray-700 mb-3">Inactive Teams</h2>
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="bg-gray-600 text-white">
                    <th class="px-4 py-2 text-left font-semibold">Team</th>
                    <th class="px-4 py-2 text-left font-semibold">Owner</th>
                    <th class="px-4 py-2 text-left font-semibold">Email</th>
                    <th class="px-4 py-2 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="team in inactiveTeams"
                    :key="team.id"
                    class="hover:bg-gray-50 transition-colors bg-gray-50"
                  >
                    <td class="px-4 py-2">
                      <span class="font-medium text-gray-500">{{ team.name }}</span>
                    </td>
                    <td class="px-4 py-2 text-gray-500">
                      <template v-if="team.ownerFirstName || team.ownerLastName">
                        {{ team.ownerFirstName }} {{ team.ownerLastName }}
                      </template>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <td class="px-4 py-2">
                      <span v-if="team.ownerEmail" class="text-blue-400">
                        {{ team.ownerEmail }}
                      </span>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <td class="px-4 py-2 text-center">
                      <router-link
                        :to="`/admin/teams/${team.id}`"
                        class="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Draft Position Editor Section -->
        <div class="mt-10">
          <button
            @click="draftEditorOpen = !draftEditorOpen"
            class="w-full flex items-center justify-between bg-gray-800 text-white px-4 py-3 rounded-t-lg hover:bg-gray-700 transition-colors"
            :class="{ 'rounded-b-lg': !draftEditorOpen }"
          >
            <span class="text-lg font-semibold">Draft Position Editor</span>
            <svg
              class="w-5 h-5 transition-transform"
              :class="{ 'rotate-180': draftEditorOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-show="draftEditorOpen"
            class="bg-white rounded-b-lg shadow-lg p-6 border border-t-0 border-gray-200"
          >
            <!-- Year Selector -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
              <div class="flex items-center gap-3">
                <select
                  v-model="selectedYear"
                  class="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="seasonsLoading"
                >
                  <option :value="null">-- Select Year --</option>
                  <option v-for="season in sortedYears" :key="season.year" :value="season.year">
                    {{ season.year }}
                  </option>
                </select>
                <button
                  @click="openAddYear"
                  class="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  + Add New Year
                </button>
              </div>

              <!-- Add New Year Form (inline) -->
              <div v-if="showAddYear" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Create New Season</h4>
                <div class="flex items-end gap-3">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Year</label>
                    <input
                      v-model.number="newYear"
                      type="number"
                      min="1998"
                      max="2099"
                      class="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Season #</label>
                    <input
                      :value="seasonNumberForYear"
                      type="text"
                      disabled
                      class="w-20 px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 text-sm"
                    />
                  </div>
                  <button
                    @click="handleAddYear"
                    :disabled="addingYear || yearExists"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="addingYear">Creating...</span>
                    <span v-else>Create</span>
                  </button>
                  <button
                    type="button"
                    @click="cancelAddYear"
                    class="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                </div>
                <p v-if="yearExists" class="mt-2 text-red-600 text-xs">
                  This year already exists
                </p>
              </div>
            </div>

            <!-- Editor Content (shows when year selected) -->
            <template v-if="selectedYear">
              <!-- Loading State -->
              <div v-if="draftLoading" class="text-center py-8">
                <svg class="animate-spin h-6 w-6 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-gray-600 mt-2 text-sm">Loading draft data...</p>
              </div>

              <template v-else>
                <!-- Champion / Runner Up Dropdowns -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Champion</label>
                    <select
                      v-model="championId"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option :value="null">(No champion selected)</option>
                      <option v-for="team in activeTeams" :key="team.id" :value="team.id">
                        {{ team.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Runner Up</label>
                    <select
                      v-model="runnerUpId"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option :value="null">(No runner up selected)</option>
                      <option v-for="team in activeTeams" :key="team.id" :value="team.id">
                        {{ team.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Error Display -->
                <div v-if="draftError" class="mb-4 p-3 bg-red-50 border border-red-300 rounded-md text-red-700 text-sm">
                  {{ draftError }}
                </div>

                <!-- Draft Order Builder -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-sm font-medium text-gray-700">Draft Order</h3>
                    <button
                      v-if="draftOrder.length > 0"
                      @click="clearDraftOrder"
                      class="text-xs text-red-600 hover:text-red-800"
                    >
                      Clear All
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Available Teams -->
                    <div>
                      <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Available Teams ({{ availableTeams.length }})
                      </h4>
                      <div class="bg-gray-50 rounded-lg p-3 min-h-[200px] max-h-[400px] overflow-y-auto">
                        <div
                          v-if="availableTeams.length === 0"
                          class="text-center text-gray-400 text-sm py-8"
                        >
                          All teams assigned
                        </div>
                        <div class="space-y-1">
                          <button
                            v-for="team in availableTeams"
                            :key="team.id"
                            @click="addToDraftOrder(team.id)"
                            class="w-full text-left px-3 py-2 bg-white rounded-md shadow-sm hover:bg-blue-50 hover:border-blue-300 border border-gray-200 transition-colors text-sm font-medium"
                          >
                            {{ team.name }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Draft Order -->
                    <div>
                      <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Draft Order ({{ orderedTeams.length }}/14)
                      </h4>
                      <div class="bg-gray-50 rounded-lg p-3 min-h-[200px] max-h-[400px] overflow-y-auto">
                        <div
                          v-if="orderedTeams.length === 0"
                          class="text-center text-gray-400 text-sm py-8"
                        >
                          Click teams to add in order
                        </div>
                        <div class="space-y-1">
                          <div
                            v-for="(team, index) in orderedTeams"
                            :key="team.id"
                            draggable="true"
                            @dragstart="onDragStart(index)"
                            @dragover="onDragOver($event, index)"
                            @dragend="onDragEnd"
                            class="flex items-center px-3 py-2 bg-white rounded-md shadow-sm border border-gray-200 transition-colors text-sm cursor-move group"
                            :class="{ 'opacity-50': draggedIndex === index }"
                          >
                            <span class="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full mr-2 flex-shrink-0">
                              {{ team.position }}
                            </span>
                            <span class="font-medium flex-1">{{ team.name }}</span>
                            <button
                              @click.stop="removeFromDraftOrder(team.id)"
                              class="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Remove"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <p class="text-xs text-gray-400 mt-2">Drag items to reorder</p>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    @click="handleDraftCancel"
                    class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    @click="handleDraftSave"
                    :disabled="draftSaving"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="draftSaving" class="flex items-center gap-2">
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                    <span v-else>Save Changes</span>
                  </button>
                </div>
              </template>
            </template>

            <!-- No Year Selected -->
            <div v-else class="text-center py-8 text-gray-500">
              Select a year to edit draft positions and season results
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>

  <!-- Toast Notification -->
  <ToastNotification
    :show="toast.show"
    :message="toast.message"
    :type="toast.type"
    @close="closeToast"
  />
</template>
