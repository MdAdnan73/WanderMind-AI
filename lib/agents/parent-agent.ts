/**
 * Parent Agent: Tourism Orchestrator
 * Parses user input, extracts place name, understands intent,
 * and coordinates calls to Weather and Places agents
 */

import { GeocodingAgent, GeocodingResult } from './geocoding-agent';
import { WeatherAgent, WeatherResult } from './weather-agent';
import { PlacesAgent, PlacesResult } from './places-agent';

export type Intent = 'weather' | 'places' | 'both';

export interface TourismResponse {
  success: boolean;
  placeName?: string;
  weather?: WeatherResult | null;
  places?: PlacesResult | null;
  error?: string;
}

export class ParentAgent {
  private geocodingAgent: GeocodingAgent;
  private weatherAgent: WeatherAgent;
  private placesAgent: PlacesAgent;

  constructor(
    geocodingApiUrl?: string,
    weatherApiUrl?: string,
    placesApiUrl?: string
  ) {
    this.geocodingAgent = new GeocodingAgent(geocodingApiUrl);
    this.weatherAgent = new WeatherAgent(weatherApiUrl);
    this.placesAgent = new PlacesAgent(placesApiUrl);
  }

  /**
   * Extract place name from user query
   */
  private extractPlaceName(query: string): string | null {
    // Try multiple patterns to extract place name
    
    // Pattern 1: "in/at/to [Place]" or "going to [Place]"
    const pattern1 = /(?:in|at|to|near|around|going to|visiting|visit)\s+([A-Z][a-zA-Z\s]+?)(?:\s|,|\.|$|\?|what|where)/i;
    let match = query.match(pattern1);
    if (match && match[1]) {
      const place = match[1].trim().replace(/[.,!?]/g, '');
      if (place.length > 1) return place;
    }

    // Pattern 2: "[Place] weather/temperature/places/attractions"
    const pattern2 = /([A-Z][a-zA-Z\s]+?)\s+(?:weather|temperature|temp|places|attractions|to visit|can visit|i can)/i;
    match = query.match(pattern2);
    if (match && match[1]) {
      const place = match[1].trim().replace(/[.,!?]/g, '');
      if (place.length > 1) return place;
    }

    // Pattern 3: "I'm going to [Place]" or "I am going to [Place]"
    const pattern3 = /(?:i'?m|i am)\s+(?:going to|visiting|planning to visit|planning to go to)\s+([A-Z][a-zA-Z\s]+?)(?:\s|,|\.|$|\?|what)/i;
    match = query.match(pattern3);
    if (match && match[1]) {
      const place = match[1].trim().replace(/[.,!?]/g, '');
      if (place.length > 1) return place;
    }

    // Pattern 4: "What's the weather in [Place]"
    const pattern4 = /(?:what'?s|what is)\s+(?:the\s+)?(?:weather|temperature|temp)\s+(?:in|at|for)\s+([A-Z][a-zA-Z\s]+?)(?:\s|,|\.|$|\?)/i;
    match = query.match(pattern4);
    if (match && match[1]) {
      const place = match[1].trim().replace(/[.,!?]/g, '');
      if (place.length > 1) return place;
    }

    // Fallback: find capitalized words/phrases (likely place names)
    const words = query.split(/\s+/);
    const capitalizedWords: string[] = [];
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[.,!?]/g, '');
      if (word.length > 2 && word[0] === word[0].toUpperCase() && /^[A-Z]/.test(word)) {
        // Check if it's not a common word
        const commonWords = ['What', 'Where', 'When', 'How', 'Tell', 'Me', 'About', 'The', 'And', 'Or', 'But', 'Can', 'Will', 'Should'];
        if (!commonWords.includes(word)) {
          capitalizedWords.push(word);
        }
      } else if (capitalizedWords.length > 0) {
        // Stop if we hit a non-capitalized word after finding some
        break;
      }
    }

    if (capitalizedWords.length > 0) {
      return capitalizedWords.join(' ').trim();
    }

    return null;
  }

  /**
   * Determine user intent from query
   */
  private determineIntent(query: string): Intent {
    const lowerQuery = query.toLowerCase();

    const weatherKeywords = ['weather', 'temperature', 'temp', 'rain', 'precipitation', 'forecast'];
    const placesKeywords = ['places', 'attractions', 'visit', 'see', 'tourist', 'sightseeing', 'things to do'];

    const hasWeather = weatherKeywords.some((keyword) => lowerQuery.includes(keyword));
    const hasPlaces = placesKeywords.some((keyword) => lowerQuery.includes(keyword));

    if (hasWeather && hasPlaces) {
      return 'both';
    } else if (hasWeather) {
      return 'weather';
    } else if (hasPlaces) {
      return 'places';
    } else {
      // Default to both if intent is unclear
      return 'both';
    }
  }

  /**
   * Process user query and return tourism information
   */
  async processQuery(query: string): Promise<TourismResponse> {
    try {
      // Extract place name
      const placeName = this.extractPlaceName(query);

      if (!placeName) {
        return {
          success: false,
          error: "I'm not sure this place exists.",
        };
      }

      // Determine intent
      const intent = this.determineIntent(query);

      // Geocode the place
      const geocodeResult = await this.geocodingAgent.geocode(placeName);

      if (!geocodeResult) {
        return {
          success: false,
          error: "I'm not sure this place exists.",
        };
      }

      // Fetch data based on intent
      const [weatherResult, placesResult] = await Promise.allSettled([
        intent === 'weather' || intent === 'both'
          ? this.weatherAgent.getWeather(
              geocodeResult.latitude,
              geocodeResult.longitude,
              geocodeResult.displayName
            )
          : Promise.resolve(null),
        intent === 'places' || intent === 'both'
          ? this.placesAgent.getPlaces(
              geocodeResult.latitude,
              geocodeResult.longitude,
              geocodeResult.displayName
            )
          : Promise.resolve(null),
      ]);

      const weather =
        weatherResult.status === 'fulfilled' ? weatherResult.value : null;
      const places =
        placesResult.status === 'fulfilled' ? placesResult.value : null;

      return {
        success: true,
        placeName: geocodeResult.displayName,
        weather,
        places,
      };
    } catch (error) {
      console.error('Parent agent error:', error);
      return {
        success: false,
        error: 'An error occurred while processing your query. Please try again.',
      };
    }
  }
}

