import { generateToken } from './generate-token.js'
import { createClient } from './create-client.js'


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const createClientResponse = await createClient(req.body)
    const generateTokenResponse = await generateToken({ clientId: createClientResponse.data.id })

    res.json(generateTokenResponse.data)
  } catch (error) {
    console.error(
      'Error generating token:',
      error.response?.data || error.message
    )
    res.status(500).json({ message: 'Failed to create client' })
  }
}
