export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages required' });
  }

  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    console.error('Missing NVIDIA_API_KEY env var');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-mini-4b-instruct',
        max_tokens: 3000,
        temperature: 0.7,
        top_p: 0.7,
        stream: false,
        messages,
      }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error('NVIDIA API error:', response.status, rawText);
      return res.status(response.status).json({ error: 'NVIDIA API error', detail: rawText });
    }

    const data = JSON.parse(rawText);
    res.status(200).json(data);
  } catch (error) {
    console.error('Exception:', error.message);
    res.status(500).json({ error: 'Failed to fetch from NVIDIA', detail: error.message });
  }
}