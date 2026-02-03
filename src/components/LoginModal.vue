<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '../composables/useAuth'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const {
  loading,
  error,
  loginWithGoogle,
  loginWithMicrosoft,
  loginWithEmail,
  signUpWithEmail,
  clearError,
  isAuthenticated
} = useAuth()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const localError = ref('')
const successMessage = ref('')

// Close modal when authenticated
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    resetForm()
    emit('close')
  }
})

// Clear errors when modal opens/closes
watch(() => props.isOpen, (open) => {
  if (open) {
    clearError()
    localError.value = ''
    successMessage.value = ''
  }
})

const resetForm = () => {
  email.value = ''
  password.value = ''
  isSignUp.value = false
  localError.value = ''
  successMessage.value = ''
}

const handleEmailSubmit = async () => {
  localError.value = ''
  successMessage.value = ''

  if (!email.value || !password.value) {
    localError.value = 'Please enter both email and password'
    return
  }

  if (password.value.length < 6) {
    localError.value = 'Password must be at least 6 characters'
    return
  }

  if (isSignUp.value) {
    const result = await signUpWithEmail(email.value, password.value)
    if (result === 'confirm_email') {
      successMessage.value = 'Check your email to confirm your account'
    }
  } else {
    await loginWithEmail(email.value, password.value)
  }
}

const handleClose = () => {
  resetForm()
  clearError()
  emit('close')
}

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  localError.value = ''
  successMessage.value = ''
  clearError()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="handleClose"
        />

        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <!-- Close button -->
          <button
            @click="handleClose"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
            {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
          </h2>

          <!-- Error message -->
          <div
            v-if="error || localError"
            class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm"
          >
            {{ error || localError }}
          </div>

          <!-- Success message -->
          <div
            v-if="successMessage"
            class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm"
          >
            {{ successMessage }}
          </div>

          <!-- Social login buttons -->
          <div class="space-y-3 mb-6">
            <button
              @click="loginWithGoogle"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-2.5 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              @click="loginWithMicrosoft"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-2.5 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg class="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Continue with Microsoft
            </button>
          </div>

          <!-- Divider -->
          <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <!-- Email/Password form -->
          <form @submit.prevent="handleEmailSubmit" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                :disabled="loading"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="owner@example.com"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                :autocomplete="isSignUp ? 'new-password' : 'current-password'"
                required
                :disabled="loading"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>
                {{ isSignUp ? 'Create Account' : 'Sign In' }}
              </span>
            </button>
          </form>

          <!-- Toggle sign up / sign in -->
          <p class="mt-4 text-center text-sm text-gray-600">
            {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
            <button
              @click="toggleMode"
              class="text-blue-600 hover:text-blue-700 font-medium ml-1"
            >
              {{ isSignUp ? 'Sign in' : 'Sign up' }}
            </button>
          </p>

          <!-- League note -->
          <p class="mt-4 text-center text-xs text-gray-500">
            Only authorized league owners can access this site.
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
