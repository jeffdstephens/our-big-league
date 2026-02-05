import { supabase } from '../composables/useSupabase'

/**
 * Fetch all seasons with related data
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getSeasons() {
  const { data, error } = await supabase
    .from('seasons')
    .select(`
      *,
      draft_location:draft_locations (
        id,
        city,
        lat,
        lng
      ),
      champion:teams!seasons_champion_id_fkey (
        id,
        name,
        logo,
        is_active,
        owner_first_name,
        owner_last_name
      ),
      co_champion:teams!seasons_co_champion_id_fkey (
        id,
        name,
        logo,
        is_active,
        owner_first_name,
        owner_last_name
      ),
      runner_up:teams!seasons_runner_up_id_fkey (
        id,
        name,
        logo,
        is_active
      )
    `)
    .order('year', { ascending: false })

  return { data, error }
}

/**
 * Fetch a single season by year
 * @param {number} year - Season year
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getSeasonByYear(year) {
  const { data, error } = await supabase
    .from('seasons')
    .select(`
      *,
      draft_location:draft_locations (
        id,
        city,
        lat,
        lng
      ),
      champion:teams!seasons_champion_id_fkey (
        id,
        name,
        logo,
        is_active,
        owner_first_name,
        owner_last_name
      ),
      co_champion:teams!seasons_co_champion_id_fkey (
        id,
        name,
        logo,
        is_active,
        owner_first_name,
        owner_last_name
      ),
      runner_up:teams!seasons_runner_up_id_fkey (
        id,
        name,
        logo,
        is_active
      )
    `)
    .eq('year', year)
    .single()

  return { data, error }
}

/**
 * Fetch all draft locations with their years
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getDraftLocations() {
  // Get all draft locations
  const { data: locations, error: locError } = await supabase
    .from('draft_locations')
    .select('*')
    .order('city')

  if (locError) return { data: null, error: locError }

  // Get seasons to map years to locations
  const { data: seasons, error: seasonsError } = await supabase
    .from('seasons')
    .select('year, draft_location_id')
    .order('year')

  if (seasonsError) return { data: null, error: seasonsError }

  // Add years array to each location
  const locationsWithYears = locations.map(loc => ({
    ...loc,
    years: seasons
      .filter(s => s.draft_location_id === loc.id)
      .map(s => s.year)
  }))

  // Filter out locations with no drafts (shouldn't happen, but just in case)
  return {
    data: locationsWithYears.filter(loc => loc.years.length > 0),
    error: null
  }
}

/**
 * Set the group/hero photo for a season
 * @param {string} seasonId - Season UUID
 * @param {string|null} photoId - draft_photos.id or null to unset
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function setGroupPhoto(seasonId, photoId) {
  const { error } = await supabase
    .from('seasons')
    .update({ group_photo_id: photoId })
    .eq('id', seasonId)

  return { success: !error, error }
}

/**
 * Get championship statistics
 * Includes inherited stats from predecessor teams
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getChampionshipStats() {
  const { data: seasons, error } = await supabase
    .from('seasons')
    .select(`
      year,
      champion_id,
      co_champion_id,
      runner_up_id,
      champion:teams!seasons_champion_id_fkey (
        id,
        name,
        is_active
      ),
      co_champion:teams!seasons_co_champion_id_fkey (
        id,
        name,
        is_active
      ),
      runner_up:teams!seasons_runner_up_id_fkey (
        id,
        name,
        is_active
      )
    `)

  if (error) return { data: null, error }

  // Get active teams for mapping
  const { data: activeTeams, error: teamsError } = await supabase
    .from('teams')
    .select('id, name')
    .eq('is_active', true)

  if (teamsError) return { data: null, error: teamsError }

  // Get team lineage to find predecessors
  const { data: lineage, error: lineageError } = await supabase
    .from('team_lineage')
    .select('predecessor_id, successor_id')

  if (lineageError) return { data: null, error: lineageError }

  // Build successor map: predecessor_id -> [successor teams]
  // This tells us which active teams should inherit a defunct team's stats
  const successorMap = {}
  lineage?.forEach(l => {
    if (!successorMap[l.predecessor_id]) {
      successorMap[l.predecessor_id] = []
    }
    const successorTeam = activeTeams.find(t => t.id === l.successor_id)
    if (successorTeam) {
      successorMap[l.predecessor_id].push(successorTeam)
    }
  })

  // Calculate stats
  const champCounts = {}
  const appearances = {}
  const lastWinYear = {}

  seasons.forEach(season => {
    const champion = season.champion
    const coChampion = season.co_champion
    const runnerUp = season.runner_up

    // Count championships - active teams
    if (champion && champion.is_active) {
      const name = champion.name
      if (coChampion) {
        champCounts[name] = (champCounts[name] || 0) + 0.5
      } else {
        champCounts[name] = (champCounts[name] || 0) + 1
      }
      appearances[name] = (appearances[name] || 0) + 1
      lastWinYear[name] = Math.max(lastWinYear[name] || 0, season.year)
    }

    // Count championships - defunct teams with successors
    if (champion && !champion.is_active && successorMap[champion.id]) {
      successorMap[champion.id].forEach(successor => {
        const name = successor.name
        if (coChampion) {
          champCounts[name] = (champCounts[name] || 0) + 0.5
        } else {
          champCounts[name] = (champCounts[name] || 0) + 1
        }
        appearances[name] = (appearances[name] || 0) + 1
        lastWinYear[name] = Math.max(lastWinYear[name] || 0, season.year)
      })
    }

    if (coChampion && coChampion.is_active) {
      const name = coChampion.name
      champCounts[name] = (champCounts[name] || 0) + 0.5
      appearances[name] = (appearances[name] || 0) + 1
      lastWinYear[name] = Math.max(lastWinYear[name] || 0, season.year)
    }

    // Count runner-up appearances - active teams
    if (runnerUp && runnerUp.is_active) {
      const name = runnerUp.name
      appearances[name] = (appearances[name] || 0) + 1
    }

    // Count runner-up appearances - defunct teams with successors
    if (runnerUp && !runnerUp.is_active && successorMap[runnerUp.id]) {
      successorMap[runnerUp.id].forEach(successor => {
        const name = successor.name
        appearances[name] = (appearances[name] || 0) + 1
      })
    }
  })

  // Find unique champions
  const uniqueChampions = Object.keys(champCounts).length

  // Find team(s) with most championships
  const maxCount = Math.max(...Object.values(champCounts), 0)
  const teamsWithMost = Object.entries(champCounts)
    .filter(([_, count]) => count === maxCount)
    .map(([team]) => team)

  // Find longest drought
  const currentYear = new Date().getFullYear()
  const droughts = Object.entries(lastWinYear)
    .map(([team, year]) => ({ team, years: currentYear - year }))
    .filter(d => d.years > 0)
    .sort((a, b) => b.years - a.years)

  // Teams with no titles
  const teamsWithNoTitles = Object.keys(appearances)
    .filter(team => !champCounts[team])

  return {
    data: {
      totalSeasons: seasons.length,
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
    },
    error: null
  }
}

/**
 * Get championship tiers (teams grouped by championship count)
 * Includes inherited stats from predecessor teams
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getChampionshipTiers() {
  const { data: seasons, error } = await supabase
    .from('seasons')
    .select(`
      champion_id,
      co_champion_id,
      runner_up_id,
      champion:teams!seasons_champion_id_fkey (
        id,
        name,
        is_active
      ),
      co_champion:teams!seasons_co_champion_id_fkey (
        id,
        name,
        is_active
      ),
      runner_up:teams!seasons_runner_up_id_fkey (
        id,
        name,
        is_active
      )
    `)

  if (error) return { data: null, error }

  // Get active teams for mapping
  const { data: activeTeams, error: teamsError } = await supabase
    .from('teams')
    .select('id, name')
    .eq('is_active', true)

  if (teamsError) return { data: null, error: teamsError }

  // Get team lineage to find predecessors
  const { data: lineage, error: lineageError } = await supabase
    .from('team_lineage')
    .select('predecessor_id, successor_id')

  if (lineageError) return { data: null, error: lineageError }

  // Build successor map: predecessor_id -> [successor teams]
  const successorMap = {}
  lineage?.forEach(l => {
    if (!successorMap[l.predecessor_id]) {
      successorMap[l.predecessor_id] = []
    }
    const successorTeam = activeTeams.find(t => t.id === l.successor_id)
    if (successorTeam) {
      successorMap[l.predecessor_id].push(successorTeam)
    }
  })

  const champCounts = {}
  const appearances = {}

  seasons.forEach(season => {
    const champion = season.champion
    const coChampion = season.co_champion
    const runnerUp = season.runner_up

    // Count active teams
    if (champion && champion.is_active) {
      const name = champion.name
      if (coChampion) {
        champCounts[name] = (champCounts[name] || 0) + 0.5
      } else {
        champCounts[name] = (champCounts[name] || 0) + 1
      }
      appearances[name] = (appearances[name] || 0) + 1
    }

    // Count defunct teams with successors
    if (champion && !champion.is_active && successorMap[champion.id]) {
      successorMap[champion.id].forEach(successor => {
        const name = successor.name
        if (coChampion) {
          champCounts[name] = (champCounts[name] || 0) + 0.5
        } else {
          champCounts[name] = (champCounts[name] || 0) + 1
        }
        appearances[name] = (appearances[name] || 0) + 1
      })
    }

    if (coChampion && coChampion.is_active) {
      const name = coChampion.name
      champCounts[name] = (champCounts[name] || 0) + 0.5
      appearances[name] = (appearances[name] || 0) + 1
    }

    if (runnerUp && runnerUp.is_active) {
      const name = runnerUp.name
      appearances[name] = (appearances[name] || 0) + 1
    }

    // Count runner-up appearances - defunct teams with successors
    if (runnerUp && !runnerUp.is_active && successorMap[runnerUp.id]) {
      successorMap[runnerUp.id].forEach(successor => {
        const name = successor.name
        appearances[name] = (appearances[name] || 0) + 1
      })
    }
  })

  // Group by championship count
  const tiers = {}
  Object.entries(champCounts).forEach(([team, count]) => {
    if (!tiers[count]) tiers[count] = []
    tiers[count].push({
      name: team,
      appearances: appearances[team] || 0
    })
  })

  // Add teams with 0 championships
  Object.keys(appearances).forEach(team => {
    if (!champCounts[team]) {
      if (!tiers[0]) tiers[0] = []
      tiers[0].push({
        name: team,
        appearances: appearances[team]
      })
    }
  })

  // Convert to sorted array
  const tiersArray = Object.entries(tiers)
    .map(([count, teams]) => ({
      count: parseFloat(count),
      teams: teams.sort((a, b) => b.appearances - a.appearances)
    }))
    .sort((a, b) => a.count - b.count)

  return { data: tiersArray, error: null }
}
