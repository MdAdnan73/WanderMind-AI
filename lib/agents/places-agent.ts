/**
 * Places Agent
 * Fetches tourist attractions using Overpass API
 */

export interface Place {
  name: string;
  type?: string;
}

export interface PlacesResult {
  places: Place[];
  placeName: string;
}

export class PlacesAgent {
  private apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || 'https://overpass-api.de/api/interpreter';
  }

  /**
   * Get tourist attractions near a location
   * @param latitude - Latitude of the location
   * @param longitude - Longitude of the location
   * @param placeName - Name of the place for display
   * @returns PlacesResult or null if fetch fails
   */
  async getPlaces(
    latitude: number,
    longitude: number,
    placeName: string
  ): Promise<PlacesResult | null> {
    try {
      // Overpass query to find tourism nodes within 5000m radius
      // Format: [out:json]; node["tourism"](around:5000,lat,lon); out 5;
      const query = `[out:json][timeout:25];
node["tourism"](around:5000,${latitude},${longitude});
out 5;`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        console.error(`Places API error: ${response.status}`);
        return {
          places: [],
          placeName,
        };
      }

      const data = await response.json();

      if (!data || !data.elements || data.elements.length === 0) {
        return {
          places: [],
          placeName,
        };
      }

      // Extract place names from elements
      // Filter for elements with name tags and tourism tags
      const places: Place[] = data.elements
        .filter((element: any) => {
          return (
            element.tags &&
            element.tags.name &&
            (element.tags.tourism || element.tags.amenity || element.tags.leisure)
          );
        })
        .map((element: any) => ({
          name: element.tags.name,
          type: element.tags.tourism || element.tags.amenity || element.tags.leisure,
        }))
        .slice(0, 5); // Limit to 5 places

      return {
        places,
        placeName,
      };
    } catch (error) {
      console.error('Places fetch error:', error);
      return {
        places: [],
        placeName,
      };
    }
  }

  /**
   * Format places result as a string
   */
  formatPlaces(placesResult: PlacesResult): string {
    if (placesResult.places.length === 0) {
      return `No tourist attractions found near ${placesResult.placeName}.`;
    }

    const placeList = placesResult.places
      .map((place) => `• ${place.name}`)
      .join('\n');

    return `In ${placesResult.placeName} these are the places you can go:\n${placeList}`;
  }
}

