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
        id: season.id,
        seasonNumber: season.season_number,
        year: season.year,
        draftLocation: season.draft_location?.city || 'Unknown',
        champion: season.champion,  // Keep full team object with owner info
        championDisplay: season.champion_display_name || season.champion?.name || 'Unknown',
        coChampion: season.co_champion,  // Keep full co-champion object
        runnerUp: season.runner_up_display_name || season.runner_up?.name || '------',
        runnerUpTeam: season.runner_up,  // Keep full runner-up team object
        note: season.notes,
        isCoChampionship: season.is_co_championship,
        groupPhotoId: season.group_photo_id || null
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

  // Compute years since last title for each team
  const yearsSinceLastTitle = computed(() => {
    if (!seasons.value || !championshipTiers.value) return []

    const currentYear = new Date().getFullYear()
    const lastWinDraftYear = {} // team name → most recent draft year won

    // Find last win draft year for each team
    seasons.value.forEach(season => {
      const champName = season.champion?.name
      if (champName) {
        lastWinDraftYear[champName] = Math.max(
          lastWinDraftYear[champName] || 0,
          season.year
        )
      }
      // Handle co-champions
      if (season.isCoChampionship && season.coChampion?.name) {
        const coChampName = season.coChampion.name
        lastWinDraftYear[coChampName] = Math.max(
          lastWinDraftYear[coChampName] || 0,
          season.year
        )
      }
    })

    // Get all teams from championship tiers (includes teams with 0 championships)
    // Also grab appearances count for each team
    const allTeams = []
    championshipTiers.value.forEach(tier => {
      tier.teams.forEach(team => {
        allTeams.push({ name: team.name, appearances: team.appearances })
      })
    })

    // Build result array
    const result = allTeams.map(team => {
      const lastDraftYear = lastWinDraftYear[team.name]
      if (lastDraftYear) {
        // Championship year = draft year + 1
        const championshipYear = lastDraftYear + 1
        const yearsSince = currentYear - championshipYear
        return { name: team.name, yearsSince, hasWon: true, appearances: team.appearances }
      } else {
        return { name: team.name, yearsSince: null, hasWon: false, appearances: team.appearances }
      }
    })

    // Sort: winners first (by yearsSince ascending), then non-winners by appearances descending
    result.sort((a, b) => {
      if (a.hasWon && !b.hasWon) return -1
      if (!a.hasWon && b.hasWon) return 1
      if (a.hasWon && b.hasWon) return a.yearsSince - b.yearsSince
      return b.appearances - a.appearances
    })

    return result
  })

  return {
    seasons,
    draftLocations,
    loading,
    error,
    stats,
    championshipTiers,
    yearsSinceLastTitle,
    isDefunct,
    refetch: fetchChampionships
  }
}
