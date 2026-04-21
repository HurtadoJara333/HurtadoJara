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
        model: 'meta/llama-3.1-8b-instruct',
        max_tokens: 1024,
        temperature: 0.2,
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
    res.json(data);
  } catch (error) {
    console.error('Exception:', error.message);
    res.status(500).json({ error: 'Failed to fetch from NVIDIA', detail: error.message });
  }
});

app.listen(3001, () => console.log('Oracle server running on http://localhost:3001'));