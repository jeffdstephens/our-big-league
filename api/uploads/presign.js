import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { filename, contentType, seasonId, year } = req.body

  // Validate required fields
  if (!filename || !contentType || !seasonId || !year) {
    return res.status(400).json({ error: 'Missing required fields: filename, contentType, seasonId, year' })
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png']
  if (!allowedTypes.includes(contentType)) {
    return res.status(400).json({ error: 'Only JPG and PNG files are allowed' })
  }

  // Validate file extension
  const ext = filename.split('.').pop().toLowerCase()
  const allowedExtensions = ['jpg', 'jpeg', 'png']
  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({ error: 'Invalid file extension' })
  }

  // Verify JWT token
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' })
  }

  const token = authHeader.split(' ')[1]

  // Verify user is authenticated via Supabase
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

    // Verify user is an approved owner
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('id, approved_owners!inner(id)')
      .ilike('owner_email', user.email)
      .single()

    if (teamError || !teamData) {
      return res.status(403).json({ error: 'User is not an approved league owner' })
    }

    // Generate unique S3 key
    const uuid = crypto.randomUUID()
    const s3Key = `drafts/${year}/${uuid}.${ext}`

    // Create S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    })

    // Create the PutObject command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      ContentType: contentType
    })

    // Generate pre-signed URL (5 minute expiry)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })

    return res.status(200).json({
      uploadUrl,
      s3Key,
      expiresIn: 300
    })
  } catch (err) {
    console.error('Presign error:', err)
    return res.status(500).json({ error: 'Failed to generate upload URL' })
  }
}
