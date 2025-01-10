import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
    const { email, firstName, lastName } = req.body

    try {
      const response = await axios.post(
        'https://api.complycube.com/v1/clients',
        {
          type: 'person',
          email,
          personDetails: { firstName, lastName },
        },
        {
          headers: {
            Authorization: process.env.COMPLYCUBE_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      )

      res.json(response.data)
    } catch (error) {
      console.error(
        'Error creating client:',
        error.response?.data || error.message
      )
      res.status(500).json({ message: 'Failed to create client' })
    }
}
