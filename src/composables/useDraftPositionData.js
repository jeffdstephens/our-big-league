import { ref, computed, onMounted } from 'vue'
import { getDraftPositions } from '../services/draftPositionService'

export function useDraftPositionData() {
  const positions = ref([])
  const loading = ref(true)
  const error = ref(null)

  const fetchPositions = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await getDraftPositions()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      positions.value = data || []
    } catch (e) {
      error.value = e.message
      console.error('Error fetching draft positions:', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchPositions)

  // Get unique years from the data, sorted
  const years = computed(() => {
    const yearSet = new Set(positions.value.map(p => p.season?.year).filter(Boolean))
    return [...yearSet].sort((a, b) => a - b)
  })

  // Get unique teams from the data, sorted by name
  const teams = computed(() => {
    const teamMap = new Map()
    positions.value.forEach(p => {
      if (p.team && !teamMap.has(p.team.id)) {
        teamMap.set(p.team.id, p.team)
      }
    })
    return [...teamMap.values()].sort((a, b) => a.name.localeCompare(b.name))
  })

  // Pivot to grid format: { teamId: { year: position } }
  const positionGrid = computed(() => {
    const grid = {}
    positions.value.forEach(p => {
      if (!p.team || !p.season) return
      if (!grid[p.team.id]) {
        grid[p.team.id] = { team: p.team, positions: {} }
      }
      grid[p.team.id].positions[p.season.year] = p.draft_position
    })
    return grid
  })

  // Calculate stats per team
  const teamStats = computed(() => {
    const stats = []

    teams.value.forEach(team => {
      const teamPositions = positions.value
        .filter(p => p.team?.id === team.id)
        .map(p => p.draft_position)

      if (teamPositions.length === 0) return

      const avgPosition = teamPositions.reduce((a, b) => a + b, 0) / teamPositions.length
      const firstPicks = teamPositions.filter(p => p === 1).length
      const lastPicks = teamPositions.filter(p => p === 14).length
      const top5Picks = teamPositions.filter(p => p <= 5).length

      stats.push({
        team,
        avgPosition: Math.round(avgPosition * 10) / 10,
        firstPicks,
        lastPicks,
        top5Picks,
        totalDrafts: teamPositions.length
      })
    })

    return stats.sort((a, b) => a.avgPosition - b.avgPosition)
  })

  return {
    positions,
    years,
    teams,
    positionGrid,
    teamStats,
    loading,
    error,
    refetch: fetchPositions
  }
}
