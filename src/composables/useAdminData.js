import { ref, onMounted } from 'vue'
import { getTeamsForAdmin } from '../services/teamService'

export function useAdminData() {
  const teams = ref([])
  const loading = ref(true)
  const error = ref(null)

  const fetchTeams = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await getTeamsForAdmin()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      // Transform data for easier use in components (snake_case to camelCase)
      teams.value = data.map(team => ({
        id: team.id,
        name: team.name,
        location: team.location,
        lat: team.lat,
        lng: team.lng,
        logo: team.logo,
        ownerFirstName: team.owner_first_name,
        ownerLastName: team.owner_last_name,
        ownerEmail: team.owner_email,
        ownerPhone: team.owner_phone,
        isActive: team.is_active,
        createdAt: team.created_at,
        isAdmin: team.approved_owners?.is_admin || false,
        approvedOwnerId: team.approved_owners?.id || null
      }))
    } catch (e) {
      error.value = e.message
      console.error('Error fetching admin data:', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchTeams)

  return {
    teams,
    loading,
    error,
    refetch: fetchTeams
  }
}
