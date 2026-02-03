import { ref, onMounted } from 'vue'
import { getTeamsWithStats } from '../services/teamService'

export function useTeamData() {
  const teams = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const fetchTeams = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await getTeamsWithStats()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      teams.value = data
    } catch (e) {
      error.value = e.message
      console.error('Error fetching teams:', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchTeams)

  return { teams, loading, error, refetch: fetchTeams }
}
