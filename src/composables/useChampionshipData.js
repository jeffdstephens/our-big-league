import { ref, computed, onMounted } from 'vue'

// Map historical team names to current team names
const teamNameMap = {
  'Real Stoutboogee': 'Stout',
  'SOULTRAIN FC': 'Stout',
  'AQUA BOOGEE': 'Stout',
  'PFUNK sir nose d void of funk': 'Stout',
  "I'm Sorry Bird!": 'Birrrdy',
  'Big Baad Birrrdy': 'Birrrdy',
  "Birrrdy's Revenge": 'Birrrdy',
  'Blank Again': 'Blank',
  'Blankland': 'Blank',
}

// Teams no longer in the league
const defunctTeams = new Set([
  'Cornball Hustlers',
  'The Wedding Fund',
  'Stealth Bombers',
  '2 Deep',
])

// Normalize team name to current name
const normalizeTeamName = (name) => {
  return teamNameMap[name] || name
}

// Check if team is defunct
const isDefunct = (name) => {
  return defunctTeams.has(name)
}

export function useChampionshipData() {
  const seasons = ref(null)
  const draftLocations = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const fetchChampionships = async () => {
    try {
      loading.value = true
      const response = await fetch('/data/championships.json')
      if (!response.ok) throw new Error('Failed to load championship data')
      const data = await response.json()
      seasons.value = data.seasons
      draftLocations.value = data.draftLocations
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Computed stats for the stats cards
  const stats = computed(() => {
    if (!seasons.value) return null

    // Count championships per team (using normalized names)
    const champCounts = {}
    const appearances = {}

    seasons.value.forEach(s => {
      // Handle co-champions
      if (s.champion.includes('&')) {
        s.champion.split('&').forEach(team => {
          const name = normalizeTeamName(team.trim())
          if (!isDefunct(team.trim())) {
            champCounts[name] = (champCounts[name] || 0) + 0.5
            appearances[name] = (appearances[name] || 0) + 1
          }
        })
      } else {
        const name = normalizeTeamName(s.champion)
        if (!isDefunct(s.champion)) {
          champCounts[name] = (champCounts[name] || 0) + 1
          appearances[name] = (appearances[name] || 0) + 1
        }
      }

      // Count runner-up appearances
      if (s.runnerUp && s.runnerUp !== '------') {
        const name = normalizeTeamName(s.runnerUp)
        if (!isDefunct(s.runnerUp)) {
          appearances[name] = (appearances[name] || 0) + 1
        }
      }
    })

    // Find unique active champions
    const uniqueChampions = Object.keys(champCounts).length

    // Find team(s) with most championships
    const maxCount = Math.max(...Object.values(champCounts))
    const teamsWithMost = Object.entries(champCounts)
      .filter(([_, count]) => count === maxCount)
      .map(([team]) => team)

    // Find longest championship drought
    const lastWinYear = {}
    seasons.value.forEach(s => {
      if (s.champion.includes('&')) {
        s.champion.split('&').forEach(team => {
          const name = normalizeTeamName(team.trim())
          if (!isDefunct(team.trim())) {
            lastWinYear[name] = Math.max(lastWinYear[name] || 0, s.year)
          }
        })
      } else {
        const name = normalizeTeamName(s.champion)
        if (!isDefunct(s.champion)) {
          lastWinYear[name] = Math.max(lastWinYear[name] || 0, s.year)
        }
      }
    })

    const currentYear = new Date().getFullYear()
    const droughts = Object.entries(lastWinYear)
      .map(([team, year]) => ({ team, years: currentYear - year }))
      .filter(d => d.years > 0)
      .sort((a, b) => b.years - a.years)

    // Count teams with no titles (active teams that appeared but never won)
    const teamsWithNoTitles = Object.keys(appearances).filter(team => !champCounts[team])

    return {
      totalSeasons: seasons.value.length,
      uniqueChampions,
      mostTitles: {
        teams: teamsWithMost,
        count: maxCount
      },
      longestDrought: droughts[0] || null,
      noTitles: {
        count: teamsWithNoTitles.length,
        teams: teamsWithNoTitles
      }
    }
  })

  // Group teams by championship count for summary section (excluding defunct teams)
  const championshipTiers = computed(() => {
    if (!seasons.value) return []

    const champCounts = {}
    const appearances = {}

    seasons.value.forEach(s => {
      // Count championships (using normalized names, excluding defunct)
      if (s.champion.includes('&')) {
        s.champion.split('&').forEach(team => {
          const originalName = team.trim()
          if (isDefunct(originalName)) return
          const name = normalizeTeamName(originalName)
          champCounts[name] = (champCounts[name] || 0) + 0.5
          appearances[name] = (appearances[name] || 0) + 1
        })
      } else {
        if (isDefunct(s.champion)) return
        const name = normalizeTeamName(s.champion)
        champCounts[name] = (champCounts[name] || 0) + 1
        appearances[name] = (appearances[name] || 0) + 1
      }

      // Count runner-up appearances (excluding defunct)
      if (s.runnerUp && s.runnerUp !== '------' && !isDefunct(s.runnerUp)) {
        const name = normalizeTeamName(s.runnerUp)
        appearances[name] = (appearances[name] || 0) + 1
      }
    })

    // Group teams by championship count
    const tiers = {}
    Object.entries(champCounts).forEach(([team, count]) => {
      if (!tiers[count]) tiers[count] = []
      tiers[count].push({
        name: team,
        appearances: appearances[team] || 0
      })
    })

    // Add teams with 0 championships (appeared as runner-up only)
    Object.keys(appearances).forEach(team => {
      if (!champCounts[team]) {
        if (!tiers[0]) tiers[0] = []
        tiers[0].push({
          name: team,
          appearances: appearances[team]
        })
      }
    })

    // Sort tiers (0 to highest) and teams within each tier by appearances
    return Object.entries(tiers)
      .map(([count, teams]) => ({
        count: parseFloat(count),
        teams: teams.sort((a, b) => b.appearances - a.appearances)
      }))
      .sort((a, b) => a.count - b.count)
  })

  onMounted(fetchChampionships)

  return {
    seasons,
    draftLocations,
    loading,
    error,
    stats,
    championshipTiers,
    normalizeTeamName,
    isDefunct,
    refetch: fetchChampionships
  }
}
