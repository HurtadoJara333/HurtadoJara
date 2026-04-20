import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local') });

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/oracle', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages required' });
  }

  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
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
        model: 'nvidia/z-ai/glm5',
        max_tokens: 800,
        temperature: 0.7,
        top_p: 0.9,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('NVIDIA API error:', error);
      return res.status(response.status).json({ error: 'NVIDIA API error' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch from NVIDIA' });
  }
});

app.listen(3001, () => console.log('Oracle server running on http://localhost:3001'));
