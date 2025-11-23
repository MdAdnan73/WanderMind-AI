import type { NextApiRequest, NextApiResponse } from 'next';
import { ParentAgent } from '@/lib/agents/parent-agent';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const parentAgent = new ParentAgent(
      process.env.NOMINATIM_API_URL,
      process.env.OPEN_METEO_API_URL,
      process.env.OVERPASS_API_URL
    );

    const result = await parentAgent.processQuery(query);

    return res.status(200).json(result);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while processing your query. Please try again.',
    });
  }
}

