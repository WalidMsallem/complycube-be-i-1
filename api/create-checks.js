import axios from 'axios'

const SUPPORTED_CHECK_TYPES = [
  'standard_screening_check',
  'extensive_screening_check',
  'document_check',
  'identity_check',
  'enhanced_identity_check',
  'proof_of_address_check',
  'multi_bureau_check',
  'face_authentication_check',
  'age_estimation_check',
  'driving_license_check',
  'eid_check',
]

export const createCheck = async ({
  clientId,
  type,
  enableMonitoring = false,
  documentId,
  livePhotoId,
  liveVideoId,
  options,
  clientConsent = false,
}) => {
  try {
    // Validate the type
    if (!SUPPORTED_CHECK_TYPES.includes(type)) {
      throw new Error(`Unsupported check type: ${type}`)
    }

    // Build request payload dynamically based on type and available data
    const payload = {
      clientId,
      type,
      enableMonitoring,
      clientConsent,
    }

    // Include extra parameters if required for the check type
    if (
      ['document_check', 'identity_check', 'enhanced_identity_check'].includes(
        type
      )
    ) {
      if (!documentId) {
        throw new Error('documentId is required for the specified check type.')
      }
      payload.documentId = documentId
    }

    if (
      [
        'identity_check',
        'age_estimation_check',
        'face_authentication_check',
      ].includes(type)
    ) {
      if (!livePhotoId) {
        throw new Error('livePhotoId is required for the specified check type.')
      }
      payload.livePhotoId = livePhotoId
    }

    if (['enhanced_identity_check'].includes(type)) {
      if (!liveVideoId) {
        throw new Error('liveVideoId is required for the specified check type.')
      }
      payload.liveVideoId = liveVideoId
    }

    if (options) {
      payload.options = options
    }
console.log('======= payload',payload)
console.log('======= options',options)
    // Make the API request
    const response = await axios.post(
      'https://api.complycube.com/v1/checks',
      payload,
      {
        headers: {
          Authorization: process.env.COMPLYCUBE_API_KEY,
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

export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

  try {
    const { clientId, checks } = req.body;

    // Validate input
    if (!clientId) {
      return res.status(400).json({ error: "clientId is required" });
    }
    if (!Array.isArray(checks) || checks.length === 0) {
      return res.status(400).json({ error: "checks must be a non-empty array" });
    }

    // Process each check
    const results = [];
    for (const check of checks) {
      const { type, enableMonitoring, documentId, livePhotoId, liveVideoId, options, clientConsent } =
        check;

      try {
        const result = await createCheck({
          clientId,
          type,
          enableMonitoring,
          documentId,
          livePhotoId,
          liveVideoId,
          options,
          clientConsent,
        });
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({
          success: false,
          error: error.message || "Failed to create check",
        });
      }
    }

    // Return the results for all checks
    return res.status(200).json(results);
  } catch (error) {
    console.error("Error processing checks:", error.message);
    return res.status(500).json({ error: "Failed to process checks" });
  }
}
