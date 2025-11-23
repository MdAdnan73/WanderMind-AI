/**
 * Enhanced Parent Agent: Tourism Orchestrator
 * Coordinates all agents with personalization
 */

import { EnhancedGeocodingAgent, GeocodingResult } from './enhanced-geocoding-agent';
import { WeatherSafetyAgent, WeatherSafetyResult } from './weather-safety-agent';
import { EnhancedPlacesAgent, PlacesResult } from './enhanced-places-agent';
import { EventsAgent, EventsResult } from './events-agent';
import { TransportTrafficAgent, TransportResult } from './transport-traffic-agent';
import { RentalAgent, RentalResult } from './rental-agent';
import { HelplineAgent, HelplineResult } from './helpline-agent';
import { UserProfileAgent, AgeGroup, TravelPersona } from './user-profile-agent';
import { InputParserAgent } from './input-parser-agent';

export type Intent = 'weather' | 'places' | 'both' | 'full';

export interface EnhancedTourismResponse {
  success: boolean;
  placeName?: string;
  intent?: Intent;
  geocoding?: GeocodingResult;
  weather?: WeatherSafetyResult | null;
  places?: PlacesResult | null;
  events?: EventsResult | null;
  transport?: TransportResult | null;
  rentals?: RentalResult | null;
  helplines?: HelplineResult | null;
  itinerary?: ItinerarySlot[];
  error?: string;
}

export interface ItinerarySlot {
  date: string;
  time: 'morning' | 'afternoon' | 'evening' | 'night';
  activities: string[];
  dining?: string;
  travelTime?: string;
}

export class EnhancedParentAgent {
  private geocodingAgent: EnhancedGeocodingAgent;
  private weatherAgent: WeatherSafetyAgent;
  private placesAgent: EnhancedPlacesAgent;
  private eventsAgent: EventsAgent;
  private transportAgent: TransportTrafficAgent;
  private rentalAgent: RentalAgent;
  private helplineAgent: HelplineAgent;
  private userProfileAgent: UserProfileAgent;
  private inputParserAgent: InputParserAgent;

  constructor(
    geocodingApiUrl?: string,
    weatherApiUrl?: string,
    overpassUrl?: string,
    eventbriteKey?: string,
    trafficApiKey?: string,
    openTripMapKey?: string,
    openaiKey?: string,
    geminiKey?: string
  ) {
    this.geocodingAgent = new EnhancedGeocodingAgent(geocodingApiUrl);
    this.weatherAgent = new WeatherSafetyAgent(weatherApiUrl);
    this.placesAgent = new EnhancedPlacesAgent(overpassUrl, openTripMapKey);
    this.eventsAgent = new EventsAgent(eventbriteKey);
    this.transportAgent = new TransportTrafficAgent(overpassUrl, trafficApiKey);
    this.rentalAgent = new RentalAgent(overpassUrl);
    this.helplineAgent = new HelplineAgent();
    this.userProfileAgent = new UserProfileAgent();
    this.inputParserAgent = new InputParserAgent(openaiKey, geminiKey);
  }

  /**
   * Determine user intent from query
   */
  private determineIntent(query: string): Intent {
    const lowerQuery = query.toLowerCase();

    const weatherKeywords = ['weather', 'temperature', 'temp', 'rain', 'precipitation', 'forecast', 'hot', 'cold'];
    const placesKeywords = ['places', 'attractions', 'visit', 'see', 'tourist', 'sightseeing', 'things to do', 'where to go'];
    const planKeywords = ['plan', 'planning', 'itinerary', 'trip', 'let\'s plan', 'help me plan'];

    const hasWeather = weatherKeywords.some((keyword) => lowerQuery.includes(keyword));
    const hasPlaces = placesKeywords.some((keyword) => lowerQuery.includes(keyword));
    const hasPlan = planKeywords.some((keyword) => lowerQuery.includes(keyword));

    if (hasPlan || (hasWeather && hasPlaces)) {
      return 'full';
    } else if (hasWeather && !hasPlaces) {
      return 'weather';
    } else if (hasPlaces && !hasWeather) {
      return 'places';
    } else if (hasWeather && hasPlaces) {
      return 'both';
    } else {
      // Default to full planning if intent is unclear
      return 'full';
    }
  }

  /**
   * Extract place name from user query (enhanced)
   */
  private extractPlaceName(query: string): string | null {
    // Normalize but keep original for geocoding
    const normalized = query.trim();
    const lowerQuery = normalized.toLowerCase();

    // Pattern 1: "I'm going to go to [Place]" or "I am going to [Place]" or "I'm going to [Place]"
    // Handles: "i am going to bengaluru lets plan a trip"
    // More specific pattern to handle "going to [place] lets/let's"
    const pattern1a = /(?:i'?m|i am)\s+going\s+to\s+go\s+to\s+([a-zA-Z\s]+?)(?:\s+(?:let'?s|lets|what|where|when|how|plan|,|\.|$|\?)|$)/i;
    let match = normalized.match(pattern1a);
    if (match && match[1]) {
      const place = match[1].trim().replace(/[.,!?]/g, '').replace(/\s+/g, ' ');
      if (place.length > 1) {
        const capitalized = place.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        return capitalized;
      }
    }

    // Pattern 1b: "I am going to [Place] lets/let's"
    const pattern1b = /(?:i'?m|i am)\s+going\s+to\s+([a-zA-Z\s]+?)(?:\s+(?:let'?s|lets|what|where|when|how|plan|,|\.|$|\?)|$)/i;
    match = normalized.match(pattern1b);
    if (match && match[1]) {
      const place = match[1].trim().replace(/[.,!?]/g, '').replace(/\s+/g, ' ');
      if (place.length > 1) {
        const capitalized = place.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        return capitalized;
      }
    }

    // Pattern 1c: "I am going to [Place]" (general)
    const pattern1c = /(?:i'?m|i am)\s+(?:going\s+to|visiting|visit)\s+([a-zA-Z\s]+?)(?:\s|,|\.|$|\?|what|where|when|how|let)/i;
    match = normalized.match(pattern1c);
    if (match && match[1]) {
      const place = match[1].trim().replace(/[.,!?]/g, '').replace(/\s+/g, ' ');
      if (place.length > 1) {
        const capitalized = place.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        return capitalized;
      }
    }

    // Pattern 2: "in/at/to [Place]" or "going to [Place]"
    const pattern2 = /(?:in|at|to|near|around|going to|visiting|visit)\s+([a-zA-Z\s]+?)(?:\s|,|\.|$|\?|what|where)/i;
    match = normalized.match(pattern2);
    if (match && match[1]) {
      const place = match[1].trim().replace(/[.,!?]/g, '').replace(/\s+/g, ' ');
      if (place.length > 1) {
        const capitalized = place.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        return capitalized;
      }
    }

    // Pattern 3: "[Place] weather/temperature/places/attractions"
    const pattern3 = /([a-zA-Z\s]+?)\s+(?:weather|temperature|temp|places|attractions|to visit|can visit|i can)/i;
    match = normalized.match(pattern3);
    if (match && match[1]) {
      const place = match[1].trim().replace(/[.,!?]/g, '').replace(/\s+/g, ' ');
      if (place.length > 1) {
        const capitalized = place.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        return capitalized;
      }
    }

    // Pattern 4: Extract potential place names (words that are not common words)
    // This is a fallback that looks for words after "going to" or similar phrases
    const words = normalized.split(/\s+/);
    const commonWords = ['what', 'where', 'when', 'how', 'tell', 'me', 'about', 'the', 'and', 'or', 'but', 'can', 'will', 'should', 'plan', 'my', 'trip', 'going', 'to', 'go', 'am', 'i', 'is', 'are', 'lets', 'let\'s', 'a', 'an', 'there', 'there', 'visiting', 'visit'];
    const potentialPlaces: string[] = [];
    let foundTrigger = false;

    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[.,!?]/g, '').toLowerCase();
      
      // Check if we found a trigger word like "going", "to", "visiting"
      if (word === 'going' || word === 'to' || word === 'visiting' || word === 'visit') {
        foundTrigger = true;
        continue;
      }
      
      // If we found a trigger, collect the next non-common words
      if (foundTrigger) {
        if (word.length > 2 && !commonWords.includes(word)) {
          potentialPlaces.push(word);
        } else if (potentialPlaces.length > 0 && commonWords.includes(word)) {
          // Stop if we hit a common word after finding potential places
          break;
        }
      }
    }

    if (potentialPlaces.length > 0) {
      const place = potentialPlaces.join(' ');
      // Capitalize first letter of each word
      const capitalized = place.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      return capitalized;
    }

    return null;
  }

  /**
   * Process enhanced query with all agents
   */
  async processEnhancedQuery(
    query: string,
    ageGroup: AgeGroup | null,
    visitDate: string,
    visitDateEnd: string | null,
    persona: TravelPersona | null
  ): Promise<EnhancedTourismResponse> {
    try {
      // Use LLM-based input parser first (falls back to rules if no API key)
      const parsedInput = await this.inputParserAgent.parseInput(query);
      
      let placeName: string | null = null;
      let intent: Intent = 'full';

      if (parsedInput && parsedInput.placeName && parsedInput.placeName.trim().length > 0) {
        placeName = parsedInput.placeName.trim();
        intent = parsedInput.intent;
      } else {
        // Fallback to rule-based extraction
        placeName = this.extractPlaceName(query);
        intent = this.determineIntent(query);
      }

      // Clean place name - ensure it's valid
      if (placeName) {
        placeName = placeName.trim().replace(/\s+/g, ' ');
        placeName = placeName.replace(/[.,!?;:]+$/, '').trim();
        // Remove any trailing common words
        placeName = placeName.replace(/\s+(what|where|when|how|let'?s|lets|plan|the|is|there|are|can|will|and|or)$/i, '').trim();
      }

      if (!placeName || placeName.length < 2) {
        return {
          success: false,
          error: "I'm not sure this place exists.",
        };
      }

      // Geocode with the cleaned place name - use exact match
      const geocodingResult = await this.geocodingAgent.geocode(placeName);
      
      // Verify we got a valid result
      if (!geocodingResult.primary) {
        // Try with just the first word if multi-word (e.g., "New York" -> "New York" first, then try alternatives)
        if (placeName.includes(' ')) {
          const words = placeName.split(' ');
          // Try the full name first, if that failed, the geocoding agent should have tried alternatives
        }
      }

      if (!geocodingResult.primary) {
        return {
          success: false,
          geocoding: geocodingResult,
          error: "I'm not sure this place exists.",
        };
      }

      const { latitude, longitude, displayName } = geocodingResult.primary;
      const endDate = visitDateEnd || visitDate;

      // Call agents based on intent
      const agentPromises: Promise<any>[] = [];
      
      // Weather agent - called for weather, both, or full
      if (intent === 'weather' || intent === 'both' || intent === 'full') {
        agentPromises.push(
          this.weatherAgent.getWeatherSafety(latitude, longitude, displayName, visitDate, ageGroup)
        );
      } else {
        agentPromises.push(Promise.resolve(null));
      }

      // Places agent - called for places, both, or full
      if (intent === 'places' || intent === 'both' || intent === 'full') {
        agentPromises.push(
          this.placesAgent.getPlaces(latitude, longitude, displayName)
        );
      } else {
        agentPromises.push(Promise.resolve(null));
      }

      // Events, transport, rentals, helplines - only for full planning
      if (intent === 'full') {
        agentPromises.push(
          this.eventsAgent.getEvents(latitude, longitude, displayName, visitDate, endDate),
          this.transportAgent.getTransport(latitude, longitude, displayName, visitDate),
          this.rentalAgent.getRentals(latitude, longitude, displayName),
          this.helplineAgent.getHelplines(latitude, longitude)
        );
      } else {
        agentPromises.push(
          Promise.resolve(null),
          Promise.resolve(null),
          Promise.resolve(null),
          Promise.resolve(null)
        );
      }

      const [
        weatherResult,
        placesResult,
        eventsResult,
        transportResult,
        rentalsResult,
        helplinesResult,
      ] = await Promise.allSettled(agentPromises);

      const weather =
        weatherResult.status === 'fulfilled' ? weatherResult.value : null;
      const places =
        placesResult.status === 'fulfilled' ? placesResult.value : null;
      const events =
        eventsResult.status === 'fulfilled' ? eventsResult.value : null;
      const transport =
        transportResult.status === 'fulfilled' ? transportResult.value : null;
      const rentals =
        rentalsResult.status === 'fulfilled' ? rentalsResult.value : null;
      const helplines =
        helplinesResult.status === 'fulfilled' ? helplinesResult.value : null;

      // Apply personalization filters
      const filteredPlaces = this.applyPersonalization(places, ageGroup, persona);
      const filteredEvents = this.filterEvents(events, ageGroup);

      // Build itinerary
      const itinerary = this.buildItinerary(
        filteredPlaces,
        events,
        weather,
        visitDate,
        endDate,
        ageGroup,
        persona
      );

      return {
        success: true,
        placeName: displayName,
        intent,
        geocoding: geocodingResult,
        weather,
        places: filteredPlaces,
        events: filteredEvents,
        transport,
        rentals,
        helplines,
        itinerary: intent === 'full' ? itinerary : undefined,
      };
    } catch (error) {
      console.error('Enhanced parent agent error:', error);
      return {
        success: false,
        error: 'An error occurred while processing your query. Please try again.',
      };
    }
  }

  /**
   * Apply personalization filters based on age group and persona
   */
  private applyPersonalization(
    places: PlacesResult | null,
    ageGroup: AgeGroup | null,
    persona: TravelPersona | null
  ): PlacesResult | null {
    if (!places) return null;

    const rules = this.userProfileAgent.getAgeBasedRules(ageGroup);

    let filteredPlaces = { ...places };

    // Filter based on age group
    if (!rules.includeNightlife) {
      filteredPlaces.pubs = [];
    }

    if (rules.childFriendly) {
      // Prioritize family-friendly attractions
      filteredPlaces.attractions = filteredPlaces.attractions.filter(
        (p) => !p.type?.toLowerCase().includes('adult')
      );
    }

    // Filter based on persona
    if (persona === 'Family') {
      filteredPlaces.pubs = [];
      filteredPlaces.restaurants = filteredPlaces.restaurants.filter(
        (p) => !p.cuisine?.toLowerCase().includes('bar')
      );
    } else if (persona === 'Budget') {
      // Prioritize free/low-cost attractions
      filteredPlaces.attractions = filteredPlaces.attractions.slice(0, 5);
    } else if (persona === 'Luxury') {
      // Could prioritize high-end restaurants, but for now keep all
    }

    return filteredPlaces;
  }

  /**
   * Filter events based on age group
   */
  private filterEvents(events: EventsResult | null, ageGroup: AgeGroup | null): EventsResult | null {
    if (!events) return null;

    const rules = this.userProfileAgent.getAgeBasedRules(ageGroup);

    if (!rules.includeNightlife && events.events) {
      events.events = events.events.filter(
        (e) => !e.category?.toLowerCase().includes('nightlife') && !e.name?.toLowerCase().includes('party')
      );
    }

    return events;
  }

  /**
   * Build itinerary with time slots
   */
  private buildItinerary(
    places: PlacesResult | null,
    events: EventsResult | null,
    weather: WeatherSafetyResult | null,
    visitDate: string,
    visitDateEnd: string | null,
    ageGroup: AgeGroup | null,
    persona: TravelPersona | null
  ): ItinerarySlot[] {
    const itinerary: ItinerarySlot[] = [];
    
    // Calculate number of days
    const startDate = new Date(visitDate);
    const endDate = visitDateEnd ? new Date(visitDateEnd) : startDate;
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const isMultiDay = daysDiff > 1;

    // Generate itinerary for each day
    for (let day = 0; day < daysDiff; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Get events for this specific day
      const dayEvents = events?.events?.filter(e => {
        if (!e.date) return false;
        const eventDate = new Date(e.date).toISOString().split('T')[0];
        return eventDate === dateStr;
      }) || [];

      // Morning slot (8 AM - 12 PM)
      const morningActivities: string[] = [];
      const attractionIndex = day * 2;
      if (places?.attractions && places.attractions[attractionIndex]) {
        morningActivities.push(`Visit ${places.attractions[attractionIndex].name}`);
      }
      if (places?.hiddenGems && places.hiddenGems[day]) {
        morningActivities.push(`Explore ${places.hiddenGems[day].name}`);
      }
      if (morningActivities.length === 0 && places?.attractions && places.attractions.length > 0) {
        morningActivities.push(`Visit ${places.attractions[0].name}`);
      }

      // Afternoon slot (12 PM - 5 PM)
      const afternoonActivities: string[] = [];
      if (places?.attractions && places.attractions[attractionIndex + 1]) {
        afternoonActivities.push(`Visit ${places.attractions[attractionIndex + 1].name}`);
      }
      if (dayEvents.length > 0) {
        afternoonActivities.push(`Attend: ${dayEvents[0].name}${dayEvents[0].time ? ` (${dayEvents[0].time})` : ''}`);
      }
      if (afternoonActivities.length === 0 && places?.attractions && places.attractions.length > 1) {
        afternoonActivities.push(`Visit ${places.attractions[1].name}`);
      }

      // Evening slot (5 PM - 9 PM)
      const eveningActivities: string[] = [];
      const restaurantIndex = day;
      if (places?.restaurants && places.restaurants[restaurantIndex]) {
        eveningActivities.push(`Dine at ${places.restaurants[restaurantIndex].name}`);
      }
      if (places?.attractions && places.attractions.length > attractionIndex + 2) {
        eveningActivities.push(`Visit ${places.attractions[attractionIndex + 2].name}`);
      }

      // Night slot (9 PM - 12 AM) - only for certain age groups and personas
      const nightActivities: string[] = [];
      const rules = this.userProfileAgent.getAgeBasedRules(ageGroup);
      if (rules.includeNightlife && places?.pubs && places.pubs.length > day) {
        nightActivities.push(`Enjoy nightlife at ${places.pubs[day].name}`);
      }

      // Add slots for this day
      if (morningActivities.length > 0) {
        itinerary.push({
          date: dateStr,
          time: 'morning',
          activities: morningActivities,
          dining: places?.restaurants?.[restaurantIndex]?.name || 'Local breakfast spot',
          travelTime: '15-20 min walking',
        });
      }

      if (afternoonActivities.length > 0) {
        itinerary.push({
          date: dateStr,
          time: 'afternoon',
          activities: afternoonActivities,
          dining: places?.restaurants?.[restaurantIndex + 1]?.name || places?.restaurants?.[0]?.name || 'Local lunch spot',
          travelTime: '20-30 min',
        });
      }

      if (eveningActivities.length > 0) {
        itinerary.push({
          date: dateStr,
          time: 'evening',
          activities: eveningActivities,
          dining: places?.restaurants?.[restaurantIndex + 2]?.name || places?.restaurants?.[restaurantIndex]?.name || 'Local dinner spot',
          travelTime: '10-15 min',
        });
      }

      if (nightActivities.length > 0) {
        itinerary.push({
          date: dateStr,
          time: 'night',
          activities: nightActivities,
          travelTime: '10-15 min',
        });
      }
    }

    return itinerary;
  }
}

