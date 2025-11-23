/**
 * Enhanced Places Agent
 * Fetches tourist attractions, hidden gems, restaurants, pubs, cinemas, rentals
 */

export interface Place {
  name: string;
  type: string;
  category: 'attraction' | 'hidden-gem' | 'restaurant' | 'pub' | 'cinema' | 'rental';
  latitude: number;
  longitude: number;
  description?: string;
  cuisine?: string;
  openingHours?: string;
  contact?: string;
  popularity?: number;
}

export interface PlacesResult {
  attractions: Place[];
  hiddenGems: Place[];
  restaurants: Place[];
  pubs: Place[];
  cinemas: Place[];
  rentals: Place[];
  placeName: string;
}

export class EnhancedPlacesAgent {
  private overpassUrl: string;
  private openTripMapKey?: string;

  constructor(overpassUrl?: string, openTripMapKey?: string) {
    this.overpassUrl = overpassUrl || 'https://overpass-api.de/api/interpreter';
    this.openTripMapKey = openTripMapKey;
  }

  /**
   * Get all places (attractions, restaurants, etc.)
   */
  async getPlaces(
    latitude: number,
    longitude: number,
    placeName: string
  ): Promise<PlacesResult | null> {
    try {
      // Fetch all categories in parallel
      const [attractions, restaurants, pubs, cinemas, rentals] = await Promise.allSettled([
        this.getAttractions(latitude, longitude),
        this.getRestaurants(latitude, longitude),
        this.getPubs(latitude, longitude),
        this.getCinemas(latitude, longitude),
        this.getRentals(latitude, longitude),
      ]);

      const attractionsList =
        attractions.status === 'fulfilled' ? attractions.value : [];
      const restaurantsList =
        restaurants.status === 'fulfilled' ? restaurants.value : [];
      const pubsList = pubs.status === 'fulfilled' ? pubs.value : [];
      const cinemasList = cinemas.status === 'fulfilled' ? cinemas.value : [];
      const rentalsList = rentals.status === 'fulfilled' ? rentals.value : [];

      // Separate hidden gems (less popular attractions)
      const hiddenGems = attractionsList
        .filter((p) => !p.popularity || p.popularity < 0.5)
        .slice(0, 5);
      const mainAttractions = attractionsList
        .filter((p) => p.popularity && p.popularity >= 0.5)
        .slice(0, 5);

      return {
        attractions: mainAttractions,
        hiddenGems,
        restaurants: restaurantsList.slice(0, 10),
        pubs: pubsList.slice(0, 10),
        cinemas: cinemasList.slice(0, 5),
        rentals: rentalsList.slice(0, 10),
        placeName,
      };
    } catch (error) {
      console.error('Enhanced places error:', error);
      return null;
    }
  }

  private async getAttractions(latitude: number, longitude: number): Promise<Place[]> {
    const query = `[out:json][timeout:25];
(
  node["tourism"~"^(attraction|museum|gallery|zoo|theme_park)$"](around:10000,${latitude},${longitude});
  way["tourism"~"^(attraction|museum|gallery|zoo|theme_park)$"](around:10000,${latitude},${longitude});
);
out body;
>;
out skel qt;`;

    return this.queryOverpass(query, 'attraction');
  }

  private async getRestaurants(latitude: number, longitude: number): Promise<Place[]> {
    const query = `[out:json][timeout:25];
(
  node["amenity"="restaurant"](around:10000,${latitude},${longitude});
  way["amenity"="restaurant"](around:10000,${latitude},${longitude});
);
out body;
>;
out skel qt;`;

    return this.queryOverpass(query, 'restaurant');
  }

  private async getPubs(latitude: number, longitude: number): Promise<Place[]> {
    const query = `[out:json][timeout:25];
(
  node["amenity"~"^(pub|bar|nightclub)$"](around:10000,${latitude},${longitude});
  way["amenity"~"^(pub|bar|nightclub)$"](around:10000,${latitude},${longitude});
);
out body;
>;
out skel qt;`;

    return this.queryOverpass(query, 'pub');
  }

  private async getCinemas(latitude: number, longitude: number): Promise<Place[]> {
    const query = `[out:json][timeout:25];
(
  node["amenity"="cinema"](around:10000,${latitude},${longitude});
  way["amenity"="cinema"](around:10000,${latitude},${longitude});
);
out body;
>;
out skel qt;`;

    return this.queryOverpass(query, 'cinema');
  }

  private async getRentals(latitude: number, longitude: number): Promise<Place[]> {
    const query = `[out:json][timeout:25];
(
  node["amenity"~"^(bicycle_rental|car_rental)$"](around:10000,${latitude},${longitude});
  way["amenity"~"^(bicycle_rental|car_rental)$"](around:10000,${latitude},${longitude});
  node["shop"="bicycle"](around:10000,${latitude},${longitude});
  way["shop"="bicycle"](around:10000,${latitude},${longitude});
);
out body;
>;
out skel qt;`;

    return this.queryOverpass(query, 'rental');
  }

  private async queryOverpass(query: string, category: Place['category']): Promise<Place[]> {
    try {
      const response = await fetch(this.overpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();

      if (!data || !data.elements) {
        return [];
      }

      return data.elements
        .filter((element: any) => element.tags && element.tags.name)
        .map((element: any) => {
          const lat = element.lat || (element.center && element.center.lat);
          const lon = element.lon || (element.center && element.center.lon);

          return {
            name: element.tags.name,
            type: element.tags.tourism || element.tags.amenity || element.tags.shop || category,
            category,
            latitude: lat ? parseFloat(lat) : 0,
            longitude: lon ? parseFloat(lon) : 0,
            description: element.tags.description || element.tags.wikipedia,
            cuisine: element.tags.cuisine,
            openingHours: element.tags.opening_hours,
            contact: element.tags.phone,
            popularity: element.tags.popularity ? parseFloat(element.tags.popularity) : undefined,
          };
        })
        .filter((p: Place) => p.latitude !== 0 && p.longitude !== 0);
    } catch (error) {
      console.error(`Overpass query error for ${category}:`, error);
      return [];
    }
  }
}

