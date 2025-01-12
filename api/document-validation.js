import { assignAddress } from "./assign-address";
import { createCheck } from "./create-checks";

export default async function handler(req, res) {
  const { clientId, documentId } = req.body;

  try {
    // Step 1: Perform Identity Check
    const identityCheck = await createCheck({
      clientId,
      type: 'identity_check',
      documentId,
    });

    if (identityCheck.result !== 'clear') {
      return res.json({ message: 'Identity check not clear. Manual review required.' });
    }

    // Step 2: Perform Proof of Address Check
    const proofOfAddressCheck = await createCheck({
      clientId,
      type: 'proof_of_address_check',
      documentId,
    });

    if (proofOfAddressCheck.result.outcome !== 'clear') {
      return res.json({ message: 'Proof of address check not clear. Manual review required.' });
    }

    // Step 3: Extract Address Details
    const { addressDetails } = proofOfAddressCheck.result.breakdown.extractedData;
    const address = addressDetails.address;

    // Step 4: Assign Address to Client
    const addressAssignment = await assignAddress({
      clientId,
      type: 'main',
      propertyNumber: address.propertyNumber,
      line: address.line,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });

    // Step 5: Perform Multi-Bureau Check
    const multiBureauCheck = await createCheck({
      clientId,
      addressId: addressAssignment.id,
      type: 'multi_bureau_check',
      options: { twoPlusTwo: true },
    });

    res.json(multiBureauCheck);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
}
