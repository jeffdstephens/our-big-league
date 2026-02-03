import { supabase } from '../composables/useSupabase'

/**
 * Fetch all teams with optional filtering
 * @param {Object} options - Query options
 * @param {boolean} options.activeOnly - Only return active teams (default: false)
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getTeams({ activeOnly = false } = {}) {
  let query = supabase
    .from('teams')
    .select('*')
    .order('name')

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query
  return { data, error }
}

/**
 * Fetch a single team by ID
 * @param {string} id - Team UUID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getTeamById(id) {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

/**
 * Fetch all teams with their championship stats calculated
 * Includes inherited stats from predecessor teams (e.g., 2 Deep → Jamaica's Finest + Showtime)
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getTeamsWithStats() {
  // Get teams
  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (teamsError) return { data: null, error: teamsError }

  // Get seasons for calculating stats
  const { data: seasons, error: seasonsError } = await supabase
    .from('seasons')
    .select('champion_id, co_champion_id, runner_up_id, year')

  if (seasonsError) return { data: null, error: seasonsError }

  // Get team lineage to find predecessors
  const { data: lineage, error: lineageError } = await supabase
    .from('team_lineage')
    .select('predecessor_id, successor_id')

  if (lineageError) return { data: null, error: lineageError }

  // Build predecessor map: successor_id -> [predecessor_ids]
  const predecessorMap = {}
  lineage?.forEach(l => {
    if (!predecessorMap[l.successor_id]) {
      predecessorMap[l.successor_id] = []
    }
    predecessorMap[l.successor_id].push(l.predecessor_id)
  })

  // Calculate stats for each team
  const teamsWithStats = teams.map(team => {
    let championships = 0
    let appearances = 0
    const championshipYears = []

    // Get all team IDs to count (team + predecessors)
    const teamIds = [team.id, ...(predecessorMap[team.id] || [])]

    seasons.forEach(season => {
      teamIds.forEach(teamId => {
        const isChampion = season.champion_id === teamId
        const isCoChampion = season.co_champion_id === teamId
        const isRunnerUp = season.runner_up_id === teamId

        if (isChampion) {
          // Check if it's a co-championship
          if (season.co_champion_id) {
            championships += 0.5
          } else {
            championships += 1
          }
          championshipYears.push(season.year)
          appearances += 1
        } else if (isCoChampion) {
          championships += 0.5
          championshipYears.push(season.year)
          appearances += 1
        } else if (isRunnerUp) {
          appearances += 1
        }
      })
    })

    return {
      ...team,
      championships,
      appearances,
      championshipYears: championshipYears.sort((a, b) => a - b)
    }
  })

  return { data: teamsWithStats, error: null }
}

/**
 * Fetch all team aliases
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getTeamAliases() {
  const { data, error } = await supabase
    .from('team_aliases')
    .select(`
      id,
      alias,
      team_id,
      teams (
        id,
        name
      )
    `)

  return { data, error }
}

/**
 * Find team by alias (historical name)
 * @param {string} alias - Historical team name
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getTeamByAlias(alias) {
  const { data, error } = await supabase
    .from('team_aliases')
    .select(`
      teams (*)
    `)
    .eq('alias', alias)
    .single()

  return { data: data?.teams || null, error }
}
