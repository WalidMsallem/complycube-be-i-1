import axios from 'axios'

export const assignAddress = async ({ clientId, ...addressData }) => {
  try {
    const response = await axios.post(
      'https://api.complycube.com/v1/addresses',
      { clientId, addressData },
      {
        headers: {
          Authorization: `process.env.COMPLYCUBE_API_KEY`,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error) {
    console.error(
      'Error creating check:',
      error.response?.data || error.message
    )
    throw error
  }
}
