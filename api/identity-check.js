import { createCheck } from "./create-checks.js";

//  demo APIs, not fully TESTED, it's a pseudo code 
export default async function handler(req, res) {
  const { clientId, documentId, livePhotoId } = req.body;
  try {
    const identityCheck = await createCheck({
      clientId,
      type: 'identity_check',
      documentId,
      livePhotoId,
    });

    if (identityCheck.result.outcome.outcome === 'clear') {
      const faceAuthCheck = await createCheck({
        clientId,
        type: 'face_authentication_check',
        livePhotoId,
      });
      return res.json(faceAuthCheck);
    }

    res.json({ message: 'Identity check not clear. Manual review required.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

