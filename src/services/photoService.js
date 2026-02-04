import { supabase } from '../composables/useSupabase'

/**
 * Fetch photos for a specific season
 * @param {string} seasonId - Season UUID
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getPhotosBySeason(seasonId) {
  const { data, error } = await supabase
    .from('draft_photos')
    .select(`
      id,
      s3_key,
      filename,
      caption,
      uploaded_at,
      uploaded_by,
      approved_owners!draft_photos_uploaded_by_fkey (
        id,
        team_id
      )
    `)
    .eq('season_id', seasonId)
    .eq('is_approved', true)
    .order('uploaded_at', { ascending: false })

  return { data, error }
}

/**
 * Get pre-signed upload URL from serverless function
 * @param {Object} params
 * @param {string} params.filename - Original filename
 * @param {string} params.contentType - MIME type
 * @param {string} params.seasonId - Season UUID
 * @param {number} params.year - Draft year
 * @returns {Promise<{uploadUrl: string, s3Key: string, error: string|null}>}
 */
export async function getUploadUrl({ filename, contentType, seasonId, year }) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.access_token) {
    return { uploadUrl: null, s3Key: null, error: 'Not authenticated' }
  }

  try {
    const response = await fetch('/api/uploads/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ filename, contentType, seasonId, year })
    })

    const data = await response.json()

    if (!response.ok) {
      return { uploadUrl: null, s3Key: null, error: data.error || 'Failed to get upload URL' }
    }

    return { uploadUrl: data.uploadUrl, s3Key: data.s3Key, error: null }
  } catch (err) {
    return { uploadUrl: null, s3Key: null, error: err.message }
  }
}

/**
 * Upload file directly to S3 using pre-signed URL
 * @param {string} uploadUrl - Pre-signed PUT URL
 * @param {File} file - File to upload
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function uploadToS3(uploadUrl, file) {
  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    })

    if (!response.ok) {
      return { success: false, error: 'Upload to S3 failed' }
    }

    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Save photo metadata to Supabase after successful S3 upload
 * @param {Object} params
 * @param {string} params.seasonId
 * @param {string} params.s3Key
 * @param {string} params.filename
 * @param {string} params.uploadedBy - approved_owners.id
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function savePhotoMetadata({ seasonId, s3Key, filename, uploadedBy }) {
  const { data, error } = await supabase
    .from('draft_photos')
    .insert({
      season_id: seasonId,
      s3_key: s3Key,
      filename,
      uploaded_by: uploadedBy,
      is_approved: true
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Get pre-signed GET URLs for viewing photos
 * @param {Array<string>} s3Keys - Array of S3 keys
 * @returns {Promise<{urls: Object, error: string|null}>}
 */
export async function getViewUrls(s3Keys) {
  if (!s3Keys || s3Keys.length === 0) {
    return { urls: {}, error: null }
  }

  try {
    const response = await fetch('/api/uploads/get-urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ s3Keys })
    })

    const data = await response.json()

    if (!response.ok) {
      return { urls: {}, error: data.error || 'Failed to get view URLs' }
    }

    return { urls: data.urls, error: null }
  } catch (err) {
    return { urls: {}, error: err.message }
  }
}

/**
 * Delete a photo (removes from S3 and Supabase)
 * @param {string} photoId - draft_photos.id
 * @param {string} s3Key - S3 object key
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function deletePhoto(photoId, s3Key) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.access_token) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Delete from S3 via serverless function
    const s3Response = await fetch('/api/uploads/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ s3Key, photoId })
    })

    const s3Data = await s3Response.json()

    if (!s3Response.ok) {
      return { success: false, error: s3Data.error || 'Failed to delete from S3' }
    }

    // Delete from Supabase
    const { error } = await supabase
      .from('draft_photos')
      .delete()
      .eq('id', photoId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Get approved_owners.id for a team
 * @param {string} teamId - teams.id
 * @returns {Promise<{ownerId: string|null, error: string|null}>}
 */
export async function getApprovedOwnerId(teamId) {
  const { data, error } = await supabase
    .from('approved_owners')
    .select('id')
    .eq('team_id', teamId)
    .single()

  if (error) {
    return { ownerId: null, error: error.message }
  }

  return { ownerId: data?.id || null, error: null }
}
