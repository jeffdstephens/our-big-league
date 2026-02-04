import { ref, computed, watch } from 'vue'
import {
  getPhotosBySeason,
  getUploadUrl,
  uploadToS3,
  savePhotoMetadata,
  getViewUrls,
  deletePhoto,
  getApprovedOwnerId
} from '../services/photoService'
import { useAuth } from './useAuth'

export function usePhotoData(seasonId, year) {
  const { userProfile, isAuthenticated } = useAuth()

  const photos = ref([])
  const photoUrls = ref({})
  const loading = ref(false)
  const uploading = ref(false)
  const uploadProgress = ref(0)
  const uploadCurrent = ref(0)
  const uploadTotal = ref(0)
  const error = ref(null)

  // Photos with resolved URLs and canDelete flag
  const photosWithUrls = computed(() => {
    return photos.value.map(photo => ({
      ...photo,
      url: photoUrls.value[photo.s3_key] || null,
      canDelete: photo.approved_owners?.team_id === userProfile.value?.teamId
    }))
  })

  // Fetch photos for this season
  const fetchPhotos = async () => {
    if (!seasonId.value) return

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await getPhotosBySeason(seasonId.value)
      if (fetchError) throw fetchError

      photos.value = data || []

      // Get view URLs for all photos
      if (photos.value.length > 0) {
        const s3Keys = photos.value.map(p => p.s3_key)
        const { urls, error: urlError } = await getViewUrls(s3Keys)
        if (urlError) throw new Error(urlError)
        photoUrls.value = urls
      } else {
        photoUrls.value = {}
      }
    } catch (e) {
      error.value = e.message
      console.error('Error fetching photos:', e)
    } finally {
      loading.value = false
    }
  }

  // Upload a single photo (internal helper)
  const uploadSinglePhoto = async (file, ownerId) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Only JPG and PNG files are allowed' }
    }

    // Validate file size (10 MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be under 10 MB' }
    }

    // 1. Get pre-signed upload URL
    const { uploadUrl, s3Key, error: urlError } = await getUploadUrl({
      filename: file.name,
      contentType: file.type,
      seasonId: seasonId.value,
      year: year.value
    })
    if (urlError) throw new Error(urlError)

    // 2. Upload to S3
    const { success, error: uploadError } = await uploadToS3(uploadUrl, file)
    if (!success) throw new Error(uploadError)

    // 3. Save metadata to Supabase
    const { error: saveError } = await savePhotoMetadata({
      seasonId: seasonId.value,
      s3Key,
      filename: file.name,
      uploadedBy: ownerId
    })
    if (saveError) throw saveError

    return { success: true, error: null }
  }

  // Upload multiple photos
  const uploadPhotos = async (files) => {
    if (!isAuthenticated.value) {
      return { success: false, error: 'You must be logged in to upload photos' }
    }

    if (!seasonId.value || !year.value) {
      return { success: false, error: 'Invalid season data' }
    }

    // Convert to array if single file
    const fileArray = Array.isArray(files) ? files : [files]

    if (fileArray.length === 0) {
      return { success: false, error: 'No files to upload' }
    }

    uploading.value = true
    uploadProgress.value = 0
    uploadCurrent.value = 0
    uploadTotal.value = fileArray.length
    error.value = null

    const errors = []

    try {
      // Get the approved_owner id for current user (once for all uploads)
      const { ownerId, error: ownerError } = await getApprovedOwnerId(userProfile.value.teamId)
      if (ownerError || !ownerId) throw new Error(ownerError || 'Could not find owner record')

      // Upload each file
      for (let i = 0; i < fileArray.length; i++) {
        uploadCurrent.value = i + 1
        uploadProgress.value = Math.round(((i + 0.5) / fileArray.length) * 100)

        try {
          const result = await uploadSinglePhoto(fileArray[i], ownerId)
          if (!result.success) {
            errors.push(`${fileArray[i].name}: ${result.error}`)
          }
        } catch (e) {
          errors.push(`${fileArray[i].name}: ${e.message}`)
        }

        uploadProgress.value = Math.round(((i + 1) / fileArray.length) * 100)
      }

      // Refresh photos list
      await fetchPhotos()

      if (errors.length > 0) {
        error.value = errors.join('; ')
        return { success: false, error: error.value }
      }

      return { success: true, error: null }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    } finally {
      uploading.value = false
      uploadProgress.value = 0
      uploadCurrent.value = 0
      uploadTotal.value = 0
    }
  }

  // Delete a photo
  const removePhoto = async (photoId, s3Key) => {
    try {
      const { success, error: deleteError } = await deletePhoto(photoId, s3Key)
      if (!success) throw new Error(deleteError)

      // Refresh photos list
      await fetchPhotos()
      return { success: true, error: null }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
  }

  // Auto-fetch when seasonId changes
  watch(seasonId, (newId) => {
    if (newId) fetchPhotos()
  }, { immediate: true })

  return {
    photos: photosWithUrls,
    loading,
    uploading,
    uploadProgress,
    uploadCurrent,
    uploadTotal,
    error,
    fetchPhotos,
    uploadPhotos,
    removePhoto,
    isAuthenticated
  }
}
