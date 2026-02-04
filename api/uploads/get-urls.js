import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { s3Keys } = req.body

  if (!s3Keys || !Array.isArray(s3Keys) || s3Keys.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid s3Keys array' })
  }

  // Limit batch size to prevent abuse
  if (s3Keys.length > 100) {
    return res.status(400).json({ error: 'Maximum 100 keys per request' })
  }

  try {
    // Create S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    })

    // Generate pre-signed URLs for all keys
    const urls = {}
    const expiresIn = 3600 // 1 hour

    await Promise.all(
      s3Keys.map(async (s3Key) => {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: s3Key
        })

        const url = await getSignedUrl(s3Client, command, { expiresIn })
        urls[s3Key] = url
      })
    )

    return res.status(200).json({
      urls,
      expiresIn
    })
  } catch (err) {
    console.error('Get URLs error:', err)
    return res.status(500).json({ error: 'Failed to generate view URLs' })
  }
}
