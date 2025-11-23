import type { NextApiRequest, NextApiResponse } from 'next';
import { EnhancedParentAgent } from '@/lib/agents/enhanced-parent-agent';
import { AgeGroup, TravelPersona } from '@/lib/agents/user-profile-agent';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { queryText, ageGroup, visitDate, visitDateEnd, persona } = req.body;

  if (!queryText || typeof queryText !== 'string' || queryText.trim().length === 0) {
    return res.status(400).json({ error: 'Query text is required' });
  }

  if (!ageGroup || !visitDate) {
    return res.status(400).json({ error: 'Age group and visit date are required' });
  }

  try {
    const parentAgent = new EnhancedParentAgent(
      process.env.NOMINATIM_API_URL,
      process.env.OPEN_METEO_API_URL,
      process.env.OVERPASS_API_URL,
      process.env.EVENTBRITE_KEY,
      process.env.TRAFFIC_API_KEY,
      process.env.OPENTRIPMAP_KEY,
      process.env.OPENAI_API_KEY,
      process.env.GEMINI_API_KEY
    );

    const result = await parentAgent.processEnhancedQuery(
      queryText,
      ageGroup as AgeGroup,
      visitDate,
      visitDateEnd || null,
      (persona as TravelPersona) || null
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error('Enhanced API error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while processing your query. Please try again.',
    });
  }
}

