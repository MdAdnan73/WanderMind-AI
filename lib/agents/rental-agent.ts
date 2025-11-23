/**
 * Rental Agent
 * Finds bike and car rental locations
 */

export interface Rental {
  name: string;
  type: 'bicycle' | 'car';
  latitude: number;
  longitude: number;
  contact?: string;
  website?: string;
  estimatedPrice?: string;
}

export interface RentalResult {
  rentals: Rental[];
  placeName: string;
  hasData: boolean;
}

export class RentalAgent {
  private overpassUrl: string;

  constructor(overpassUrl?: string) {
    this.overpassUrl = overpassUrl || 'https://overpass-api.de/api/interpreter';
  }

  /**
   * Get rental locations
   */
  async getRentals(
    latitude: number,
    longitude: number,
    placeName: string
  ): Promise<RentalResult> {
    const rentals = await this.fetchRentals(latitude, longitude);

    return {
      rentals: rentals.slice(0, 10),
      placeName,
      hasData: rentals.length > 0,
    };
  }

  private async fetchRentals(latitude: number, longitude: number): Promise<Rental[]> {
    const query = `[out:json][timeout:25];
(
  node["amenity"="bicycle_rental"](around:10000,${latitude},${longitude});
  node["amenity"="car_rental"](around:10000,${latitude},${longitude});
  node["shop"="bicycle"](around:10000,${latitude},${longitude});
  way["amenity"="bicycle_rental"](around:10000,${latitude},${longitude});
  way["amenity"="car_rental"](around:10000,${latitude},${longitude});
);
out body;
>;
out skel qt;`;

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

          const isCar = element.tags.amenity === 'car_rental';
          const isBike =
            element.tags.amenity === 'bicycle_rental' || element.tags.shop === 'bicycle';

          // Estimate prices based on city tier (simplified)
          const estimatedPrice = isCar
            ? '$30-50/day'
            : isBike
            ? '$5-15/day or $1-3/hour'
            : undefined;

          return {
            name: element.tags.name,
            type: isCar ? ('car' as const) : ('bicycle' as const),
            latitude: lat ? parseFloat(lat) : 0,
            longitude: lon ? parseFloat(lon) : 0,
            contact: element.tags.phone,
            website: element.tags.website,
            estimatedPrice,
          };
        })
        .filter((r: Rental) => r.latitude !== 0 && r.longitude !== 0);
    } catch (error) {
      console.error('Rental fetch error:', error);
      return [];
    }
  }
}

