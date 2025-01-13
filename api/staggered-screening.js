export default async function handler(req, res) {
  const { clientId, liveVideoId, documentId } = req.body

  try {
    const standardCheck = await createCheck({
      clientId,
      type: 'standard_screening_check',
      liveVideoId,
      documentId,
    })

    if (standardCheck.result === 'clear') {
      const extensiveCheck = await createCheck({
        clientId,
        type: 'extensive_screening_check',
        liveVideoId,
        documentId,
      })

      if (extensiveCheck.result === 'clear') {
        const monitoring = await enableMonitoring(clientId)
        return res.json({ message: 'Monitoring enabled', monitoring })
      }

      res.json({
        message: 'Extensive screening not clear. Manual review required.',
      })
    } else {
      res.json({
        message: 'Standard screening not clear. Manual review required.',
      })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
