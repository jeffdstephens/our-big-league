import { ref, computed } from 'vue'

// Placeholder for future Supabase Auth integration
// See CLAUDE.md for implementation details

const user = ref(null)
const loading = ref(false)

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)

  const login = async () => {
    // TODO: Implement Supabase Auth with Google OAuth
    console.warn('Auth not implemented yet')
  }

  const logout = async () => {
    // TODO: Implement Supabase Auth logout
    console.warn('Auth not implemented yet')
  }

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  }
}
