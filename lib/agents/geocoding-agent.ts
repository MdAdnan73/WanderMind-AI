/**
 * Geocoding Agent
 * Converts place names to latitude/longitude coordinates using Nominatim API
 */

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

export class GeocodingAgent {
  private apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || 'https://nominatim.openstreetmap.org';
  }

  /**
   * Geocode a place name to coordinates
   * @param placeName - The name of the place to geocode
   * @returns GeocodingResult or null if place not found
   */
  async geocode(placeName: string): Promise<GeocodingResult | null> {
    try {
      const encodedPlace = encodeURIComponent(placeName);
      const url = `${this.apiUrl}/search?q=${encodedPlace}&format=json&limit=1`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Tourism-Multi-Agent-System/1.0',
        },
      });

      if (!response.ok) {
        console.error(`Geocoding API error: ${response.status}`);
        return null;
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        return null;
      }

      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name || placeName,
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }
}

