<script setup>
import { watch, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { useAdminData } from '../composables/useAdminData'

const { isAdmin, loading: authLoading } = useAuth()
const router = useRouter()
const { teams, loading, error } = useAdminData()

// Separate active and inactive teams
const activeTeams = computed(() => teams.value.filter(t => t.isActive))
const inactiveTeams = computed(() => teams.value.filter(t => !t.isActive))

// Redirect if not admin (backup protection, route guard handles primary check)
watch([isAdmin, authLoading], ([admin, isLoading]) => {
  if (!isLoading && !admin) {
    router.push('/')
  }
}, { immediate: true })
</script>

<template>
  <div class="py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p class="text-gray-600 mb-8">Manage league owners and team settings</p>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600 mt-4">Loading owner data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-300 rounded-lg p-4 text-red-700">
        <p class="font-medium">Error loading data</p>
        <p class="text-sm">{{ error }}</p>
      </div>

      <!-- Active Teams Table -->
      <template v-else>
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-black text-white">
                  <th class="px-6 py-3 text-left text-sm font-semibold">Team Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold">Owner First Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold">Owner Last Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th class="px-6 py-3 text-center text-sm font-semibold">Admin</th>
                  <th class="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="team in activeTeams"
                  :key="team.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4">
                    <span class="font-medium">{{ team.name }}</span>
                  </td>
                  <td class="px-6 py-4">
                    {{ team.ownerFirstName || '-' }}
                  </td>
                  <td class="px-6 py-4">
                    {{ team.ownerLastName || '-' }}
                  </td>
                  <td class="px-6 py-4">
                    <span v-if="team.ownerEmail" class="text-blue-600">
                      {{ team.ownerEmail }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      v-if="team.isAdmin"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                    >
                      Yes
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <router-link
                      :to="`/admin/teams/${team.id}`"
                      class="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Edit
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Inactive Teams Table -->
        <div v-if="inactiveTeams.length > 0" class="mt-10">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Inactive Teams</h2>
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="bg-gray-600 text-white">
                    <th class="px-6 py-3 text-left text-sm font-semibold">Team Name</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold">Owner First Name</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold">Owner Last Name</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th class="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="team in inactiveTeams"
                    :key="team.id"
                    class="hover:bg-gray-50 transition-colors bg-gray-50"
                  >
                    <td class="px-6 py-4">
                      <span class="font-medium text-gray-500">{{ team.name }}</span>
                    </td>
                    <td class="px-6 py-4 text-gray-500">
                      {{ team.ownerFirstName || '-' }}
                    </td>
                    <td class="px-6 py-4 text-gray-500">
                      {{ team.ownerLastName || '-' }}
                    </td>
                    <td class="px-6 py-4">
                      <span v-if="team.ownerEmail" class="text-blue-400">
                        {{ team.ownerEmail }}
                      </span>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <router-link
                        :to="`/admin/teams/${team.id}`"
                        class="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Edit
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
