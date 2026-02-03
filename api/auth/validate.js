import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  // Use service key to bypass RLS
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Query for approved owner by joining teams with approved_owners
    // Check if the email exists in teams.owner_email and has an approved_owners entry
    const { data, error } = await supabase
      .from('teams')
      .select(`
        id,
        name,
        logo,
        owner_email,
        approved_owners!inner (
          id,
          is_admin
        )
      `)
      .ilike('owner_email', email)
      .single()

    if (error || !data) {
      return res.status(200).json({
        valid: false,
        message: 'Email not authorized for this league'
      })
    }

    return res.status(200).json({
      valid: true,
      teamId: data.id,
      teamName: data.name,
      teamLogo: data.logo,
      isAdmin: data.approved_owners?.is_admin || false
    })
  } catch (err) {
    console.error('Validation error:', err)
    return res.status(500).json({ error: 'Validation failed' })
  }
}
