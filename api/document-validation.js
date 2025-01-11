export default async function handler(req, res) {
  const { clientId, documentId } = req.body
  try {
    const documentCheck = await createCheck({
      clientId,
      type: 'document_check',
      documentId,
    })

    if (documentCheck.result === 'clear') {
      const proofOfAddressCheck = await createCheck({
        clientId,
        type: 'proof_of_address_check',
        documentId,
      })
      return res.json(proofOfAddressCheck)
    }

    res.json({ message: 'Document check not clear. Manual review required.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
