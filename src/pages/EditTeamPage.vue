<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { getTeamForEdit, updateTeamAndAdminStatus, addTeamAlias, deleteTeamAlias, updateTeamAlias } from '../services/teamService'
import ToastNotification from '../components/ToastNotification.vue'

const route = useRoute()
const router = useRouter()
const { isAdmin, loading: authLoading } = useAuth()

// Page state
const team = ref(null)
const loading = ref(true)
const saving = ref(false)
const error = ref(null)

// Form state
const formData = ref({
  name: '',
  location: '',
  lat: '',
  lng: '',
  logo: '',
  ownerFirstName: '',
  ownerLastName: '',
  ownerEmail: '',
  ownerPhone: '',
  isActive: true,
  isAdmin: false
})

const originalEmail = ref('')
const aliases = ref([])
const newAlias = ref('')
const editingAliasId = ref(null)
const editingAliasText = ref('')
const formErrors = ref({})
const geocoding = ref(false)

// Toast state
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Computed
const emailChanged = computed(() => {
  return formData.value.ownerEmail !== originalEmail.value
})

// Redirect if not admin
watch([isAdmin, authLoading], ([admin, isLoading]) => {
  if (!isLoading && !admin) {
    router.push('/')
  }
}, { immediate: true })

// Fetch team data
const fetchTeam = async () => {
  try {
    loading.value = true
    error.value = null

    const teamId = route.params.id
    const { data, error: fetchError } = await getTeamForEdit(teamId)

    if (fetchError) {
      throw new Error(fetchError.message)
    }

    if (!data) {
      throw new Error('Team not found')
    }

    team.value = data

    // Populate form
    formData.value = {
      name: data.name || '',
      location: data.location || '',
      lat: data.lat ?? '',
      lng: data.lng ?? '',
      logo: data.logo || '',
      ownerFirstName: data.owner_first_name || '',
      ownerLastName: data.owner_last_name || '',
      ownerEmail: data.owner_email || '',
      ownerPhone: data.owner_phone || '',
      isActive: data.is_active ?? true,
      isAdmin: data.approved_owners?.is_admin ?? false
    }

    originalEmail.value = data.owner_email || ''
    aliases.value = data.team_aliases || []

  } catch (e) {
    error.value = e.message
    console.error('Error fetching team:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchTeam)

// Form validation
const validate = () => {
  const errors = {}

  if (!formData.value.name.trim()) {
    errors.name = 'Team name is required'
  }

  if (formData.value.lat !== '' && formData.value.lat !== null) {
    const lat = parseFloat(formData.value.lat)
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.lat = 'Latitude must be between -90 and 90'
    }
  }

  if (formData.value.lng !== '' && formData.value.lng !== null) {
    const lng = parseFloat(formData.value.lng)
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.lng = 'Longitude must be between -180 and 180'
    }
  }

  if (formData.value.ownerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.ownerEmail)) {
    errors.ownerEmail = 'Invalid email format'
  }

  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// Save team
const handleSave = async () => {
  if (!validate()) return

  saving.value = true

  try {
    const teamUpdates = {
      name: formData.value.name.trim(),
      location: formData.value.location?.trim() || null,
      lat: formData.value.lat !== '' ? parseFloat(formData.value.lat) : null,
      lng: formData.value.lng !== '' ? parseFloat(formData.value.lng) : null,
      logo: formData.value.logo?.trim() || null,
      owner_first_name: formData.value.ownerFirstName?.trim() || null,
      owner_last_name: formData.value.ownerLastName?.trim() || null,
      owner_email: formData.value.ownerEmail?.trim() || null,
      owner_phone: formData.value.ownerPhone?.trim() || null,
      is_active: formData.value.isActive
    }

    const { success, error: updateError } = await updateTeamAndAdminStatus(
      team.value.id,
      teamUpdates,
      formData.value.isAdmin
    )

    if (!success) {
      throw new Error(updateError?.message || 'Failed to update team')
    }

    showToast('Team updated successfully', 'success')

    // Navigate back after short delay
    setTimeout(() => {
      router.push('/admin')
    }, 1500)

  } catch (e) {
    showToast(e.message || 'Failed to save changes', 'error')
  } finally {
    saving.value = false
  }
}

// Add alias
const handleAddAlias = async () => {
  const aliasText = newAlias.value.trim()

  if (!aliasText) {
    showToast('Please enter an alias', 'error')
    return
  }

  // Check for duplicate
  if (aliases.value.some(a => a.alias.toLowerCase() === aliasText.toLowerCase())) {
    showToast('This alias already exists', 'error')
    return
  }

  try {
    const { data, error: addError } = await addTeamAlias(team.value.id, aliasText)

    if (addError) {
      throw new Error(addError.message)
    }

    aliases.value.push(data)
    newAlias.value = ''
    showToast('Alias added', 'success')

  } catch (e) {
    showToast(e.message || 'Failed to add alias', 'error')
  }
}

// Delete alias
const handleDeleteAlias = async (aliasId) => {
  try {
    const { error: deleteError } = await deleteTeamAlias(aliasId)

    if (deleteError) {
      throw new Error(deleteError.message)
    }

    aliases.value = aliases.value.filter(a => a.id !== aliasId)
    showToast('Alias deleted', 'success')

  } catch (e) {
    showToast(e.message || 'Failed to delete alias', 'error')
  }
}

// Edit alias
const startEditingAlias = (alias) => {
  editingAliasId.value = alias.id
  editingAliasText.value = alias.alias
}

const cancelEditingAlias = () => {
  editingAliasId.value = null
  editingAliasText.value = ''
}

const handleUpdateAlias = async (aliasId) => {
  const newText = editingAliasText.value.trim()

  if (!newText) {
    showToast('Alias cannot be empty', 'error')
    return
  }

  // Check for duplicate (excluding current alias)
  if (aliases.value.some(a => a.id !== aliasId && a.alias.toLowerCase() === newText.toLowerCase())) {
    showToast('This alias already exists', 'error')
    return
  }

  try {
    const { data, error: updateError } = await updateTeamAlias(aliasId, newText)

    if (updateError) {
      throw new Error(updateError.message)
    }

    // Update local state
    const index = aliases.value.findIndex(a => a.id === aliasId)
    if (index !== -1) {
      aliases.value[index] = data
    }

    editingAliasId.value = null
    editingAliasText.value = ''
    showToast('Alias updated', 'success')

  } catch (e) {
    showToast(e.message || 'Failed to update alias', 'error')
  }
}

// Geocoding - lookup lat/lng from location
const lookupCoordinates = async () => {
  const location = formData.value.location?.trim()

  if (!location) {
    showToast('Please enter a location first', 'error')
    return
  }

  geocoding.value = true

  try {
    // Use Nominatim OpenStreetMap API (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
      {
        headers: {
          'User-Agent': 'OurBigLeague/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch coordinates')
    }

    const data = await response.json()

    if (data.length === 0) {
      showToast('Location not found. Try a more specific address.', 'error')
      return
    }

    const result = data[0]
    formData.value.lat = parseFloat(result.lat).toFixed(6)
    formData.value.lng = parseFloat(result.lon).toFixed(6)
    showToast('Coordinates found and populated', 'success')

  } catch (e) {
    showToast(e.message || 'Failed to lookup coordinates', 'error')
  } finally {
    geocoding.value = false
  }
}

// Toast helpers
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
}

const closeToast = () => {
  toast.value.show = false
}
</script>

<template>
  <div class="py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Back link -->
      <router-link
        to="/admin"
        class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Admin
      </router-link>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600 mt-4">Loading team data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-300 rounded-lg p-4 text-red-700">
        <p class="font-medium">Error loading team</p>
        <p class="text-sm">{{ error }}</p>
      </div>

      <!-- Edit Form -->
      <template v-else>
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Edit Team: {{ team?.name }}</h1>

        <form @submit.prevent="handleSave" class="space-y-8">
          <!-- Team Information Section -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Team Information</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Team Name -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Team Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="formErrors.name ? 'border-red-500' : 'border-gray-300'"
                />
                <p v-if="formErrors.name" class="text-red-500 text-sm mt-1">{{ formErrors.name }}</p>
              </div>

              <!-- Location -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div class="flex gap-2">
                  <input
                    v-model="formData.location"
                    type="text"
                    placeholder="e.g., Dallas, TX"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    @click="lookupCoordinates"
                    :disabled="geocoding"
                    class="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    title="Lookup coordinates from location"
                  >
                    <svg v-if="geocoding" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="hidden sm:inline">Lookup Coords</span>
                  </button>
                </div>
                <p class="text-gray-500 text-xs mt-1">Enter city, state to auto-populate coordinates</p>
              </div>

              <!-- Latitude -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  v-model="formData.lat"
                  type="number"
                  step="any"
                  placeholder="-90 to 90"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="formErrors.lat ? 'border-red-500' : 'border-gray-300'"
                />
                <p v-if="formErrors.lat" class="text-red-500 text-sm mt-1">{{ formErrors.lat }}</p>
              </div>

              <!-- Longitude -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  v-model="formData.lng"
                  type="number"
                  step="any"
                  placeholder="-180 to 180"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="formErrors.lng ? 'border-red-500' : 'border-gray-300'"
                />
                <p v-if="formErrors.lng" class="text-red-500 text-sm mt-1">{{ formErrors.lng }}</p>
              </div>

              <!-- Logo -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Logo Filename</label>
                <input
                  v-model="formData.logo"
                  type="text"
                  placeholder="e.g., team-logo.png"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p class="text-gray-500 text-xs mt-1">Filename of logo in src/assets/</p>
              </div>

              <!-- Active Status -->
              <div class="md:col-span-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="formData.isActive"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm font-medium text-gray-700">Active Team</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Owner Information Section -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Owner Information</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- First Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  v-model="formData.ownerFirstName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  v-model="formData.ownerLastName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Email -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="formData.ownerEmail"
                  type="email"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="formErrors.ownerEmail ? 'border-red-500' : 'border-gray-300'"
                />
                <p v-if="formErrors.ownerEmail" class="text-red-500 text-sm mt-1">{{ formErrors.ownerEmail }}</p>

                <!-- Email change warning -->
                <div v-if="emailChanged" class="mt-2 p-3 bg-yellow-50 border border-yellow-300 rounded-md">
                  <div class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p class="text-yellow-800 font-medium text-sm">Email Change Warning</p>
                      <p class="text-yellow-700 text-sm">
                        Changing the email will affect who can log in as this team.
                        The previous email ({{ originalEmail || 'none' }}) will no longer have access.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Phone -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  v-model="formData.ownerPhone"
                  type="text"
                  placeholder="e.g., 555-123-4567"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Admin Status -->
              <div class="md:col-span-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="formData.isAdmin"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm font-medium text-gray-700">Admin Access</span>
                </label>
                <p class="text-gray-500 text-xs mt-1">Allows access to admin dashboard</p>
              </div>
            </div>
          </div>

          <!-- Team Aliases Section -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Team Aliases</h2>
            <p class="text-gray-600 text-sm mb-4">Historical names this team has used</p>

            <!-- Existing aliases -->
            <div v-if="aliases.length > 0" class="space-y-2 mb-4">
              <div
                v-for="alias in aliases"
                :key="alias.id"
                class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
              >
                <!-- Editing mode -->
                <template v-if="editingAliasId === alias.id">
                  <input
                    v-model="editingAliasText"
                    type="text"
                    class="flex-1 mr-2 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @keyup.enter="handleUpdateAlias(alias.id)"
                    @keyup.escape="cancelEditingAlias"
                  />
                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      @click="handleUpdateAlias(alias.id)"
                      class="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                      title="Save changes"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      @click="cancelEditingAlias"
                      class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                      title="Cancel editing"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </template>

                <!-- Display mode -->
                <template v-else>
                  <span class="text-gray-700">{{ alias.alias }}</span>
                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      @click="startEditingAlias(alias)"
                      class="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
                      title="Edit alias"
                    >
                      <!-- Pencil icon -->
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      @click="handleDeleteAlias(alias.id)"
                      class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                      title="Delete alias"
                    >
                      <!-- Trash icon -->
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </template>
              </div>
            </div>
            <p v-else class="text-gray-500 text-sm mb-4">No aliases defined</p>

            <!-- Add new alias -->
            <div class="flex gap-2">
              <input
                v-model="newAlias"
                type="text"
                placeholder="Enter new alias"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter="handleAddAlias"
              />
              <button
                type="button"
                @click="handleAddAlias"
                class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3">
            <router-link
              to="/admin"
              class="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="saving" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </template>

      <!-- Toast Notification -->
      <ToastNotification
        :show="toast.show"
        :message="toast.message"
        :type="toast.type"
        @close="closeToast"
      />
    </div>
  </div>
</template>
