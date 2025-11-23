/**
 * Transport & Traffic Agent
 * Provides metro/subway info and traffic advisories
 */

export interface MetroStation {
  name: string;
  line?: string;
  latitude: number;
  longitude: number;
}

export interface TrafficAdvisory {
  message: string;
  severity: 'low' | 'medium' | 'high';
  rushHourTimes?: string;
  alternatives: string[];
}

export interface TransportResult {
  metroStations: MetroStation[];
  trafficAdvisory: TrafficAdvisory | null;
  placeName: string;
  hasData: boolean;
}

export class TransportTrafficAgent {
  private overpassUrl: string;
  private trafficApiKey?: string;

  constructor(overpassUrl?: string, trafficApiKey?: string) {
    this.overpassUrl = overpassUrl || 'https://overpass-api.de/api/interpreter';
    this.trafficApiKey = trafficApiKey;
  }

  /**
   * Get transport and traffic information
   */
  async getTransport(
    latitude: number,
    longitude: number,
    placeName: string,
    visitDate: string
  ): Promise<TransportResult> {
    const [metroStations, trafficAdvisory] = await Promise.all([
      this.getMetroStations(latitude, longitude),
      this.getTrafficAdvisory(latitude, longitude, visitDate),
    ]);

    return {
      metroStations: metroStations.slice(0, 10),
      trafficAdvisory,
      placeName,
      hasData: metroStations.length > 0,
    };
  }

  private async getMetroStations(latitude: number, longitude: number): Promise<MetroStation[]> {
    const query = `[out:json][timeout:25];
(
  node["public_transport"="station"](around:10000,${latitude},${longitude});
  node["railway"="station"]["subway"="yes"](around:10000,${latitude},${longitude});
  node["railway"="station"]["station"="subway"](around:10000,${latitude},${longitude});
  way["public_transport"="station"](around:10000,${latitude},${longitude});
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

          return {
            name: element.tags.name,
            line: element.tags.ref || element.tags.route,
            latitude: lat ? parseFloat(lat) : 0,
            longitude: lon ? parseFloat(lon) : 0,
          };
        })
        .filter((s: MetroStation) => s.latitude !== 0 && s.longitude !== 0);
    } catch (error) {
      console.error('Metro stations error:', error);
      return [];
    }
  }

  private async getTrafficAdvisory(
    latitude: number,
    longitude: number,
    visitDate: string
  ): Promise<TrafficAdvisory | null> {
    // Rule-based traffic advisory
    const visitDateObj = new Date(visitDate);
    const dayOfWeek = visitDateObj.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
    const hour = visitDateObj.getHours();

    // Rush hour detection
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);

    if (isWeekday && isRushHour) {
      return {
        message: `High traffic expected between ${isRushHour ? (hour < 12 ? '7-9 AM' : '5-7 PM') : 'peak hours'}`,
        severity: 'high',
        rushHourTimes: hour < 12 ? '7:00 AM - 9:00 AM' : '5:00 PM - 7:00 PM',
        alternatives: [
          'Consider using metro/subway to avoid traffic',
          'Bike rental available for short distances',
          'Plan to travel outside rush hours if possible',
        ],
      };
    }

    if (isWeekday) {
      return {
        message: 'Moderate traffic expected on weekdays',
        severity: 'medium',
        alternatives: [
          'Metro/subway recommended for city center',
          'Check real-time traffic before traveling',
        ],
      };
    }

    return {
      message: 'Traffic conditions should be normal',
      severity: 'low',
      alternatives: ['Public transport available', 'Consider walking for short distances'],
    };
  }
}

