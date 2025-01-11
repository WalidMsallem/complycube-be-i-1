import axios from 'axios'

export const generateToken = async ({ clientId }) =>
  await axios.post(
    'https://api.complycube.com/v1/tokens',
    {
      clientId,
      referrer: process.env.REFERRER_WEBSITE,
    },
    {
      headers: {
        Authorization: process.env.COMPLYCUBE_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  )

export default async function handler(req, res) {
  try {
    const response = await generateToken(req.body)
    res.status(200).json(response.data)
  } catch (error) {
    console.error(
      'Error generating token:',
      error.response?.data || error.message
    )
    res.status(500).json({ error: 'Failed to generate token' })
  }
}
