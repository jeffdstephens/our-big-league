import { ref, computed } from 'vue'
import { supabase } from './useSupabase'

// Shared state (singleton pattern - all components share the same refs)
const user = ref(null)
const userProfile = ref(null)
const loading = ref(true)
const error = ref(null)
const initialized = ref(false)

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => userProfile.value?.isAdmin === true)

  // Validate email against approved owners
  const validateEmail = async (email) => {
    try {
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      // Handle 404 in development (serverless functions not available)
      if (response.status === 404) {
        console.warn('Validation endpoint not available. Using Supabase direct query.')
        return await validateEmailDirect(email)
      }

      return await response.json()
    } catch (err) {
      console.error('Email validation error:', err)
      // Fallback to direct Supabase query
      return await validateEmailDirect(email)
    }
  }

  // Direct Supabase validation (fallback for local dev)
  const validateEmailDirect = async (email) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          logo,
          owner_email,
          approved_owners!inner (
            id,
            is_admin
          )
        `)
        .ilike('owner_email', email)
        .single()

      if (error || !data) {
        return {
          valid: false,
          message: 'Email not authorized for this league'
        }
      }

      return {
        valid: true,
        teamId: data.id,
        teamName: data.name,
        teamLogo: data.logo,
        isAdmin: data.approved_owners?.is_admin || false
      }
    } catch (err) {
      console.error('Direct validation error:', err)
      return { valid: false, message: 'Validation failed' }
    }
  }

  // Handle successful auth - validate and set profile
  const handleAuthSuccess = async (session) => {
    if (!session?.user?.email) {
      return false
    }

    const validation = await validateEmail(session.user.email)

    if (!validation.valid) {
      // Sign out unauthorized user
      await supabase.auth.signOut()
      error.value = validation.message || 'Your email is not authorized for this league'
      user.value = null
      userProfile.value = null
      return false
    }

    user.value = session.user
    userProfile.value = {
      teamId: validation.teamId,
      teamName: validation.teamName,
      teamLogo: validation.teamLogo,
      isAdmin: validation.isAdmin
    }
    error.value = null
    return true
  }

  // Initialize auth listener
  const initAuth = async () => {
    if (initialized.value) return

    loading.value = true

    // Check for existing session
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await handleAuthSuccess(session)
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await handleAuthSuccess(session)
      } else if (event === 'SIGNED_OUT') {
        user.value = null
        userProfile.value = null
        error.value = null
      }
      loading.value = false
    })

    initialized.value = true
    loading.value = false
  }

  // Login with Google OAuth
  const loginWithGoogle = async () => {
    error.value = null
    loading.value = true
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      if (authError) throw authError
    } catch (err) {
      error.value = err.message
      loading.value = false
    }
  }

  // Login with Microsoft OAuth
  const loginWithMicrosoft = async () => {
    error.value = null
    loading.value = true
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: window.location.origin,
          scopes: 'email openid profile'
        }
      })
      if (authError) throw authError
    } catch (err) {
      error.value = err.message
      loading.value = false
    }
  }

  // Login with email/password
  const loginWithEmail = async (email, password) => {
    error.value = null
    loading.value = true
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (authError) throw authError

      // Validate email after successful auth
      if (data.session) {
        const success = await handleAuthSuccess(data.session)
        if (!success) {
          loading.value = false
          return false
        }
      }
      loading.value = false
      return true
    } catch (err) {
      error.value = err.message
      loading.value = false
      return false
    }
  }

  // Sign up with email/password
  const signUpWithEmail = async (email, password) => {
    error.value = null
    loading.value = true
    try {
      // First validate that email is in approved list
      const validation = await validateEmail(email)
      if (!validation.valid) {
        error.value = validation.message || 'Your email is not authorized for this league'
        loading.value = false
        return false
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password
      })
      if (authError) throw authError

      // If sign up succeeded and we have a session, validate it
      if (data.session) {
        await handleAuthSuccess(data.session)
      } else if (data.user && !data.session) {
        // User created but needs email confirmation
        error.value = null
        loading.value = false
        return 'confirm_email'
      }

      loading.value = false
      return true
    } catch (err) {
      error.value = err.message
      loading.value = false
      return false
    }
  }

  // Logout
  const logout = async () => {
    loading.value = true
    try {
      await supabase.auth.signOut()
      user.value = null
      userProfile.value = null
      error.value = null
    } catch (err) {
      error.value = err.message
    }
    loading.value = false
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  return {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    initAuth,
    loginWithGoogle,
    loginWithMicrosoft,
    loginWithEmail,
    signUpWithEmail,
    logout,
    clearError
  }
}
