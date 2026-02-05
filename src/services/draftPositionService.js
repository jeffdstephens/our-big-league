import { supabase } from '../composables/useSupabase'

/**
 * Fetch all draft positions with team and season data (for grid display)
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getDraftPositions() {
  const { data, error } = await supabase
    .from('draft_positions')
    .select(`
      id,
      draft_position,
      team:teams(id, name, logo),
      season:seasons(id, year)
    `)
    .order('draft_position')

  return { data, error }
}

/**
 * Fetch draft positions for a specific season (for detail page)
 * @param {string} seasonId - Season UUID
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getDraftPositionsBySeason(seasonId) {
  const { data, error } = await supabase
    .from('draft_positions')
    .select(`
      id,
      draft_position,
      team:teams(id, name, logo)
    `)
    .eq('season_id', seasonId)
    .order('draft_position')

  return { data, error }
}

/**
 * Fetch draft positions for a specific team
 * @param {string} teamId - Team UUID
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getDraftPositionsByTeam(teamId) {
  const { data, error } = await supabase
    .from('draft_positions')
    .select(`
      id,
      draft_position,
      season:seasons(id, year)
    `)
    .eq('team_id', teamId)
    .order('season(year)')

  return { data, error }
}

/**
 * Save/update draft positions for a season (delete + insert pattern)
 * @param {string} seasonId - Season UUID
 * @param {Array<{teamId: string, position: number}>} positions - Array of team positions
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function saveDraftPositions(seasonId, positions) {
  // Filter out empty positions
  const validPositions = positions.filter(p => p.position !== null && p.position !== '')

  // Delete existing positions for this season
  const { error: deleteError } = await supabase
    .from('draft_positions')
    .delete()
    .eq('season_id', seasonId)

  if (deleteError) {
    return { success: false, error: deleteError }
  }

  // If no positions to insert, we're done
  if (validPositions.length === 0) {
    return { success: true, error: null }
  }

  // Insert new positions
  const insertData = validPositions.map(p => ({
    season_id: seasonId,
    team_id: p.teamId,
    draft_position: parseInt(p.position, 10)
  }))

  const { error: insertError } = await supabase
    .from('draft_positions')
    .insert(insertData)

  return { success: !insertError, error: insertError }
}
