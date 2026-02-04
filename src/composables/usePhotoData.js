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

  // Upload a new photo
  const uploadPhoto = async (file, caption = '') => {
    if (!isAuthenticated.value) {
      return { success: false, error: 'You must be logged in to upload photos' }
    }

    if (!seasonId.value || !year.value) {
      return { success: false, error: 'Invalid season data' }
    }

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

    uploading.value = true
    uploadProgress.value = 0
    error.value = null

    try {
      // 1. Get pre-signed upload URL
      uploadProgress.value = 10
      const { uploadUrl, s3Key, error: urlError } = await getUploadUrl({
        filename: file.name,
        contentType: file.type,
        seasonId: seasonId.value,
        year: year.value
      })
      if (urlError) throw new Error(urlError)

      // 2. Upload to S3
      uploadProgress.value = 30
      const { success, error: uploadError } = await uploadToS3(uploadUrl, file)
      if (!success) throw new Error(uploadError)

      uploadProgress.value = 70

      // 3. Get the approved_owner id for current user
      const { ownerId, error: ownerError } = await getApprovedOwnerId(userProfile.value.teamId)
      if (ownerError || !ownerId) throw new Error(ownerError || 'Could not find owner record')

      // 4. Save metadata to Supabase
      const { error: saveError } = await savePhotoMetadata({
        seasonId: seasonId.value,
        s3Key,
        filename: file.name,
        caption,
        uploadedBy: ownerId
      })
      if (saveError) throw saveError

      uploadProgress.value = 100

      // 5. Refresh photos list
      await fetchPhotos()

      return { success: true, error: null }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    } finally {
      uploading.value = false
      uploadProgress.value = 0
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
    error,
    fetchPhotos,
    uploadPhoto,
    removePhoto,
    isAuthenticated
  }
}
