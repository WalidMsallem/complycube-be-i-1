//  demo APIs, not fully TESTED, it's a pseudo code 
export default async function handler(req, res) {
  const { clientId, livePhotoId, documentId } = req.body
  try {
    const ageEstimation = await createCheck({
      clientId,
      type: 'age_estimation_check',
      livePhotoId,
    })

    if (ageEstimation.result.outcome === 'clear') {
      return res.json({
        message: 'Age verified. Client is above the required age.',
      })
    }

    const documentCheck = await createCheck({
      clientId,
      type: 'identity_check',
      documentId,
    })
    res.json(documentCheck)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
