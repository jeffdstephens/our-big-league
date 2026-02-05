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
