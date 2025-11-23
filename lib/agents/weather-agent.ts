/**
 * Weather Agent
 * Fetches real weather data using Open-Meteo API
 */

export interface WeatherResult {
  temperature: number;
  precipitationProbability: number;
  placeName: string;
}

export class WeatherAgent {
  private apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || 'https://api.open-meteo.com';
  }

  /**
   * Get current weather for a location
   * @param latitude - Latitude of the location
   * @param longitude - Longitude of the location
   * @param placeName - Name of the place for display
   * @returns WeatherResult or null if fetch fails
   */
  async getWeather(
    latitude: number,
    longitude: number,
    placeName: string
  ): Promise<WeatherResult | null> {
    try {
      const url = `${this.apiUrl}/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=precipitation_probability`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Weather API error: ${response.status}`);
        return null;
      }

      const data = await response.json();

      if (!data || !data.current_weather) {
        return null;
      }

      const currentWeather = data.current_weather;
      const hourly = data.hourly;

      // Get precipitation probability for current hour
      let precipitationProbability = 0;
      if (hourly && hourly.precipitation_probability && hourly.time) {
        const currentTime = currentWeather.time;
        const timeIndex = hourly.time.findIndex((t: string) => t === currentTime);
        if (timeIndex >= 0 && hourly.precipitation_probability[timeIndex] !== undefined) {
          precipitationProbability = hourly.precipitation_probability[timeIndex];
        }
      }

      return {
        temperature: Math.round(currentWeather.temperature),
        precipitationProbability: Math.round(precipitationProbability),
        placeName,
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      return null;
    }
  }

  /**
   * Format weather result as a string
   */
  formatWeather(weather: WeatherResult): string {
    return `In ${weather.placeName} it's currently ${weather.temperature}°C with a ${weather.precipitationProbability} percent chance of rain.`;
  }
}

