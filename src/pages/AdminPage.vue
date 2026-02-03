<script setup>
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const { isAdmin, isAuthenticated, loading } = useAuth()
const router = useRouter()

// Redirect if not admin (backup protection, route guard handles primary check)
watch([isAdmin, loading], ([admin, isLoading]) => {
  if (!isLoading && !admin) {
    router.push('/')
  }
}, { immediate: true })
</script>

<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p class="text-gray-600 mb-8">Manage league data and settings</p>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-center py-12">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 class="text-xl font-semibold text-gray-700 mb-2">Admin Features Coming Soon</h2>
          <p class="text-gray-500 max-w-md mx-auto">
            This area will be used for managing team information, updating season data,
            and other administrative tasks.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
