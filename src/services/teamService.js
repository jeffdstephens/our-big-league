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

// ============================================
// Admin Functions
// ============================================

/**
 * Fetch all teams with their admin status for admin view
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getTeamsForAdmin() {
  const { data, error } = await supabase
    .from('teams')
    .select(`
      *,
      approved_owners (
        id,
        is_admin
      )
    `)
    .order('name')

  return { data, error }
}

/**
 * Fetch a single team with aliases and admin status for editing
 * @param {string} teamId - Team UUID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getTeamForEdit(teamId) {
  const { data, error } = await supabase
    .from('teams')
    .select(`
      *,
      approved_owners (
        id,
        is_admin
      ),
      team_aliases (
        id,
        alias
      )
    `)
    .eq('id', teamId)
    .single()

  return { data, error }
}

/**
 * Update a team's information
 * @param {string} teamId - Team UUID
 * @param {Object} updates - Fields to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updateTeam(teamId, updates) {
  const { data, error } = await supabase
    .from('teams')
    .update(updates)
    .eq('id', teamId)
    .select('id')

  if (!error && (!data || data.length === 0)) {
    return { data: null, error: { message: 'Update failed - permission denied or team not found' } }
  }

  return { data: data?.[0] || null, error }
}

/**
 * Update approved_owner admin status
 * @param {string} teamId - Team UUID
 * @param {boolean} isAdmin - New admin status
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updateOwnerAdminStatus(teamId, isAdmin) {
  const { data, error } = await supabase
    .from('approved_owners')
    .update({ is_admin: isAdmin })
    .eq('team_id', teamId)
    .select('id')

  // If no rows were updated, it's OK - not all teams have approved_owners records
  if (!error && (!data || data.length === 0)) {
    return { data: null, error: null }
  }

  return { data: data?.[0] || null, error }
}

/**
 * Update team and admin status together
 * @param {string} teamId - Team UUID
 * @param {Object} teamUpdates - Team fields to update
 * @param {boolean} isAdmin - New admin status
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function updateTeamAndAdminStatus(teamId, teamUpdates, isAdmin) {
  // Update team first
  const { error: teamError } = await updateTeam(teamId, teamUpdates)
  if (teamError) {
    return { success: false, error: teamError }
  }

  // Update admin status
  const { error: adminError } = await updateOwnerAdminStatus(teamId, isAdmin)
  if (adminError) {
    return { success: false, error: adminError }
  }

  return { success: true, error: null }
}

/**
 * Add a new alias to a team
 * @param {string} teamId - Team UUID
 * @param {string} alias - Alias name to add
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function addTeamAlias(teamId, alias) {
  const { data, error } = await supabase
    .from('team_aliases')
    .insert({ team_id: teamId, alias: alias.trim() })
    .select()
    .single()

  return { data, error }
}

/**
 * Update a team alias
 * @param {string} aliasId - Alias UUID
 * @param {string} newAlias - New alias text
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updateTeamAlias(aliasId, newAlias) {
  const { data, error } = await supabase
    .from('team_aliases')
    .update({ alias: newAlias.trim() })
    .eq('id', aliasId)
    .select('id, alias')

  if (!error && (!data || data.length === 0)) {
    return { data: null, error: { message: 'Alias update failed - permission denied or alias not found' } }
  }

  return { data: data?.[0] || null, error }
}

/**
 * Delete a team alias
 * @param {string} aliasId - Alias UUID
 * @returns {Promise<{error: Error|null}>}
 */
export async function deleteTeamAlias(aliasId) {
  const { error } = await supabase
    .from('team_aliases')
    .delete()
    .eq('id', aliasId)

  return { error }
}
