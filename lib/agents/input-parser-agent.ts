/**
 * Input Parser Agent
 * Uses LLM (GPT/Gemini) to parse natural language input and extract:
 * - Place name
 * - Intent (weather, places, both, full)
 */

export interface ParsedInput {
  placeName: string;
  intent: 'weather' | 'places' | 'both' | 'full';
  confidence: number;
}

export class InputParserAgent {
  private openaiKey?: string;
  private geminiKey?: string;
  private useGemini: boolean;

  constructor(openaiKey?: string, geminiKey?: string) {
    this.openaiKey = openaiKey;
    this.geminiKey = geminiKey;
    this.useGemini = !!geminiKey; // Prefer Gemini if available
  }

  /**
   * Parse user input using LLM
   */
  async parseInput(query: string): Promise<ParsedInput | null> {
    // Try LLM first if keys are available
    if (this.useGemini && this.geminiKey) {
      const result = await this.parseWithGemini(query);
      if (result) return result;
    }

    if (this.openaiKey) {
      const result = await this.parseWithGPT(query);
      if (result) return result;
    }

    // Fallback to rule-based parsing
    return this.parseWithRules(query);
  }

  /**
   * Parse using Google Gemini
   */
  private async parseWithGemini(query: string): Promise<ParsedInput | null> {
    try {
      const prompt = `You are a travel assistant. Extract the place name and intent from this user query: "${query}"

Return ONLY a JSON object with this exact format:
{
  "placeName": "extracted place name (capitalize properly)",
  "intent": "weather" or "places" or "both" or "full",
  "confidence": 0.0 to 1.0
}

Intent rules:
- "weather": user only asks about temperature/weather
- "places": user only asks about places/attractions to visit
- "both": user asks about both weather AND places
- "full": user wants to plan a trip or asks for comprehensive planning

Examples:
- "I'm going to Bangalore, what is the temperature there" → {"placeName": "Bangalore", "intent": "weather", "confidence": 0.95}
- "I'm going to go to Bangalore, let's plan my trip" → {"placeName": "Bangalore", "intent": "full", "confidence": 0.95}
- "What places can I visit in Paris?" → {"placeName": "Paris", "intent": "places", "confidence": 0.9}

Return ONLY the JSON, no other text.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          }),
        }
      );

      if (!response.ok) {
        console.error('Gemini API error:', response.status);
        return null;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) return null;

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          placeName: parsed.placeName,
          intent: parsed.intent,
          confidence: parsed.confidence || 0.8,
        };
      }
    } catch (error) {
      console.error('Gemini parsing error:', error);
    }

    return null;
  }

  /**
   * Parse using OpenAI GPT
   */
  private async parseWithGPT(query: string): Promise<ParsedInput | null> {
    try {
      const prompt = `You are a travel assistant. Extract the place name and intent from this user query: "${query}"

Return ONLY a JSON object with this exact format:
{
  "placeName": "extracted place name (capitalize properly)",
  "intent": "weather" or "places" or "both" or "full",
  "confidence": 0.0 to 1.0
}

Intent rules:
- "weather": user only asks about temperature/weather
- "places": user only asks about places/attractions to visit
- "both": user asks about both weather AND places
- "full": user wants to plan a trip or asks for comprehensive planning

Return ONLY the JSON, no other text.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful travel assistant. Extract place names and intent from user queries. Always return valid JSON only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status);
        return null;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      
      if (!text) return null;

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          placeName: parsed.placeName,
          intent: parsed.intent,
          confidence: parsed.confidence || 0.8,
        };
      }
    } catch (error) {
      console.error('GPT parsing error:', error);
    }

    return null;
  }

  /**
   * Fallback rule-based parsing
   */
  private parseWithRules(query: string): ParsedInput {
    const lowerQuery = query.toLowerCase();
    const normalized = query.trim();

    // SIMPLE AND RELIABLE EXTRACTION
    let placeName = '';

    // Step 1: Find "going to go to" or "going to" pattern
    const goingToGoToIndex = lowerQuery.indexOf('going to go to');
    const goingToIndex = lowerQuery.indexOf('going to');
    
    if (goingToGoToIndex !== -1) {
      // Extract everything after "going to go to"
      const afterPhrase = normalized.substring(goingToGoToIndex + 'going to go to'.length).trim();
      // Stop at comma, period, or question words
      const match = afterPhrase.match(/^([^,\.\?]+?)(?:\s*[,\.]|\s+(?:what|where|when|how|let'?s|lets|plan|is|there|are|can|will|the)|\s*$)/i);
      if (match && match[1]) {
        placeName = match[1].trim();
      }
    } else if (goingToIndex !== -1) {
      // Extract everything after "going to"
      const afterPhrase = normalized.substring(goingToIndex + 'going to'.length).trim();
      // Stop at comma, period, or question words
      const match = afterPhrase.match(/^([^,\.\?]+?)(?:\s*[,\.]|\s+(?:what|where|when|how|let'?s|lets|plan|is|there|are|can|will|the)|\s*$)/i);
      if (match && match[1]) {
        placeName = match[1].trim();
      }
    }
    
    // Step 2: If still no match, try "visiting" or "visit"
    if (!placeName) {
      const visitingIndex = lowerQuery.indexOf('visiting');
      const visitIndex = lowerQuery.indexOf(' visit ');
      if (visitingIndex !== -1) {
        const afterPhrase = normalized.substring(visitingIndex + 'visiting'.length).trim();
        const match = afterPhrase.match(/^([^,\.\?]+?)(?:\s*[,\.]|\s+(?:what|where|when|how|let'?s|lets|plan|is|there|are|can|will|the)|\s*$)/i);
        if (match && match[1]) {
          placeName = match[1].trim();
        }
      } else if (visitIndex !== -1) {
        const afterPhrase = normalized.substring(visitIndex + ' visit '.length).trim();
        const match = afterPhrase.match(/^([^,\.\?]+?)(?:\s*[,\.]|\s+(?:what|where|when|how|let'?s|lets|plan|is|there|are|can|will|the)|\s*$)/i);
        if (match && match[1]) {
          placeName = match[1].trim();
        }
      }
    }
    
    // Step 3: Clean the extracted place name
    if (placeName) {
      // Remove any trailing punctuation
      placeName = placeName.replace(/[.,!?;:]+$/, '').trim();
      // Remove common trailing words
      placeName = placeName.replace(/\s+(what|where|when|how|let'?s|lets|plan|the|is|there|are|can|will|and|or)$/i, '').trim();
      // Capitalize properly
      placeName = placeName.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }

    // Pattern 2: "in/at/to [Place]"
    if (!placeName) {
      const pattern2 = /(?:in|at|to|near|around)\s+([a-zA-Z\s]+?)(?:\s|,|\.|$|\?|what|where)/i;
      match = normalized.match(pattern2);
      if (match && match[1]) {
        placeName = match[1].trim().replace(/[.,!?]/g, '').replace(/\s+/g, ' ');
      }
    }

    // Pattern 3: "[Place] weather/temperature/places"
    if (!placeName) {
      const pattern3 = /([a-zA-Z\s]+?)\s+(?:weather|temperature|temp|places|attractions)/i;
      match = normalized.match(pattern3);
      if (match && match[1]) {
        placeName = match[1].trim().replace(/[.,!?]/g, '').replace(/\s+/g, ' ');
      }
    }

    // Fallback: extract any capitalized word or common city names
    if (!placeName) {
      const words = normalized.split(/\s+/);
      const commonWords = ['what', 'where', 'when', 'how', 'tell', 'me', 'about', 'the', 'and', 'or', 'but', 'can', 'will', 'should', 'plan', 'my', 'trip', 'going', 'to', 'go', 'am', 'i', 'is', 'are', 'lets', 'let\'s', 'a', 'an', 'there', 'visiting', 'visit'];
      const potentialPlaces: string[] = [];
      let foundTrigger = false;

      for (let i = 0; i < words.length; i++) {
        const word = words[i].replace(/[.,!?]/g, '').toLowerCase();
        if (word === 'going' || word === 'to' || word === 'visiting' || word === 'visit') {
          foundTrigger = true;
          continue;
        }
        if (foundTrigger && word.length > 2 && !commonWords.includes(word)) {
          potentialPlaces.push(word);
        } else if (potentialPlaces.length > 0 && commonWords.includes(word)) {
          break;
        }
      }

      if (potentialPlaces.length > 0) {
        placeName = potentialPlaces.join(' ');
      }
    }

    // Capitalize place name
    if (placeName) {
      placeName = placeName.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }

    // Determine intent
    const weatherKeywords = ['weather', 'temperature', 'temp', 'rain', 'precipitation', 'forecast', 'hot', 'cold'];
    const placesKeywords = ['places', 'attractions', 'visit', 'see', 'tourist', 'sightseeing', 'things to do', 'where to go'];
    const planKeywords = ['plan', 'planning', 'itinerary', 'trip', 'let\'s plan', 'lets plan', 'help me plan'];

    const hasWeather = weatherKeywords.some(k => lowerQuery.includes(k));
    const hasPlaces = placesKeywords.some(k => lowerQuery.includes(k));
    const hasPlan = planKeywords.some(k => lowerQuery.includes(k));

    let intent: 'weather' | 'places' | 'both' | 'full' = 'full';
    if (hasPlan || (hasWeather && hasPlaces)) {
      intent = 'full';
    } else if (hasWeather && !hasPlaces) {
      intent = 'weather';
    } else if (hasPlaces && !hasWeather) {
      intent = 'places';
    } else if (hasWeather && hasPlaces) {
      intent = 'both';
    }

    return {
      placeName: placeName || '',
      intent,
      confidence: placeName ? 0.7 : 0.3,
    };
  }
}

