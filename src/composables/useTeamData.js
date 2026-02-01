import { ref, onMounted } from 'vue'

export function useTeamData() {
  const teams = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const fetchTeams = async () => {
    try {
      loading.value = true
      const response = await fetch('/data/teams.json')
      if (!response.ok) throw new Error('Failed to load team data')
      const data = await response.json()
      teams.value = data.teams
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchTeams)

  return { teams, loading, error, refetch: fetchTeams }
}
