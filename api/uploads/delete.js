import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { s3Key, photoId } = req.body

  if (!s3Key || !photoId) {
    return res.status(400).json({ error: 'Missing required fields: s3Key, photoId' })
  }

  // Verify JWT token
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' })
  }

  const token = authHeader.split(' ')[1]

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Get the user's approved_owner record
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('id, approved_owners!inner(id)')
      .ilike('owner_email', user.email)
      .single()

    if (teamError || !teamData) {
      return res.status(403).json({ error: 'User is not an approved league owner' })
    }

    const userOwnerId = teamData.approved_owners.id

    // Verify photo ownership
    const { data: photo, error: photoError } = await supabase
      .from('draft_photos')
      .select('id, s3_key, uploaded_by')
      .eq('id', photoId)
      .single()

    if (photoError || !photo) {
      return res.status(404).json({ error: 'Photo not found' })
    }

    // Check if user owns this photo
    if (photo.uploaded_by !== userOwnerId) {
      return res.status(403).json({ error: 'You can only delete your own photos' })
    }

    // Verify s3Key matches
    if (photo.s3_key !== s3Key) {
      return res.status(400).json({ error: 'S3 key mismatch' })
    }

    // Delete from S3
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    })

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key
    })

    await s3Client.send(deleteCommand)

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Delete error:', err)
    return res.status(500).json({ error: 'Failed to delete photo' })
  }
}
