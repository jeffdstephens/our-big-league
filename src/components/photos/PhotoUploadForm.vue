<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  uploading: {
    type: Boolean,
    default: false
  },
  uploadProgress: {
    type: Number,
    default: 0
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['upload'])

const isDragging = ref(false)
const selectedFile = ref(null)
const caption = ref('')
const localError = ref(null)
const fileInput = ref(null)

const previewUrl = computed(() => {
  if (!selectedFile.value) return null
  return URL.createObjectURL(selectedFile.value)
})

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const validateFile = (file) => {
  localError.value = null

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    localError.value = 'Only JPG and PNG files are allowed'
    return false
  }

  // Check file size (10 MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    localError.value = 'File size must be under 10 MB'
    return false
  }

  return true
}

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file && validateFile(file)) {
    selectedFile.value = file
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files?.[0]
  if (file && validateFile(file)) {
    selectedFile.value = file
  }
}

const clearSelection = () => {
  selectedFile.value = null
  caption.value = ''
  localError.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleUpload = () => {
  if (!selectedFile.value) return
  emit('upload', selectedFile.value, caption.value)
  // Clear form after emit (parent will handle success/error)
  clearSelection()
}
</script>

<template>
  <div v-if="isAuthenticated" class="upload-form bg-gray-50 rounded-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Upload a Photo</h3>

    <!-- Drag and Drop Zone -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png"
        @change="handleFileSelect"
        class="hidden"
      />

      <div v-if="!selectedFile">
        <!-- Upload Icon -->
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="mt-2 text-gray-600">Drag and drop a photo here, or</p>
        <button
          @click="fileInput.click()"
          class="mt-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          browse to select
        </button>
        <p class="mt-2 text-sm text-gray-500">JPG or PNG, max 10 MB</p>
      </div>

      <!-- Selected File Preview -->
      <div v-else class="flex items-center gap-4">
        <img
          :src="previewUrl"
          alt="Preview"
          class="w-20 h-20 object-cover rounded"
        />
        <div class="text-left flex-1 min-w-0">
          <p class="font-medium truncate text-gray-900">{{ selectedFile.name }}</p>
          <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
        </div>
        <button
          @click="clearSelection"
          class="text-gray-400 hover:text-gray-600 p-1"
          title="Remove"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Caption Input -->
    <div v-if="selectedFile" class="mt-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Caption (optional)
      </label>
      <input
        v-model="caption"
        type="text"
        maxlength="200"
        placeholder="Add a caption..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p class="text-xs text-gray-500 mt-1">{{ caption.length }}/200 characters</p>
    </div>

    <!-- Upload Button -->
    <div v-if="selectedFile" class="mt-4">
      <button
        @click="handleUpload"
        :disabled="uploading"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="uploading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Uploading... {{ uploadProgress }}%
        </span>
        <span v-else>Upload Photo</span>
      </button>
    </div>

    <!-- Error Display -->
    <p v-if="localError" class="mt-2 text-red-600 text-sm">{{ localError }}</p>
  </div>

  <!-- Not Authenticated State -->
  <div v-else class="bg-gray-50 rounded-lg p-6 text-center">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
    <p class="mt-2 text-gray-600">Log in to upload photos</p>
  </div>
</template>
