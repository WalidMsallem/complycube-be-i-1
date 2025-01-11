import axios from "axios";

export default async function handler(req, res) {
  const { clientId, page = 1, pageSize = 10 } = req.query;

  if (!clientId) {
    return res.status(400).json({ error: "clientId is required" });
  }

  try {
    const response = await axios.get("https://api.complycube.com/v1/checks", {
      params: {
        clientId,
        page,
        pageSize,
      },
      headers: {
        Authorization: process.env.COMPLYCUBE_API_KEY,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching checks:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch checks" });
  }
}
