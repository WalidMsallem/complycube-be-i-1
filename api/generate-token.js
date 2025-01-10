import axios from 'axios'
// const express = require('express')
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await axios.post(
      'https://api.complycube.com/v1/tokens',
      {
        clientId: process.env.COMPLYCUBE_CLIENT_ID,
        referrer: process.env.REFERRER_WEBSITE,
      },
      {
        headers: {
          Authorization: process.env.COMPLYCUBE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )

    res.status(200).json(response.data)
  } catch (error) {
    console.error(
      'Error generating token:',
      error.response?.data || error.message
    )
    res.status(500).json({ error: 'Failed to generate token' })
  }
}
