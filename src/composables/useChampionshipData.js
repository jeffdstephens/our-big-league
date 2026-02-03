import { ref, computed, onMounted } from 'vue'
import { getSeasons, getDraftLocations, getChampionshipStats, getChampionshipTiers } from '../services/seasonService'

// Defunct teams (no longer in league) - for display purposes
const defunctTeams = new Set([
  'Cornball Hustlers',
  'The Wedding Fund',
  'Stealth Bombers',
  '2 Deep',
])

// Check if team is defunct
const isDefunct = (name) => {
  return defunctTeams.has(name)
}

export function useChampionshipData() {
  const seasons = ref(null)
  const draftLocations = ref(null)
  const stats = ref(null)
  const championshipTiers = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const fetchChampionships = async () => {
    try {
      loading.value = true
      error.value = null

      // Fetch all data in parallel
      const [seasonsResult, locationsResult, statsResult, tiersResult] = await Promise.all([
        getSeasons(),
        getDraftLocations(),
        getChampionshipStats(),
        getChampionshipTiers()
      ])

      // Check for errors
      if (seasonsResult.error) throw new Error(seasonsResult.error.message)
      if (locationsResult.error) throw new Error(locationsResult.error.message)
      if (statsResult.error) throw new Error(statsResult.error.message)
      if (tiersResult.error) throw new Error(tiersResult.error.message)

      // Transform seasons data to match expected format
      seasons.value = seasonsResult.data.map(season => ({
        seasonNumber: season.season_number,
        year: season.year,
        draftLocation: season.draft_location?.city || 'Unknown',
        champion: season.champion_display_name || season.champion?.name || 'Unknown',
        runnerUp: season.runner_up_display_name || season.runner_up?.name || '------',
        note: season.notes,
        isCoChampionship: season.is_co_championship
      }))

      // Filter out Virtual from map (no coordinates)
      draftLocations.value = locationsResult.data.filter(loc => loc.lat && loc.lng)

      stats.value = statsResult.data
      championshipTiers.value = tiersResult.data

    } catch (e) {
      error.value = e.message
      console.error('Error fetching championship data:', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchChampionships)

  return {
    seasons,
    draftLocations,
    loading,
    error,
    stats,
    championshipTiers,
    isDefunct,
    refetch: fetchChampionships
  }
}
